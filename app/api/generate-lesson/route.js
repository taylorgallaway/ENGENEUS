import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Generating a full lesson can take longer than Vercel's default timeout —
// this raises the ceiling so a slower Gemini response doesn't get cut off.
export const maxDuration = 60;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function extractJSON(text) {
  // Gemini sometimes wraps JSON in markdown code fences — strip those if present
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  return JSON.parse(cleaned);
}

export async function POST(request) {
  const { userId, lyrics, songName, artist } = await request.json();

  if (!userId || !lyrics) {
    return NextResponse.json({ error: 'Missing user ID or lyrics' }, { status: 400 });
  }

  // 1. Get the user's saved Gemini key
  const { data: keyRow, error: keyLookupError } = await supabaseAdmin
    .from('user_api_keys')
    .select('api_key')
    .eq('user_id', userId)
    .single();

  if (keyLookupError || !keyRow) {
    return NextResponse.json({ error: 'No API key found — connect one in Studio first.' }, { status: 400 });
  }

  // 2. Check the per-user cache before spending any AI credits
  const lyricsHash = crypto.createHash('sha256').update(lyrics.trim()).digest('hex');

  const { data: cached } = await supabaseAdmin
    .from('saved_lessons')
    .select('lesson_data')
    .eq('user_id', userId)
    .eq('lyrics_hash', lyricsHash)
    .single();

  if (cached) {
    return NextResponse.json({ lesson: cached.lesson_data, cached: true });
  }

  // 3. Not cached — generate it fresh using the user's own key
  const prompt = `You are building real teaching content for a Duolingo-style app that teaches Korean through K-pop lyrics. Do NOT just romanize or transliterate the lyrics — extract genuine language-learning content.

Do two things:

1. Build a deduplicated VOCABULARY list of the meaningful, useful Korean words that appear in the song (skip pure filler/particles unless they're genuinely useful to learn). For each word give: "korean", "romanization", and "english" (a clear, simple meaning).

2. Break the lyrics into individual LINES. For each line give:
- "korean": the original line
- "english": a natural, singable English translation of the full line
- "skipReason": "english" if the line is already in English, "repeat" if it's an exact repeat of an earlier line, or null otherwise
- "wordKoreans": an array of the Korean words (from the vocabulary list above) that appear in this specific line

Song: ${songName || 'Unknown'} by ${artist || 'Unknown'}

Lyrics:
${lyrics}

Respond with ONLY valid JSON in this exact shape, no markdown formatting, no commentary, no extra keys:
{"songName": "...", "artist": "...", "vocabulary": [{"korean": "...", "romanization": "...", "english": "..."}], "lines": [{"korean": "...", "english": "...", "skipReason": null, "wordKoreans": ["..."]}]}`;

  let geminiRes;
  try {
    geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': keyRow.api_key,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
  } catch (fetchErr) {
    return NextResponse.json({ error: `Could not reach Gemini: ${fetchErr.message}` }, { status: 500 });
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return NextResponse.json(
      { error: `Gemini API error (status ${geminiRes.status}): ${errText.slice(0, 300)}` },
      { status: 500 }
    );
  }

  const geminiData = await geminiRes.json();
  const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    return NextResponse.json({ error: 'Gemini returned an empty response.' }, { status: 500 });
  }

  let lesson;
  try {
    lesson = extractJSON(rawText);
  } catch (parseErr) {
    return NextResponse.json(
      { error: `Could not parse lesson JSON: ${parseErr.message}`, raw: rawText.slice(0, 500) },
      { status: 500 }
    );
  }

  // 4. Save to this user's personal cache
  await supabaseAdmin.from('saved_lessons').insert({
    user_id: userId,
    lyrics_hash: lyricsHash,
    song_name: songName || lesson.songName || null,
    artist: artist || lesson.artist || null,
    lesson_data: lesson,
  });

  return NextResponse.json({ lesson, cached: false });
}
