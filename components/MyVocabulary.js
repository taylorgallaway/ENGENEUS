'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MyVocabulary({ user }) {
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('saved_vocabulary')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setWords(data || []);
      setLoading(false);
    }
    load();
  }, [user.id]);

  const handleRemove = async (korean) => {
    await supabase.from('saved_vocabulary').delete().eq('user_id', user.id).eq('korean', korean);
    setWords((prev) => prev.filter((w) => w.korean !== korean));
  };

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;

  if (words.length === 0) {
    return (
      <p style={{ fontSize: 13, color: '#9ca3af' }}>
        No saved words yet — save any word while going through a lesson to build your personal vocabulary list here.
      </p>
    );
  }

  return (
    <div>
      {words.map((w) => (
        <div
          key={w.korean}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #f3f4f6',
            borderRadius: 10,
            padding: 12,
            marginBottom: 8,
          }}
        >
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: 0, color: '#1B4332' }}>{w.korean}</p>
            <p style={{ fontSize: 13, color: '#84A98C', fontWeight: 600, margin: '6px 0 0' }}>{w.romanization}</p>
            <p style={{ fontSize: 13, color: '#666', margin: '6px 0 0' }}>{w.english}</p>
            {w.song_name && (
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '6px 0 0' }}>
                from {w.song_name}{w.artist ? ` — ${w.artist}` : ''}
              </p>
            )}
          </div>
          <button
            onClick={() => handleRemove(w.korean)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#dc2626',
              fontSize: 12,
              WebkitAppearance: 'none',
              appearance: 'none',
              fontFamily: 'inherit',
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
