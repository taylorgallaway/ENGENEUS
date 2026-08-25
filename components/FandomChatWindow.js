'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function FandomChatWindow({ currentUser, artist, onBack }) {
  const [messages, setMessages] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    const { data: msgs } = await supabase
      .from('fandom_messages')
      .select('*')
      .eq('artist', artist)
      .order('created_at', { ascending: true });

    const list = msgs || [];
    setMessages(list);

    const senderIds = [...new Set(list.map((m) => m.sender_id))];
    if (senderIds.length > 0) {
      const { data: profs } = await supabase.from('profiles').select('*').in('id', senderIds);
      const map = {};
      (profs || []).forEach((p) => { map[p.id] = p; });
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text) return;
    setSending(true);
    const { error } = await supabase.from('fandom_messages').insert({
      artist,
      sender_id: currentUser.id,
      content: text,
    });
    if (!error) {
      setNewMessage('');
      await loadMessages();
    }
    setSending(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0 14px', borderBottom: '1px solid #f3f4f6' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', WebkitAppearance: 'none', appearance: 'none' }}
        >
          <ArrowLeft size={20} />
        </button>
        <p style={{ fontWeight: 700, margin: 0, color: '#1B4332' }}>{artist} — Fandom Chat</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <p style={{ color: '#9ca3af', fontSize: 13 }}>Loading...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: 13 }}>No messages yet — be the first to say something!</p>
        ) : (
          messages.map((m) => {
            const isMine = m.sender_id === currentUser.id;
            const sender = profiles[m.sender_id];
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                {!isMine && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#84A98C', margin: '0 0 2px 4px' }}>
                    {sender?.username || 'Someone'}
                  </p>
                )}
                <div
                  style={{
                    background: isMine ? '#2D6A4F' : '#f3f4f6',
                    color: isMine ? 'white' : '#374151',
                    padding: '8px 12px',
                    borderRadius: 14,
                    borderBottomRightRadius: isMine ? 4 : 14,
                    borderBottomLeftRadius: isMine ? 14 : 4,
                    fontSize: 13,
                  }}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !sending && handleSend()}
          placeholder={`Message the ${artist} fandom...`}
          style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #e5e7eb', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMessage.trim()}
          style={{
            padding: '0 18px',
            background: '#2D6A4F',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            opacity: sending || !newMessage.trim() ? 0.5 : 1,
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
