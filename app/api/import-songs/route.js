import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ARTIST_DIRECTORY } from '../../../lib/artistDirectory';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Visit this URL repeatedly in your browser to import songs in small
// batches. Unlike the old version, this checks the database directly for
// which artists still have zero songs — so it's safe even if the artist
// list gets edited (artists added, renamed, reordered) between visits.
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

  // Find which artists we've already attempted (successfully or not) by
  // checking a log table, rather than trusting array position at all.
  const { data: attempted } = await supabase.from('import_attempted').select('artist');
  const attemptedSet = new Set((attempted || []).map((a) => a.artist));

  const remaining = ARTIST_DIRECTORY.filter((entry) => !attemptedSet.has(entry.name));

  if (remaining.length === 0) {
    return NextResponse.json({ allDone: true, message: 'Every artist in the current list has been attempted!' });
  }

  const token = await getSpotifyToken();
  const batch = remaining.slice(0, BATCH_SIZE);
  const results = [];

  for (const entry of batch) {
    const artistName = entry.name;
    try {
      const artist = await searchArtist(artistName, token);
      if (!artist) {
        results.push({ artist: artistName, status: 'no match found' });
      } else {
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
      }

      // Mark as attempted regardless of outcome, so we don't retry forever —
      // but this is a separate, cheap table, so re-adding an artist by name
      // (even if the list order changes) just means it's simply not in this
      // table yet, and gets picked up automatically.
      await supabase.from('import_attempted').upsert({ artist: artistName });
    } catch (e) {
      results.push({ artist: artistName, status: `error: ${e.message}` });
    }
  }

  return NextResponse.json({
    allDone: remaining.length <= batch.length,
    remainingCount: remaining.length - batch.length,
    thisBatch: results,
  });
}
