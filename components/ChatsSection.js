'use client';

import { useState } from 'react';
import ChatsTab from './ChatsTab';
import FandomChatsList from './FandomChatsList';

export default function ChatsSection({ user, onOpenChat, onOpenFandomRoom }) {
  const [subTab, setSubTab] = useState('personal');

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
        Chats
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
        {[
          { id: 'personal', label: 'Personal' },
          { id: 'fandom', label: 'Fandom' },
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

      {subTab === 'personal' && <ChatsTab user={user} onOpenChat={onOpenChat} />}
      {subTab === 'fandom' && <FandomChatsList user={user} onOpenRoom={onOpenFandomRoom} />}
    </div>
  );
}
