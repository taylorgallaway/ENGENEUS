'use client';

import { useState, useEffect } from 'react';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchStep({ vocabulary, onComplete }) {
  const [round, setRound] = useState(0);
  const [roundWords, setRoundWords] = useState([]);
  const [englishOrder, setEnglishOrder] = useState([]);
  const [selectedKorean, setSelectedKorean] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrongFlash, setWrongFlash] = useState(null);

  const totalRounds = 3;

  useEffect(() => {
    const pool = vocabulary.length >= 4 ? vocabulary : [...vocabulary, ...vocabulary, ...vocabulary].slice(0, 4);
    const picked = shuffle(pool).slice(0, Math.min(4, pool.length));
    setRoundWords(picked);
    setEnglishOrder(shuffle(picked));
    setSelectedKorean(null);
    setMatched(new Set());
  }, [round, vocabulary]);

  const handleKoreanTap = (korean) => {
    if (matched.has(korean)) return;
    setSelectedKorean(korean);
  };

  const handleEnglishTap = (word) => {
    if (matched.has(word.korean) || !selectedKorean) return;
    if (word.korean === selectedKorean) {
      const next = new Set(matched);
      next.add(word.korean);
      setMatched(next);
      setSelectedKorean(null);
      if (next.size === roundWords.length) {
        setTimeout(() => {
          if (round + 1 >= totalRounds) {
            onComplete();
          } else {
            setRound(round + 1);
          }
        }, 700);
      }
    } else {
      setWrongFlash(word.korean);
      setTimeout(() => setWrongFlash(null), 500);
      setSelectedKorean(null);
    }
  };

  if (roundWords.length === 0) return null;

  const btnBase = {
    display: 'block', width: '100%', padding: 12, marginBottom: 8, borderRadius: 10,
    border: '1px solid #e5e7eb', cursor: 'pointer', fontWeight: 600, fontSize: 14,
    WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit', textAlign: 'left',
  };

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
        Match · Round {round + 1} / {totalRounds}
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          {roundWords.map((w) => (
            <button
              key={w.korean}
              onClick={() => handleKoreanTap(w.korean)}
              disabled={matched.has(w.korean)}
              style={{
                ...btnBase,
                background: matched.has(w.korean) ? '#2D6A4F1A' : selectedKorean === w.korean ? '#2D6A4F' : 'white',
                color: matched.has(w.korean) ? '#2D6A4F' : selectedKorean === w.korean ? 'white' : '#1B4332',
                opacity: matched.has(w.korean) ? 0.6 : 1,
              }}
            >
              {w.korean}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {englishOrder.map((w) => (
            <button
              key={w.korean}
              onClick={() => handleEnglishTap(w)}
              disabled={matched.has(w.korean)}
              style={{
                ...btnBase,
                background: matched.has(w.korean) ? '#2D6A4F1A' : wrongFlash === w.korean ? '#FEE2E2' : 'white',
                color: matched.has(w.korean) ? '#2D6A4F' : '#374151',
                opacity: matched.has(w.korean) ? 0.6 : 1,
              }}
            >
              {w.english}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
