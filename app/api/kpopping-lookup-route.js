import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ url: null });
  }

  try {
    const slug = name.trim().replace(/\s+/g, '-');
    const candidateUrl = `https://kpopping.com/profiles/group/${encodeURIComponent(slug)}`;

    const res = await fetch(candidateUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ENGENEUS/1.0)' },
    });

    if (res.ok) {
      const html = await res.text();
      // Sanity check: a real profile page should actually mention the artist
      // name somewhere — this avoids false-positive matches on a generic page.
      if (html.toLowerCase().includes(name.toLowerCase().slice(0, 4))) {
        return NextResponse.json({ url: candidateUrl });
      }
    }

    return NextResponse.json({ url: null });
  } catch (error) {
    return NextResponse.json({ url: null });
  }
}
