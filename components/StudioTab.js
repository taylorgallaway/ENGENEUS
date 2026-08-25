'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function LessonGenerator({ user, onLessonReady }) {
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!lyrics.trim()) return;
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, lyrics, songName, artist }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong generating the lesson.');
      } else {
        onLessonReady(data.lesson);
      }
    } catch (e) {
      setError('Network error — try again.');
    }
    setGenerating(false);
  };

  const inputStyle = { display: 'block', width: '100%', padding: 10, marginTop: 5, marginBottom: 15, boxSizing: 'border-box' };

  return (
    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #eee' }}>
      <p style={{ fontSize: 20, fontWeight: 900, color: '#1B4332', marginBottom: 16 }}>Generate a lesson</p>

      <label style={{ fontSize: 14 }}>Song Name (optional)</label>
      <input value={songName} onChange={(e) => setSongName(e.target.value)} style={inputStyle} />

      <label style={{ fontSize: 14 }}>Artist (optional)</label>
      <input value={artist} onChange={(e) => setArtist(e.target.value)} style={inputStyle} />

      <label style={{ fontSize: 14 }}>Paste Lyrics</label>
      <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} rows={6} style={inputStyle} />

      <button
        onClick={handleGenerate}
        disabled={generating || !lyrics.trim()}
        style={{
          padding: '10px 20px',
          background: '#2D6A4F',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          opacity: generating || !lyrics.trim() ? 0.5 : 1,
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      >
        {generating ? 'Generating...' : 'Generate Lesson'}
      </button>

      {error && <p style={{ marginTop: 15, fontSize: 13, color: '#dc2626' }}>{error}</p>}
    </div>
  );
}

export default function StudioTab({ user, onLessonReady }) {
  const [loading, setLoading] = useState(true);
  const [hasKey, setHasKey] = useState(false);
  const [showKeySetup, setShowKeySetup] = useState(false);
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
      setShowKeySetup(false);
      setApiKeyInput('');
      setMessage('Connected!');
    } else {
      const data = await res.json();
      setMessage(`Error: ${data.error || 'something went wrong'}${data.code ? ` (code: ${data.code})` : ''}${data.hint ? ` — hint: ${data.hint}` : ''}`);
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
            width: '100%',
            margin: 0,
            boxSizing: 'border-box',
            background: '#2D6A4F1A',
            color: '#1B4332',
            padding: '14px 16px',
            borderRadius: 12,
            marginBottom: hasKey && !showKeySetup ? 8 : 24,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ✓ AI Connected
        </div>
      )}

      {hasKey && !showKeySetup && (
        <button
          onClick={() => setShowKeySetup(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#84A98C',
            fontSize: 12,
            fontWeight: 700,
            padding: 0,
            marginBottom: 24,
            WebkitAppearance: 'none',
            appearance: 'none',
            fontFamily: 'inherit',
          }}
        >
          Update API key
        </button>
      )}

      {(!hasKey || showKeySetup) && (
        <>
          <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, marginBottom: 16 }}>
            Turning lyrics into lessons uses AI. Connect your own free Google account — Google's AI (Gemini) gives you a completely free daily allowance that resets automatically every day. Follow the directions below to enable your free API key.
          </p>

          <a
            href="https://aistudio.google.com/apikey"
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
              marginBottom: 10,
            }}
          >
            Get a free API key →
          </a>

          <ol style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.8, paddingLeft: 20, marginBottom: 24 }}>
            <li>Sign in with any Google account at the link above</li>
            <li>Click "Create API key"</li>
            <li>Copy the key it gives you</li>
            <li>Paste it below</li>
          </ol>

          <label style={{ fontSize: 14 }}>{hasKey ? 'Update your API key' : 'Paste your API key'}</label>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIza..."
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
        </>
      )}

      {hasKey && <LessonGenerator user={user} onLessonReady={onLessonReady} />}
    </div>
  );
}
