import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Requires RESEND_API_KEY in Vercel env vars, and a verified sending domain
// in Resend before this can actually deliver — see setup notes.
export async function POST(request) {
  try {
    const { recipientId, senderUsername, messagePreview } = await request.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(recipientId);
    const recipientEmail = authUser?.user?.email;
    if (!recipientEmail) {
      return NextResponse.json({ sent: false, reason: 'no email on file' });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ENGENEUS <notifications@yourdomain.com>', // update once domain is verified in Resend
        to: recipientEmail,
        subject: `${senderUsername} sent you a message on ENGENEUS`,
        html: `<p><strong>${senderUsername}</strong> sent you a message:</p><p>"${messagePreview}"</p><p><a href="https://engeneus.vercel.app">Open ENGENEUS</a></p>`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ sent: false, reason: errText });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    return NextResponse.json({ sent: false, reason: error.message });
  }
}
