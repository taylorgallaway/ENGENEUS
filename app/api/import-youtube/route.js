import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { YOUTUBE_CHANNELS } from '../../../lib/youtubeChannels';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Visit this URL repeatedly to find official music videos for songs by
// artists whose label channel we know — each visit processes a small batch
// and remembers its place, same pattern as the Spotify import:
//   https://engeneus.vercel.app/api/import-youtube
// Keep visiting until the response says "allDone": true.

const BATCH_SIZE = 10;
const channelIdCache = {};

async function resolveChannelId(handle, apiKey) {
  if (channelIdCache[handle]) return channelIdCache[handle];
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle.replace('@', ''))}&key=${apiKey}`
  );
  const data = await res.json();
  const id = data.items?.[0]?.id || null;
  channelIdCache[handle] = id;
  return id;
}

async function searchInChannel(channelId, query, apiKey) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${apiKey}`
  );
  const data = await res.json();
  return data.items?.[0]?.id?.videoId || null;
}

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const apiKey = process.env.YOUTUBE_API_KEY;

  const knownArtists = Object.keys(YOUTUBE_CHANNELS);

  // Find songs by known-channel artists that haven't been attempted yet
  const { data: attempted } = await supabase.from('youtube_attempted').select('song_id');
  const attemptedIds = new Set((attempted || []).map((a) => a.song_id));

  const { data: candidateSongs } = await supabase
    .from('songs')
    .select('id, artist, title, official_title')
    .in('artist', knownArtists);

  const remaining = (candidateSongs || []).filter((s) => !attemptedIds.has(s.id));

  if (remaining.length === 0) {
    return NextResponse.json({ allDone: true, message: 'Every song by a known-label artist has been attempted!' });
  }

  const batch = remaining.slice(0, BATCH_SIZE);
  const results = [];

  for (const song of batch) {
    try {
      const handle = YOUTUBE_CHANNELS[song.artist];
      const channelId = await resolveChannelId(handle, apiKey);

      if (!channelId) {
        results.push({ song: `${song.artist} - ${song.title}`, status: 'could not resolve channel' });
      } else {
        const query = `${song.artist} ${song.official_title || song.title}`;
        const videoId = await searchInChannel(channelId, query, apiKey);

        if (videoId) {
          await supabase.from('songs').update({ youtube_video_id: videoId }).eq('id', song.id);
          results.push({ song: `${song.artist} - ${song.title}`, status: `found: ${videoId}` });
        } else {
          results.push({ song: `${song.artist} - ${song.title}`, status: 'no video found' });
        }
      }

      await supabase.from('youtube_attempted').upsert({ song_id: song.id });
    } catch (e) {
      results.push({ song: `${song.artist} - ${song.title}`, status: `error: ${e.message}` });
    }
  }

  return NextResponse.json({
    allDone: remaining.length <= batch.length,
    remainingCount: remaining.length - batch.length,
    thisBatch: results,
  });
}
