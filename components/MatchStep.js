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

const FIELD_LABELS = {
  korean: 'Hangul',
  romanization: 'Romanization',
  english: 'English',
};

// pairType is [leftField, rightField], e.g. ['romanization', 'english']
export default function MatchStep({ vocabulary, pairType, onComplete }) {
  const [leftField, rightField] = pairType;
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selected, setSelected] = useState(null); // { side, key }
  const [matched, setMatched] = useState(new Set());
  const [wrongFlash, setWrongFlash] = useState(null);

  useEffect(() => {
    setLeftItems(shuffle(vocabulary.map((w) => ({ key: w.korean, label: w[leftField] }))));
    setRightItems(shuffle(vocabulary.map((w) => ({ key: w.korean, label: w[rightField] }))));
    setSelected(null);
    setMatched(new Set());
  }, [vocabulary, leftField, rightField]);

  const handleTap = (side, key) => {
    if (matched.has(key)) return;

    if (!selected) {
      setSelected({ side, key });
      return;
    }
    if (selected.side === side) {
      setSelected({ side, key });
      return;
    }
    // opposite side tapped
    if (selected.key === key) {
      const next = new Set(matched);
      next.add(key);
      setMatched(next);
      setSelected(null);
      if (next.size === vocabulary.length) {
        setTimeout(onComplete, 700);
      }
    } else {
      setWrongFlash(key);
      setTimeout(() => setWrongFlash(null), 500);
      setSelected(null);
    }
  };

  if (vocabulary.length === 0) return null;

  const btnStyle = (side, key) => ({
    display: 'block', width: '100%', padding: 12, marginBottom: 8, borderRadius: 10,
    border: '1px solid #e5e7eb', cursor: 'pointer', fontWeight: 600, fontSize: 14,
    WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit', textAlign: 'left',
    background: matched.has(key)
      ? '#2D6A4F1A'
      : selected && selected.side === side && selected.key === key
      ? '#2D6A4F'
      : wrongFlash === key
      ? '#FEE2E2'
      : 'white',
    color: matched.has(key)
      ? '#2D6A4F'
      : selected && selected.side === side && selected.key === key
      ? 'white'
      : '#1B4332',
    opacity: matched.has(key) ? 0.6 : 1,
  });

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textAlign: 'center', marginBottom: 4 }}>
        Match
      </p>
      <p style={{ fontSize: 11, color: '#84A98C', textAlign: 'center', marginBottom: 16 }}>
        {FIELD_LABELS[leftField]} ↔ {FIELD_LABELS[rightField]}
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          {leftItems.map((item) => (
            <button key={item.key} onClick={() => handleTap('left', item.key)} disabled={matched.has(item.key)} style={btnStyle('left', item.key)}>
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {rightItems.map((item) => (
            <button key={item.key} onClick={() => handleTap('right', item.key)} disabled={matched.has(item.key)} style={btnStyle('right', item.key)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
