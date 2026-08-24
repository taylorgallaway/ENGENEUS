import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ url: null });
  }

  try {
    const res = await fetch(
      `https://kprofiles.com/wp-json/wp/v2/search?search=${encodeURIComponent(name)}&per_page=1`,
      { headers: { 'User-Agent': 'ENGENEUS' } }
    );
    if (!res.ok) {
      return NextResponse.json({ url: null });
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].url) {
      return NextResponse.json({ url: data[0].url });
    }
    return NextResponse.json({ url: null });
  } catch (error) {
    return NextResponse.json({ url: null });
  }
}
