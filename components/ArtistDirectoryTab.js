'use client';

import { useState, useMemo } from 'react';
import { ARTIST_DIRECTORY } from '../lib/artistDirectory';
import { openArtistPage } from './UserProfileView';

const TYPE_OPTIONS = [
  { id: 'all', label: 'All Types' },
  { id: 'girl group', label: 'Girl Group' },
  { id: 'boy group', label: 'Boy Group' },
  { id: 'coed group', label: 'Coed Group' },
  { id: 'solo', label: 'Solo' },
];

const GEN_OPTIONS = [
  { id: 'all', label: 'All Gens' },
  { id: 1, label: '1st Gen' },
  { id: 2, label: '2nd Gen' },
  { id: 3, label: '3rd Gen' },
  { id: 4, label: '4th Gen' },
  { id: 5, label: '5th Gen' },
];

export default function ArtistDirectoryTab() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [genFilter, setGenFilter] = useState('all');
  const [globalOnly, setGlobalOnly] = useState(false);
  const [virtualOnly, setVirtualOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ARTIST_DIRECTORY.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q)) return false;
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (genFilter !== 'all' && a.gen !== genFilter) return false;
      if (globalOnly && !a.global) return false;
      if (virtualOnly && !a.virtualFictional) return false;
      return true;
    });
  }, [search, typeFilter, genFilter, globalOnly, virtualOnly]);

  const selectStyle = {
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    fontSize: 13,
    background: 'white',
    color: '#374151',
  };

  const pillStyle = (active) => ({
    padding: '6px 12px',
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
    background: active ? '#2D6A4F' : '#f3f4f6',
    color: active ? 'white' : '#6b7280',
    WebkitAppearance: 'none',
    appearance: 'none',
    fontFamily: 'inherit',
  });

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search artists..."
        style={{ display: 'block', width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #e5e7eb', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
          {TYPE_OPTIONS.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <select
          value={genFilter}
          onChange={(e) => setGenFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          style={{ ...selectStyle, flex: 1 }}
        >
          {GEN_OPTIONS.map((g) => (
            <option key={g.id} value={g.id}>{g.label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setGlobalOnly(!globalOnly)} style={pillStyle(globalOnly)}>
          Global
        </button>
        <button onClick={() => setVirtualOnly(!virtualOnly)} style={pillStyle(virtualOnly)}>
          Virtual / Fictional
        </button>
      </div>

      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>
        {filtered.length} artist{filtered.length === 1 ? '' : 's'}
      </p>

      <div style={{ maxHeight: 500, overflowY: 'auto' }}>
        {filtered.map((a) => (
          <button
            key={a.name}
            onClick={() => openArtistPage(a.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              textAlign: 'left',
              background: 'white',
              border: '1px solid #f3f4f6',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 6,
              cursor: 'pointer',
              WebkitAppearance: 'none',
              appearance: 'none',
              fontFamily: 'inherit',
              color: '#1B4332',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700 }}>{a.name}</span>
            <span style={{ fontSize: 11, color: '#84A98C' }}>
              {a.type}{a.gen ? ` · ${a.gen}th gen` : ''}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>No artists match those filters.</p>
        )}
      </div>
    </div>
  );
}
