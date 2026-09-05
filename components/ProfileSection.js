'use client';

import { useState } from 'react';
import ProfileTab from './ProfileTab';
import MatchesTab from './MatchesTab';

export default function ProfileSection({ user, onMessage, onViewProfile }) {
  const [subTab, setSubTab] = useState('profile');

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { id: 'profile', label: 'My Profile' },
          { id: 'matches', label: 'Matches' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
              background: subTab === tab.id ? '#2D6A4F' : '#f3f4f6',
              color: subTab === tab.id ? 'white' : '#6b7280',
              WebkitAppearance: 'none',
              appearance: 'none',
              fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'profile' && <ProfileTab user={user} />}
      {subTab === 'matches' && (
        <MatchesTab user={user} onMessage={onMessage} onViewProfile={onViewProfile} />
      )}
    </div>
  );
}
