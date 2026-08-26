import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const raw = formData.get('data');
    const payload = JSON.parse(raw);

    // Confirms this request genuinely came from Ko-fi, not someone spoofing it.
    if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 403 });
    }

    const message = (payload.message || '').toLowerCase();
    const amount = parseFloat(payload.amount) || 0;

    // Ko-fi has no idea who our users are — we match by asking donors to put
    // their ENGENEUS username in the Ko-fi message box.
    const { data: profiles } = await supabaseAdmin.from('profiles').select('id, username');
    const matched = (profiles || []).find(
      (p) => p.username && message.includes(p.username.toLowerCase())
    );

    if (matched) {
      await supabaseAdmin.from('donations').insert({
        user_id: matched.id,
        amount,
        kofi_transaction_id: payload.kofi_transaction_id,
        message: payload.message,
      });
      await supabaseAdmin.from('user_badges').insert({ user_id: matched.id, badge_id: 'bought_coffee' });
    }
    // If nobody matched, we just don't log it — Taylor can still manually
    // connect it later after seeing it in the Ko-fi dashboard directly.

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
