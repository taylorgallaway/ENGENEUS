'use client';

import { useState } from 'react';
import StudioTab from './StudioTab';
import MyVocabulary from './MyVocabulary';
import ArtistDirectoryTab from './ArtistDirectoryTab';

export default function StudioSection({ user, onLessonReady }) {
  const [subTab, setSubTab] = useState('lessons');

  return (
    <div>
      <h1
        style={{
          color: '#1B4332',
          marginTop: 16,
          marginBottom: 20,
          fontSize: 36,
          fontWeight: 900,
          textTransform: 'uppercase',
          WebkitTextStroke: '1px #1B4332',
        }}
      >
        Studio
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
        {[
          { id: 'lessons', label: 'Lessons' },
          { id: 'vocabulary', label: 'My Vocabulary' },
          { id: 'directory', label: 'Directory' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px 4px',
              fontSize: 13,
              fontWeight: 700,
              color: subTab === tab.id ? '#2D6A4F' : '#9ca3af',
              borderBottom: subTab === tab.id ? '2px solid #2D6A4F' : '2px solid transparent',
              marginRight: 20,
              WebkitAppearance: 'none',
              appearance: 'none',
              fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'lessons' && <StudioTab user={user} onLessonReady={onLessonReady} />}
      {subTab === 'vocabulary' && <MyVocabulary user={user} />}
      {subTab === 'directory' && <ArtistDirectoryTab />}
    </div>
  );
}
