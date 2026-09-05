import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const THRESHOLD = 100;
const WINDOW_MINUTES = 30;
const COOLDOWN_MINUTES = 30; // don't re-alert for the same burst

export async function POST(request) {
  try {
    const { artist } = await request.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Count messages in this room within the last 30 minutes
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from('fandom_messages')
      .select('id', { count: 'exact', head: true })
      .eq('artist', artist)
      .gte('created_at', windowStart);

    if ((count || 0) < THRESHOLD) {
      return NextResponse.json({ sent: false, reason: 'below threshold', count });
    }

    // Check cooldown — has this artist already been alerted recently?
    const { data: lastAlert } = await supabaseAdmin
      .from('fandom_alert_log')
      .select('alerted_at')
      .eq('artist', artist)
      .maybeSingle();

    if (lastAlert) {
      const minutesSince = (Date.now() - new Date(lastAlert.alerted_at).getTime()) / 60000;
      if (minutesSince < COOLDOWN_MINUTES) {
        return NextResponse.json({ sent: false, reason: 'in cooldown' });
      }
    }

    // Find followers of this artist
    const { data: followers } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .contains('followed_artists', [artist]);

    if (!followers || followers.length === 0) {
      return NextResponse.json({ sent: false, reason: 'no followers found' });
    }

    // Record the alert immediately to prevent duplicate sends from concurrent requests
    await supabaseAdmin.from('fandom_alert_log').upsert({ artist, alerted_at: new Date().toISOString() });

    // Email every follower who has an email on file
    let sentCount = 0;
    for (const follower of followers) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(follower.id);
      const email = authUser?.user?.email;
      if (!email) continue;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ENGENEUS <notifications@yourdomain.com>', // update once domain is verified in Resend
          to: email,
          subject: `${artist}'s fandom chat is popping off right now!`,
          html: `<p>The ${artist} fandom chat just hit ${count} messages in the last 30 minutes — come see what's happening!</p><p><a href="https://engeneus.vercel.app">Open ENGENEUS</a></p>`,
        }),
      });
      if (res.ok) sentCount++;
    }

    return NextResponse.json({ sent: true, sentCount });
  } catch (error) {
    return NextResponse.json({ sent: false, reason: error.message });
  }
}
