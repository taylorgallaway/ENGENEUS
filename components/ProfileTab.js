'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const STICKER_OPTIONS = [
  { emoji: '🐥', label: 'Chick' }, { emoji: '🐔', label: 'Chicken' }, { emoji: '🐺', label: 'Wolf' },
  { emoji: '🦊', label: 'Fox' }, { emoji: '🐰', label: 'Bunny' }, { emoji: '🐱', label: 'Cat' },
  { emoji: '🐻', label: 'Bear' }, { emoji: '🐶', label: 'Dog' }, { emoji: '🐼', label: 'Panda' },
  { emoji: '🦁', label: 'Lion' }, { emoji: '🐯', label: 'Tiger' }, { emoji: '🐨', label: 'Koala' },
  { emoji: '🐹', label: 'Hamster' }, { emoji: '🐭', label: 'Mouse' }, { emoji: '🐀', label: 'Rat' },
  { emoji: '🐷', label: 'Pig' }, { emoji: '🐮', label: 'Cow' }, { emoji: '🐸', label: 'Frog' },
  { emoji: '🐵', label: 'Monkey' }, { emoji: '🦄', label: 'Unicorn' }, { emoji: '🐉', label: 'Dragon' },
  { emoji: '🦖', label: 'T-Rex' }, { emoji: '🦕', label: 'Sauropod' }, { emoji: '🦉', label: 'Owl' },
  { emoji: '🕊️', label: 'Dove' }, { emoji: '🦤', label: 'Dodo' }, { emoji: '🦚', label: 'Peacock' },
  { emoji: '🦩', label: 'Flamingo' }, { emoji: '🦃', label: 'Turkey' }, { emoji: '🐓', label: 'Rooster' },
  { emoji: '🦜', label: 'Parrot' }, { emoji: '🐦', label: 'Bird' }, { emoji: '🦅', label: 'Eagle' },
  { emoji: '🐧', label: 'Penguin' }, { emoji: '🦆', label: 'Duck' }, { emoji: '🦢', label: 'Swan' },
  { emoji: '🦋', label: 'Butterfly' }, { emoji: '🐢', label: 'Turtle' }, { emoji: '🐬', label: 'Dolphin' },
  { emoji: '🐳', label: 'Whale' }, { emoji: '🦈', label: 'Shark' }, { emoji: '🦭', label: 'Seal' },
  { emoji: '🐡', label: 'Pufferfish' }, { emoji: '🐠', label: 'Tropical Fish' }, { emoji: '🐟', label: 'Fish' },
  { emoji: '🐙', label: 'Octopus' }, { emoji: '🦑', label: 'Squid' }, { emoji: '🦀', label: 'Crab' },
  { emoji: '🦐', label: 'Shrimp' }, { emoji: '🦞', label: 'Lobster' }, { emoji: '🐝', label: 'Bee' },
  { emoji: '🐞', label: 'Ladybug' }, { emoji: '🐛', label: 'Caterpillar' }, { emoji: '🦟', label: 'Mosquito' },
  { emoji: '🪱', label: 'Worm' }, { emoji: '🦗', label: 'Cricket' }, { emoji: '🕷️', label: 'Spider' },
  { emoji: '🦂', label: 'Scorpion' }, { emoji: '🐜', label: 'Ant' }, { emoji: '🦫', label: 'Quokka' },
  { emoji: '🦔', label: 'Hedgehog' }, { emoji: '🦦', label: 'Otter' }, { emoji: '🦥', label: 'Sloth' },
  { emoji: '🦨', label: 'Skunk' }, { emoji: '🦡', label: 'Badger' }, { emoji: '🦒', label: 'Giraffe' },
  { emoji: '🦓', label: 'Zebra' }, { emoji: '🐘', label: 'Elephant' }, { emoji: '🦛', label: 'Hippo' },
  { emoji: '🦏', label: 'Rhino' }, { emoji: '🐴', label: 'Horse' }, { emoji: '🐎', label: 'Racehorse' },
  { emoji: '🦌', label: 'Deer' }, { emoji: '🐐', label: 'Goat' }, { emoji: '🐑', label: 'Sheep' },
  { emoji: '🦙', label: 'Llama' }, { emoji: '🐫', label: 'Camel' }, { emoji: '🐊', label: 'Alligator' },
  { emoji: '🐍', label: 'Snake' }, { emoji: '🦎', label: 'Lizard' }, { emoji: '🐌', label: 'Snail' },
  { emoji: '🐿️', label: 'Squirrel' }, { emoji: '🦇', label: 'Bat' }, { emoji: '🐗', label: 'Boar' },
  { emoji: '🦘', label: 'Kangaroo' }, { emoji: '🐆', label: 'Leopard' },
];

function toCodePoint(emoji) {
  return [...emoji]
    .map((c) => c.codePointAt(0).toString(16))
    .filter((cp) => cp !== 'fe0f')
    .join('-');
}

function StickerImg({ emoji, size = 22 }) {
  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/twemoji@14.0.2/2/72x72/${toCodePoint(emoji)}.png`}
      alt={emoji}
      width={size}
      height={size}
      style={{ display: 'inline-block' }}
    />
  );
}

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
  const [biasSticker, setBiasSticker] = useState('🐥');
  const [stickerSearch, setStickerSearch] = useState('');

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
        setBiasSticker(data.bias_sticker || '🐥');
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
        bias_sticker: biasSticker,
      })
      .eq('id', user.id);

    if (error) {
      setMessage(`Error saving: ${error.message}`);
    } else {
      setMessage('Saved!');
      setProfile((prev) => ({ ...prev, username, bio, fav_song: favSong, fav_artist: favArtist, bias_sticker: biasSticker }));
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
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

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

  const filteredStickers = stickerSearch.trim()
    ? STICKER_OPTIONS.filter((s) => s.label.toLowerCase().includes(stickerSearch.toLowerCase()))
    : STICKER_OPTIONS;

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
          <h1
            style={{
              color: '#1B4332',
              margin: 0,
              fontSize: 36,
              fontWeight: 900,
              textTransform: 'uppercase',
              WebkitTextStroke: '1px #1B4332',
            }}
          >
            Edit Profile
          </h1>
          {uploading && <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>Uploading...</p>}
        </div>
      </div>

      <label>Username</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

      <label>Bias Sticker</label>
      <input
        value={stickerSearch}
        onChange={(e) => setStickerSearch(e.target.value)}
        placeholder="Search animals..."
        style={{ ...inputStyle, marginBottom: 8 }}
      />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 15,
          maxHeight: 180,
          overflowY: 'auto',
          padding: 4,
          border: '1px solid #f3f4f6',
          borderRadius: 10,
        }}
      >
        {filteredStickers.map(({ emoji, label }) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setBiasSticker(emoji)}
            title={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: 8,
              borderRadius: 10,
              border: biasSticker === emoji ? '2px solid #2D6A4F' : '2px solid #e5e7eb',
              background: biasSticker === emoji ? '#2D6A4F1A' : 'white',
              cursor: 'pointer',
            }}
          >
            <StickerImg emoji={emoji} />
            <span style={{ fontSize: 9, color: '#6b7280' }}>{label}</span>
          </button>
        ))}
        {filteredStickers.length === 0 && (
          <p style={{ fontSize: 12, color: '#9ca3af', padding: 8 }}>No animals match that search.</p>
        )}
      </div>

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
