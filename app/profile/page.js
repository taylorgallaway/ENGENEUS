'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [favSong, setFavSong] = useState('');
  const [favArtist, setFavArtist] = useState('');
  const [followedArtists, setFollowedArtists] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage('You need to log in first.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        setMessage(`Error loading profile: ${error.message}`);
      } else {
        setProfile(data);
        setUsername(data.username || '');
        setBio(data.bio || '');
        setFavSong(data.fav_song || '');
        setFavArtist(data.fav_artist || '');
        setFollowedArtists((data.followed_artists || []).join(', '));
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setMessage('Saving...');

    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        bio,
        fav_song: favSong,
        fav_artist: favArtist,
        followed_artists: followedArtists.split(',').map(a => a.trim()).filter(Boolean),
      })
      .eq('id', user.id);

    if (error) {
      setMessage(`Error saving: ${error.message}`);
    } else {
      setMessage('Saved!');
    }
  };

  if (loading) return <p style={{ fontFamily: 'sans-serif', margin: 40 }}>Loading...</p>;

  if (!profile) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
        <p>{message}</p>
        <a href="/login" style={{ color: '#2D6A4F' }}>Go to login</a>
      </main>
    );
  }

  const inputStyle = { display: 'block', width: '100%', padding: 10, marginTop: 5, marginBottom: 15 };

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ color: '#1B4332' }}>{profile.bias_sticker} Edit Profile</h1>

      <label>Username</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

      <label>Bio</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={inputStyle} />

      <label>Favorite Song</label>
      <input value={favSong} onChange={(e) => setFavSong(e.target.value)} style={inputStyle} />

      <label>Favorite Artist</label>
      <input value={favArtist} onChange={(e) => setFavArtist(e.target.value)} style={inputStyle} />

      <label>Following (comma-separated for now)</label>
      <input value={followedArtists} onChange={(e) => setFollowedArtists(e.target.value)} style={inputStyle} placeholder="Stray Kids, CORTIS, Big Ocean" />

      <button
        onClick={handleSave}
        style={{ padding: '10px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 8 }}
      >
        Save
      </button>
      <p style={{ marginTop: 15 }}>{message}</p>
    </main>
  );
}
