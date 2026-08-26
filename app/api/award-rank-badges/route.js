import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function award(userId, badgeId) {
  await supabaseAdmin.from('user_badges').insert({ user_id: userId, badge_id: badgeId });
  // Duplicate-key errors (already has it) are expected and fine to ignore.
}

export async function POST() {
  const { data: profiles } = await supabaseAdmin.from('profiles').select('id, followed_artists');
  const totalUsers = (profiles || []).length;

  // --- Top Five: top 5 users by distinct songs learned ---
  const { data: lessons } = await supabaseAdmin.from('completed_lessons').select('user_id');
  const lessonCounts = {};
  (lessons || []).forEach((row) => {
    lessonCounts[row.user_id] = (lessonCounts[row.user_id] || 0) + 1;
  });
  const topFive = Object.entries(lessonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId]) => userId);
  for (const userId of topFive) {
    await award(userId, 'top_five');
  }

  // --- Top Fandom: everyone following whichever artist has the most fandom chat activity ---
  const { data: fandomMsgs } = await supabaseAdmin.from('fandom_messages').select('artist');
  const fandomCounts = {};
  (fandomMsgs || []).forEach((row) => {
    fandomCounts[row.artist] = (fandomCounts[row.artist] || 0) + 1;
  });
  const topFandomEntry = Object.entries(fandomCounts).sort((a, b) => b[1] - a[1])[0];
  if (topFandomEntry) {
    const topFandomArtist = topFandomEntry[0];
    const followers = (profiles || []).filter((p) => (p.followed_artists || []).includes(topFandomArtist));
    for (const p of followers) {
      await award(p.id, 'top_fandom');
    }
  }

  // --- 1% Contributor: only turns on once there are at least 100 users ---
  if (totalUsers >= 100) {
    const { data: personalMsgs } = await supabaseAdmin.from('messages').select('sender_id');
    const contributorCounts = {};
    (personalMsgs || []).forEach((row) => {
      contributorCounts[row.sender_id] = (contributorCounts[row.sender_id] || 0) + 1;
    });
    const { data: fandomMsgsWithSender } = await supabaseAdmin.from('fandom_messages').select('sender_id');
    (fandomMsgsWithSender || []).forEach((row) => {
      contributorCounts[row.sender_id] = (contributorCounts[row.sender_id] || 0) + 1;
    });

    const cutoff = Math.max(1, Math.ceil(totalUsers * 0.01));
    const topContributors = Object.entries(contributorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, cutoff)
      .map(([userId]) => userId);
    for (const userId of topContributors) {
      await award(userId, 'one_percent_contributor');
    }
  }

  return NextResponse.json({ success: true, totalUsers });
}
