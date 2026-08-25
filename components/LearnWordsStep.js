'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LearnWordsStep({ vocabulary, user, songName, artist, onComplete }) {
  const [index, setIndex] = useState(0);
  const [savedWords, setSavedWords] = useState(new Set());
  const [saving, setSaving] = useState(false);

  if (!vocabulary || vocabulary.length === 0) {
    onComplete();
    return null;
  }

  const word = vocabulary[index];
  const isSaved = savedWords.has(word.korean);

  const handleSaveToggle = async () => {
    setSaving(true);
    if (isSaved) {
      await supabase.from('saved_vocabulary').delete().eq('user_id', user.id).eq('korean', word.korean);
      setSavedWords((prev) => {
        const next = new Set(prev);
        next.delete(word.korean);
        return next;
      });
    } else {
      await supabase.from('saved_vocabulary').insert({
        user_id: user.id,
        korean: word.korean,
        romanization: word.romanization,
        english: word.english,
        song_name: songName,
        artist: artist,
      });
      setSavedWords((prev) => new Set(prev).add(word.korean));
    }
    setSaving(false);
  };

  const handleNext = () => {
    if (index + 1 >= vocabulary.length) {
      onComplete();
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
        Learn Words · {index + 1} / {vocabulary.length}
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
            flex: 1,
            padding: 12,
            background: isSaved ? '#2D6A4F' : 'white',
            color: isSaved ? 'white' : '#2D6A4F',
            border: '1px solid #2D6A4F',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 700,
            WebkitAppearance: 'none',
            appearance: 'none',
            fontFamily: 'inherit',
          }}
        >
          {isSaved ? '★ Saved' : '☆ Save to remember'}
        </button>
        <button
          onClick={handleNext}
          style={{
            flex: 1,
            padding: 12,
            background: '#2D6A4F',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 700,
            WebkitAppearance: 'none',
            appearance: 'none',
            fontFamily: 'inherit',
          }}
        >
          {index + 1 >= vocabulary.length ? 'Continue to lyrics →' : 'Next word →'}
        </button>
      </div>
    </div>
  );
}
