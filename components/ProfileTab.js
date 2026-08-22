'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProfileTab({ user }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [favSong, setFavSong] = useState('');
  const [favArtist, setFavArtist] = useState('');
  const [followedArtists, setFollowedArtists] = useState('');

  useEffect(() => {
    async function loadProfile() {
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
  }, [user.id]);

  const handleSave = async () => {
    setMessage('Saving...');
    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        bio,
        fav_song: favSong,
        fav_artist: favArtist,
        followed_artists: followedArtists.split(',').map((a) => a.trim()).filter(Boolean),
      })
      .eq('id', user.id);

    if (error) {
      setMessage(`Error saving: ${error.message}`);
    } else {
      setMessage('Saved!');
      setProfile((prev) => ({ ...prev, username, bio, fav_song: favSong, fav_artist: favArtist }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Uploading photo...');

    const filePath = `${user.id}/avatar.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage(`Error uploading: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`; // cache-bust so the new photo shows immediately

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      setMessage(`Error saving photo: ${updateError.message}`);
    } else {
      setProfile((prev) => ({ ...prev, avatar_url: avatarUrl }));
      setMessage('Photo updated!');
    }
    setUploading(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>{message}</p>;

  const inputStyle = { display: 'block', width: '100%', padding: 10, marginTop: 5, marginBottom: 15, boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
        <div
          onClick={handleAvatarClick}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#f3f4f6',
            border: '2px solid #e5e7eb',
            cursor: 'pointer',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>Add photo</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
        <div>
          <h1 style={{ color: '#1B4332', margin: 0 }}>Edit Profile</h1>
          {uploading && <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>Uploading...</p>}
        </div>
      </div>

      <label>Username</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

      <label>Bio</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={inputStyle} />

      <label>Favorite Song</label>
      <input value={favSong} onChange={(e) => setFavSong(e.target.value)} style={inputStyle} />

      <label>Favorite Artist</label>
      <input value={favArtist} onChange={(e) => setFavArtist(e.target.value)} style={inputStyle} />

      <label>Following (comma-separated for now)</label>
      <input
        value={followedArtists}
        onChange={(e) => setFollowedArtists(e.target.value)}
        style={inputStyle}
        placeholder="Stray Kids, CORTIS, Big Ocean"
      />

      <button
        onClick={handleSave}
        style={{ padding: '10px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 8 }}
      >
        Save
      </button>
      <p style={{ marginTop: 15 }}>{message}</p>
    </div>
  );
}
