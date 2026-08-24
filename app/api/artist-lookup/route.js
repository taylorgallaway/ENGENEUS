import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ url: null, debug: 'no name provided' });
  }

  try {
    const res = await fetch(
      `https://kprofiles.com/wp-json/wp/v2/search?search=${encodeURIComponent(name)}&per_page=1`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ENGENEUS/1.0)' } }
    );
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      return NextResponse.json({
        url: null,
        debug: `status ${res.status}, response wasn't JSON: ${text.slice(0, 300)}`,
      });
    }

    if (Array.isArray(data) && data.length > 0 && data[0].url) {
      return NextResponse.json({ url: data[0].url, debug: 'ok' });
    }

    return NextResponse.json({
      url: null,
      debug: `status ${res.status}, data: ${JSON.stringify(data).slice(0, 300)}`,
    });
  } catch (error) {
    return NextResponse.json({ url: null, debug: `fetch error: ${error.message}` });
  }
}
