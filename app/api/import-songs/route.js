import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ARTIST_DIRECTORY } from '../../../lib/artistDirectory';

// Prevents Next.js from trying to run this at build time (it would time out
// building nearly 1,900 artists' worth of API calls before the site could
// even deploy). This makes it run only when actually visited.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Visit this URL repeatedly in your browser to import songs in small
// batches — each visit picks up automatically where the last one left off:
//   https://engeneus.vercel.app/api/import-songs
// Keep visiting until the response says "allDone": true.

const BATCH_SIZE = 15;

async function getSpotifyToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

async function searchArtist(name, token) {
  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.artists?.items?.[0] || null;
}

async function getAlbums(artistId, token) {
  let albums = [];
  let url = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=50`;
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    albums = albums.concat(data.items || []);
    url = data.next;
  }
  return albums;
}

async function getTracks(albumId, token) {
  const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items || [];
}

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Read (or initialize) how far we've gotten so far
  const { data: progressRow } = await supabase
    .from('import_progress')
    .select('*')
    .eq('key', 'spotify_songs')
    .maybeSingle();

  const startIndex = progressRow?.last_index ?? 0;

  if (startIndex >= ARTIST_DIRECTORY.length) {
    return NextResponse.json({ allDone: true, message: 'Every artist has already been processed!' });
  }

  const token = await getSpotifyToken();
  const batch = ARTIST_DIRECTORY.slice(startIndex, startIndex + BATCH_SIZE);
  const results = [];

  for (const entry of batch) {
    const artistName = entry.name;
    try {
      const artist = await searchArtist(artistName, token);
      if (!artist) {
        results.push({ artist: artistName, status: 'no match found' });
        continue;
      }

      const albums = await getAlbums(artist.id, token);
      const rows = [];

      for (const album of albums) {
        const tracks = await getTracks(album.id, token);
        for (const track of tracks) {
          rows.push({
            artist: artistName,
            title: track.name,
            album: album.name,
            spotify_track_id: track.id,
            album_art_url: album.images?.[0]?.url || null,
            release_date: album.release_date?.length === 4 ? `${album.release_date}-01-01` : album.release_date,
          });
        }
      }

      if (rows.length > 0) {
        const { error } = await supabase.from('songs').upsert(rows, { onConflict: 'spotify_track_id' });
        results.push({ artist: artistName, status: error ? `error: ${error.message}` : `imported ${rows.length} tracks` });
      } else {
        results.push({ artist: artistName, status: 'no tracks found' });
      }
    } catch (e) {
      results.push({ artist: artistName, status: `error: ${e.message}` });
    }
  }

  const newIndex = startIndex + batch.length;
  await supabase.from('import_progress').upsert({ key: 'spotify_songs', last_index: newIndex });

  return NextResponse.json({
    allDone: newIndex >= ARTIST_DIRECTORY.length,
    progress: `${newIndex} / ${ARTIST_DIRECTORY.length}`,
    thisBatch: results,
  });
}
