import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ url: null, debug: 'no name provided' });
  }

  try {
    const slug = name.trim().replace(/\s+/g, '-');
    const candidateUrl = `https://kpopping.com/profiles/group/${encodeURIComponent(slug)}`;

    const res = await fetch(candidateUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ENGENEUS/1.0)' },
    });

    if (res.ok) {
      const html = await res.text();
      const matched = html.toLowerCase().includes(name.toLowerCase().slice(0, 4));
      if (matched) {
        return NextResponse.json({ url: candidateUrl });
      }
      return NextResponse.json({
        url: null,
        debug: `fetched OK but content check failed for "${name}"`,
        candidateUrl,
      });
    }

    return NextResponse.json({
      url: null,
      debug: `fetch returned status ${res.status}`,
      candidateUrl,
    });
  } catch (error) {
    return NextResponse.json({
      url: null,
      debug: `exception: ${error.message}`,
    });
  }
}
