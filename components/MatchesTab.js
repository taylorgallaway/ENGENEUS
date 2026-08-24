'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function toCodePoint(emoji) {
  return [...emoji]
    .map((c) => c.codePointAt(0).toString(16))
    .filter((cp) => cp !== 'fe0f')
    .join('-');
}

function StickerImg({ emoji, size = 16 }) {
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

export default function MatchesTab({ user }) {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadMatches() {
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('followed_artists')
        .eq('id', user.id)
        .single();

      const myArtists = myProfile?.followed_artists || [];

      if (myArtists.length === 0) {
        setMessage('Add some followed artists on your profile first, then come back here.');
        setLoading(false);
        return;
      }

      const { data: everyone, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      if (error) {
        setMessage(`Error: ${error.message}`);
        setLoading(false);
        return;
      }

      const withOverlap = (everyone || [])
        .map((person) => {
          const theirArtists = person.followed_artists || [];
          const shared = theirArtists.filter((a) => myArtists.includes(a));
          return { ...person, shared };
        })
        .filter((person) => person.shared.length > 0)
        .sort((a, b) => b.shared.length - a.shared.length);

      setMatches(withOverlap);
      setLoading(false);
    }
    loadMatches();
  }, [user.id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1
        style={{
          color: '#1B4332',
          margin: 16,
          fontSize: 36,
          fontWeight: 900,
          textTransform: 'uppercase',
          WebkitTextStroke: '1px #1B4332',
          marginBottom: 28,
        }}
      >
        Fandom Matches
      </h1>
      {message && <p>{message}</p>}
      {matches.map((person) => (
        <div key={person.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 15, marginTop: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {person.avatar_url && (
                <img src={person.avatar_url} alt={person.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
<p style={{ fontWeight: 'bold', fontSize: 20, letterSpacing: '0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
              {person.bias_sticker && <StickerImg emoji={person.bias_sticker} size={14} />}
              {person.username}
            </p>
          </div>
          <p style={{ fontSize: 13, color: '#666', margin: '8px 0 0' }}>{person.bio}</p>
          <p style={{ fontSize: 13, color: '#2D6A4F', margin: '4px 0 0' }}>Shared: {person.shared.join(', ')}</p>
        </div>
      ))}
      {!loading && matches.length === 0 && !message && <p>No matches yet — no one else shares your followed artists.</p>}
    </div>
  );
}
