'use client';

import { useState, useRef, useEffect } from 'react';

// Loose character-overlap check — Korean speech recognition varies enough that
// requiring an exact match would unfairly reject correct pronunciation.
function looseMatch(target, heard) {
  const t = (target || '').replace(/\s/g, '');
  const h = (heard || '').replace(/\s/g, '');
  if (!h || !t) return false;
  const pool = h.split('');
  let common = 0;
  for (const c of t.split('')) {
    const idx = pool.indexOf(c);
    if (idx !== -1) {
      common++;
      pool.splice(idx, 1);
    }
  }
  return common / t.length >= 0.4;
}

export default function SayItStep({ word, onComplete }) {
  const [attempts, setAttempts] = useState(0);
  const [heard, setHeard] = useState('');
  const [success, setSuccess] = useState(false);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const speakWord = () => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(word.korean);
    utter.lang = 'ko-KR';
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setHeard(transcript);
      setSuccess(looseMatch(word.korean, transcript));
      setAttempts((prev) => prev + 1);
      setListening(false);
      setErrorMsg('');
    };
    recognition.onerror = (event) => {
      setListening(false);
      setErrorMsg(`Recognition error: ${event.error}`);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    setHeard('');
    setErrorMsg('');
    try {
      recognition.start();
    } catch (e) {
      setErrorMsg(`Could not start: ${e.message}`);
      setListening(false);
    }
  };

  const readyForNext = success || attempts >= 5 || !supported;

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
        Say It {supported ? `· attempt ${Math.min(attempts + 1, 5)}` : ''}
      </p>

      <div style={{ border: '1px solid #f3f4f6', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 32, fontWeight: 900, color: '#1B4332', margin: 0 }}>{word.korean}</p>
        <p style={{ fontSize: 14, color: '#84A98C', margin: '8px 0 0' }}>{word.romanization}</p>
        <p style={{ fontSize: 16, color: '#374151', margin: '12px 0 0' }}>{word.english}</p>
      </div>

      <button
        onClick={speakWord}
        style={{
          display: 'block', width: '100%', padding: 12, marginBottom: 12,
          background: 'white', color: '#2D6A4F', border: '1px solid #2D6A4F',
          borderRadius: 10, cursor: 'pointer', fontWeight: 700,
          WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit',
        }}
      >
        🔊 Hear it
      </button>

      {supported ? (
        <button
          onClick={startListening}
          disabled={listening}
          style={{
            display: 'block', width: '100%', padding: 12, marginBottom: 12,
            background: listening ? '#9ca3af' : '#2D6A4F', color: 'white', border: 'none',
            borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit',
          }}
        >
          {listening ? '🎤 Listening...' : '🎤 Tap to say it'}
        </button>
      ) : (
        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginBottom: 12 }}>
          Speech recognition isn't available on this device — practice saying it out loud on your own!
        </p>
      )}

      {errorMsg && (
        <p style={{ fontSize: 12, color: '#dc2626', textAlign: 'center', marginBottom: 12 }}>{errorMsg}</p>
      )}

      {heard && (
        <p style={{ fontSize: 13, textAlign: 'center', color: success ? '#2D6A4F' : '#374151', marginBottom: 12 }}>
          You said: "{heard}" {success ? '✓' : ''}
        </p>
      )}

      <button
        onClick={onComplete}
        disabled={!readyForNext}
        style={{
          display: 'block', width: '100%', padding: 12,
          background: '#2D6A4F', color: 'white', border: 'none',
          borderRadius: 10, cursor: 'pointer', fontWeight: 700,
          opacity: readyForNext ? 1 : 0.5,
          WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit',
        }}
      >
        Next →
      </button>
    </div>
  );
}
