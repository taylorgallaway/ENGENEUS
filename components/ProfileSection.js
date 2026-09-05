'use client';

import { useState } from 'react';
import ProfileTab from './ProfileTab';
import MatchesTab from './MatchesTab';

export default function ProfileSection({ user, onMessage, onViewProfile }) {
  const [subTab, setSubTab] = useState('profile');

  const subTabBar = (
    <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
      {[
        { id: 'profile', label: 'Profile' },
        { id: 'matches', label: 'Matches' },
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
  );

  return (
    <div>
      {subTab === 'profile' && <ProfileTab user={user} subTabBar={subTabBar} />}
      {subTab === 'matches' && (
        <MatchesTab user={user} onMessage={onMessage} onViewProfile={onViewProfile} subTabBar={subTabBar} />
      )}
    </div>
  );
}
