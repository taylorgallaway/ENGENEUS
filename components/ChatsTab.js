'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ChatsTab({ user, onOpenChat }) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      const seen = new Map();
      (msgs || []).forEach((m) => {
        const otherId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
        if (!seen.has(otherId)) seen.set(otherId, m);
      });

      const otherIds = [...seen.keys()];
      if (otherIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase.from('profiles').select('*').in('id', otherIds);

      const convos = otherIds
        .map((id) => ({
          profile: (profiles || []).find((p) => p.id === id),
          lastMessage: seen.get(id),
        }))
        .filter((c) => c.profile);

      setConversations(convos);
      setLoading(false);
    }
    load();
  }, [user.id]);

  if (loading) return <p>Loading...</p>;

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

      {conversations.length === 0 && (
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          No conversations yet — send a message from the Matches tab to start one.
        </p>
      )}

      {conversations.map(({ profile, lastMessage }) => (
        <button
          key={profile.id}
          onClick={() => onOpenChat(profile)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            textAlign: 'left',
            background: 'white',
            border: '1px solid #f3f4f6',
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {profile.avatar_url && (
              <img src={profile.avatar_url} alt={profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 700, margin: 0, fontSize: 14 }}>{profile.username}</p>
            <p
              style={{
                fontSize: 12,
                color: '#9ca3af',
                margin: '2px 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {lastMessage.sender_id === user.id ? 'You: ' : ''}
              {lastMessage.content}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
