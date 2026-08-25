'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function StudioTab({ user }) {
  const [loading, setLoading] = useState(true);
  const [hasKey, setHasKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profiles').select('has_api_key').eq('id', user.id).single();
      setHasKey(data?.has_api_key || false);
      setLoading(false);
    }
    load();
  }, [user.id]);

  const handleSave = async () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/save-api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, apiKey: trimmed }),
    });

    if (res.ok) {
      setHasKey(true);
      setApiKeyInput('');
      setMessage('Connected! You\'re all set for whenever lesson generation goes live.');
    } else {
      const data = await res.json();
      setMessage(`Error: ${data.error || 'something went wrong'}`);
    }
    setSaving(false);
  };

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;

  const inputStyle = { display: 'block', width: '100%', padding: 10, marginTop: 5, marginBottom: 12, boxSizing: 'border-box' };

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

      {hasKey && (
        <div
          style={{
            background: '#2D6A4F1A',
            color: '#1B4332',
            padding: '14px 16px',
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ✓ AI Connected — lesson generation is coming in a future update. This just means your account is ready the moment it's built.
        </div>
      )}

      <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, marginBottom: 16 }}>
        Turning lyrics into lessons uses AI, which costs a small amount to run. Instead of that cost falling on ENGENEUS (or on you through a subscription), you connect your own free Anthropic account — you're only ever billed for what you personally use, and it stays free to keep using ENGENEUS itself.
      </p>

      <a
        href="https://console.anthropic.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: '#2D6A4F',
          color: 'white',
          borderRadius: 8,
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        Get a free API key →
      </a>

      <ol style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.8, paddingLeft: 20, marginBottom: 24 }}>
        <li>Create a free account at the link above</li>
        <li>Find "API Keys" in the account settings</li>
        <li>Click "Create Key," give it any name, and copy it</li>
        <li>Paste it below</li>
      </ol>

      <label style={{ fontSize: 14 }}>{hasKey ? 'Update your API key' : 'Paste your API key'}</label>
      <input
        type="password"
        value={apiKeyInput}
        onChange={(e) => setApiKeyInput(e.target.value)}
        placeholder="sk-ant-..."
        style={inputStyle}
      />
      <button
        onClick={handleSave}
        disabled={saving || !apiKeyInput.trim()}
        style={{
          padding: '10px 20px',
          background: '#2D6A4F',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          opacity: saving || !apiKeyInput.trim() ? 0.5 : 1,
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      {message && <p style={{ marginTop: 15, fontSize: 13, color: '#374151' }}>{message}</p>}
    </div>
  );
}
