'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

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
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) return <p style={{ fontFamily: 'sans-serif', margin: 40 }}>Loading...</p>;

  if (!profile) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
        <p>{message}</p>
        <a href="/login" style={{ color: '#2D6A4F' }}>Go to login</a>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ color: '#1B4332' }}>
        {profile.bias_sticker} {profile.username}
      </h1>
      <p><strong>Bio:</strong> {profile.bio || '(no bio yet)'}</p>
      <p><strong>Active Fav:</strong> {profile.fav_song || 'none'} — {profile.fav_artist || 'none'}</p>
      <p><strong>Following:</strong> {profile.followed_artists?.length ? profile.followed_artists.join(', ') : '(none yet)'}</p>
    </main>
  );
}
