'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LearnWordsStep({ word, user, songName, artist, onComplete }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async () => {
    setSaving(true);
    if (saved) {
      await supabase.from('saved_vocabulary').delete().eq('user_id', user.id).eq('korean', word.korean);
      setSaved(false);
    } else {
      await supabase.from('saved_vocabulary').insert({
        user_id: user.id,
        korean: word.korean,
        romanization: word.romanization,
        english: word.english,
        song_name: songName,
        artist: artist,
      });
      setSaved(true);
    }
    setSaving(false);
  };

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
        Learn It
      </p>
      <div style={{ border: '1px solid #f3f4f6', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 32, fontWeight: 900, color: '#1B4332', margin: 0 }}>{word.korean}</p>
        <p style={{ fontSize: 14, color: '#84A98C', margin: '8px 0 0' }}>{word.romanization}</p>
        <p style={{ fontSize: 16, color: '#374151', margin: '12px 0 0' }}>{word.english}</p>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={handleSaveToggle}
          disabled={saving}
          style={{
            flex: 1, padding: 12, background: saved ? '#2D6A4F' : 'white', color: saved ? 'white' : '#2D6A4F',
            border: '1px solid #2D6A4F', borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit',
          }}
        >
          {saved ? '★ Saved' : '☆ Save to remember'}
        </button>
        <button
          onClick={onComplete}
          style={{
            flex: 1, padding: 12, background: '#2D6A4F', color: 'white', border: 'none',
            borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
