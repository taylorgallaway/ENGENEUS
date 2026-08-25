'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FandomChatsList({ user, onOpenRoom }) {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('followed_artists')
        .eq('id', user.id)
        .single();
      setArtists(data?.followed_artists || []);
      setLoading(false);
    }
    load();
  }, [user.id]);

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;

  if (artists.length === 0) {
    return <p style={{ fontSize: 13, color: '#9ca3af' }}>Follow some artists on your profile to join their fandom chats.</p>;
  }

  return (
    <div>
      {artists.map((artist) => (
        <button
          key={artist}
          onClick={() => onOpenRoom(artist)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            textAlign: 'left',
            background: 'white',
            border: '1px solid #f3f4f6',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 10,
            cursor: 'pointer',
            WebkitAppearance: 'none',
            appearance: 'none',
            fontFamily: 'inherit',
            color: '#1B4332',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700 }}>{artist}</span>
          <span style={{ fontSize: 12, color: '#84A98C' }}>Join chat →</span>
        </button>
      ))}
    </div>
  );
}
