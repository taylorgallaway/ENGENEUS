'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const STICKER_OPTIONS = [
  { emoji: '🐱', label: 'Cat' }, { emoji: '🐯', label: 'Tiger' }, { emoji: '🦁', label: 'Lion' },
  { emoji: '🐆', label: 'Cheetah' }, { emoji: '🐆', label: 'Panther' }, { emoji: '🐆', label: 'Leopard' },
  { emoji: '🐺', label: 'Wolf' }, { emoji: '🦊', label: 'Fox' }, { emoji: '🐶', label: 'Dog' },
  { emoji: '🐶', label: 'Puppy' },
  { emoji: '🐰', label: 'Bunny' }, { emoji: '🐰', label: 'Rabbit' }, { emoji: '🐹', label: 'Hamster' },
  { emoji: '🐿️', label: 'Squirrel' }, { emoji: '🐿️', label: 'Chipmunk' }, { emoji: '🦫', label: 'Quokka' },
  { emoji: '🦡', label: 'Ferret' }, { emoji: '🦦', label: 'Otter' }, { emoji: '🦫', label: 'Beaver' },
  { emoji: '🦫', label: 'Capybara' }, { emoji: '🐭', label: 'Mouse' }, { emoji: '🐀', label: 'Rat' },
  { emoji: '🦙', label: 'Alpaca' }, { emoji: '🦙', label: 'Llama' }, { emoji: '🐑', label: 'Sheep' },
  { emoji: '🐑', label: 'Lamb' }, { emoji: '🐐', label: 'Goat' }, { emoji: '🐮', label: 'Cow' },
  { emoji: '🐮', label: 'Calf' }, { emoji: '🐷', label: 'Pig' }, { emoji: '🐴', label: 'Horse' },
  { emoji: '🐴', label: 'Donkey' },
  { emoji: '🐻', label: 'Bear' }, { emoji: '🐼', label: 'Panda' }, { emoji: '🐵', label: 'Monkey' },
  { emoji: '🦍', label: 'Gorilla' },
  { emoji: '🐘', label: 'Elephant' }, { emoji: '🦌', label: 'Deer' }, { emoji: '🦌', label: 'Fawn' },
  { emoji: '🦌', label: 'Gazelle' }, { emoji: '🐨', label: 'Koala' }, { emoji: '🦥', label: 'Sloth' },
  { emoji: '🦔', label: 'Hedgehog' }, { emoji: '🦝', label: 'Raccoon' }, { emoji: '🦨', label: 'Skunk' },
  { emoji: '🐔', label: 'Chicken' }, { emoji: '🐥', label: 'Chick' }, { emoji: '🐓', label: 'Rooster' },
  { emoji: '🦆', label: 'Duck' }, { emoji: '🦢', label: 'Swan' }, { emoji: '🦃', label: 'Turkey' },
  { emoji: '🦚', label: 'Peacock' },
  { emoji: '🦅', label: 'Eagle' }, { emoji: '🦅', label: 'Falcon' }, { emoji: '🦅', label: 'Hawk' },
  { emoji: '🦉', label: 'Owl' },
  { emoji: '🐧', label: 'Penguin' }, { emoji: '🕊️', label: 'Dove' }, { emoji: '🕊️', label: 'Pigeon' },
  { emoji: '🦜', label: 'Parrot' }, { emoji: '🐦', label: 'Crow' }, { emoji: '🐦', label: 'Raven' },
  { emoji: '🐦', label: 'Sparrow' }, { emoji: '🐦', label: 'Hummingbird' },
  { emoji: '🐢', label: 'Turtle' }, { emoji: '🐢', label: 'Tortoise' }, { emoji: '🐊', label: 'Crocodile' },
  { emoji: '🐊', label: 'Alligator' }, { emoji: '🐍', label: 'Snake' }, { emoji: '🦎', label: 'Lizard' },
  { emoji: '🦎', label: 'Chameleon' }, { emoji: '🐸', label: 'Frog' }, { emoji: '🐸', label: 'Toad' },
  { emoji: '🦈', label: 'Shark' }, { emoji: '🐬', label: 'Dolphin' }, { emoji: '🐳', label: 'Whale' },
  { emoji: '🦭', label: 'Seal' }, { emoji: '🦭', label: 'Sea Lion' }, { emoji: '🦭', label: 'Walrus' },
  { emoji: '🐙', label: 'Octopus' }, { emoji: '🦑', label: 'Squid' }, { emoji: '🪼', label: 'Jellyfish' },
  { emoji: '🦀', label: 'Crab' }, { emoji: '🦞', label: 'Lobster' }, { emoji: '🐠', label: 'Seahorse' },
  { emoji: '🐙', label: 'Axolotl' },
  { emoji: '🐉', label: 'Dragon' }, { emoji: '🦅', label: 'Phoenix' }, { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🧜', label: 'Mermaid' }, { emoji: '🦁', label: 'Griffin' }, { emoji: '🦄', label: 'Pegasus' },
  { emoji: '🦖', label: 'T-Rex' }, { emoji: '🦕', label: 'Brachiosaurus' },
  { emoji: '🦋', label: 'Butterfly' }, { emoji: '🐝', label: 'Bee' }, { emoji: '🐝', label: 'Bumblebee' },
  { emoji: '🐞', label: 'Ladybug' }, { emoji: '🐜', label: 'Ant' }, { emoji: '🐛', label: 'Dragonfly' },
  { emoji: '🕷️', label: 'Spider' },
];

function toCodePoint(emoji) {
  return [...emoji]
    .map((c) => c.codePointAt(0).toString(16))
    .filter((cp) => cp !== 'fe0f')
    .join('-');
}

function StickerImg({ emoji, size = 20 }) {
  const cp = toCodePoint(emoji);
  const base = cp === '1fabc'
    ? 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72'
    : 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72';
  return (
    <img
      src={`${base}/${cp}.png`}
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
    : [];

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, marginBottom: 8 }}>
        <StickerImg emoji={biasSticker} size={24} />
        <span style={{ fontSize: 12, color: '#6b7280' }}>Current pick — search below to change</span>
      </div>
      <input
        value={stickerSearch}
        onChange={(e) => setStickerSearch(e.target.value)}
        placeholder="Search animals..."
        style={{ ...inputStyle, marginTop: 0, marginBottom: stickerSearch.trim() ? 0 : 15 }}
      />
      {stickerSearch.trim() && (
        <div
          style={{
            border: '1px solid #f3f4f6',
            borderRadius: 10,
            marginBottom: 15,
            maxHeight: 220,
            overflowY: 'auto',
          }}
        >
          {filteredStickers.map(({ emoji, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setBiasSticker(emoji);
                setStickerSearch('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                borderBottom: '1px solid #f9fafb',
                background: biasSticker === emoji ? '#2D6A4F1A' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <StickerImg emoji={emoji} />
              <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
            </button>
          ))}
          {filteredStickers.length === 0 && (
            <p style={{ fontSize: 12, color: '#9ca3af', padding: 8 }}>No animals match that search.</p>
          )}
        </div>
      )}

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
