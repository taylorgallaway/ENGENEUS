import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ARTIST_DIRECTORY } from '../../../lib/artistDirectory';

// Visit this URL in your browser to run the import (once your env vars are set):
//   https://engeneus.vercel.app/api/import-songs
//
// Heads up: this can take a while (1,866 artists, one Spotify lookup each)
// and Vercel has a max function runtime — if it times out partway through,
// just visit the URL again; already-imported songs won't be duplicated.

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

  let token = await getSpotifyToken();
  let tokenTime = Date.now();
  const results = [];

  for (const entry of ARTIST_DIRECTORY) {
    if (Date.now() - tokenTime > 50 * 60 * 1000) {
      token = await getSpotifyToken();
      tokenTime = Date.now();
    }

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

  return NextResponse.json({ done: true, results });
}
