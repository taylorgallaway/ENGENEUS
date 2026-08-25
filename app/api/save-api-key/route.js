import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { userId, apiKey } = await request.json();

  if (!userId || !apiKey) {
    return NextResponse.json({ error: 'Missing user ID or API key' }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server.' }, { status: 500 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error: keyError } = await supabaseAdmin
    .from('user_api_keys')
    .upsert({ user_id: userId, api_key: apiKey });

  if (keyError) {
    return NextResponse.json(
      {
        error: keyError.message,
        code: keyError.code,
        details: keyError.details,
        hint: keyError.hint,
      },
      { status: 500 }
    );
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ has_api_key: true })
    .eq('id', userId);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
