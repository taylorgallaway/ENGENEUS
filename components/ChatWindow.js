'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ChatWindow({ currentUser, otherUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${currentUser.id},recipient_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},recipient_id.eq.${currentUser.id})`
      )
      .order('created_at', { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUser.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text) return;
    setSending(true);
    const { error } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      recipient_id: otherUser.id,
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
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {otherUser.avatar_url && (
            <img src={otherUser.avatar_url} alt={otherUser.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        <p style={{ fontWeight: 700, margin: 0 }}>{otherUser.username}</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 24, paddingBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <p style={{ color: '#9ca3af', fontSize: 13 }}>Loading...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: 13 }}>No messages yet — say hi!</p>
        ) : (
          messages.map((m) => {
            const isMine = m.sender_id === currentUser.id;
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isMine ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  background: isMine ? '#2D6A4F' : '#f3f4f6',
                  color: isMine ? 'white' : '#374151',
                  padding: '10px 14px',
                  borderRadius: 14,
                  borderBottomRightRadius: isMine ? 4 : 14,
                  borderBottomLeftRadius: isMine ? 14 : 4,
                  fontSize: 13,
                }}
              >
                {m.content}
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
          placeholder="Type a message..."
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
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
