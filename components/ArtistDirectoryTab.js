'use client';

import { useState, useMemo } from 'react';
import { ARTIST_DIRECTORY } from '../lib/artistDirectory';
import { openArtistPage } from './UserProfileView';

// Filenames of the photos we actually have — matched against artist names by
// stripping spaces/punctuation/case, so small formatting differences in the
// directory data don't cause a missed match.
const PHOTO_FILENAMES = [
  '82major', 'aespa', 'alpha_drive_one', 'and_team', 'ateez', 'babymonster',
  'big_ocean', 'bigbang', 'blackpink', 'blitzers', 'boynextdoor', 'bts',
  'close_your_eyes', 'cortis', 'cravity', 'dreamcatcher', 'enhypen', 'epex',
  'evnne', 'everglow', 'exo', 'fifty_fifty', 'gfriend', 'girlset', 'got7',
  'hearts2hearts', 'illit', 'itzy', 'ive', 'katseye', 'kep1er', 'kickflip',
  'kiiikiii', 'kiss_of_life', 'le_sserafim', 'lngshot', 'loona', 'mamamoo',
  'meovv', 'modyssey', 'monsta_x', 'nct', 'nct_127', 'nct_dream', 'nct_wish',
  'newbeat', 'newjeans', 'nexz', 'nmixx', 'one_pact', 'oneus', 'p1harmony',
  'plave', 'red_velvet', 'riize', 'seventeen', 'shinee', 'stayc', 'stray_kids',
  'the_boyz', 'tomorrow_x_together', 'treasure', 'tuide', 'twice', 'tws',
  'wayf_boyz', 'wayv', 'xg', 'xikers', 'xlov', 'zerobaseone',
];
// (G)I-DLE special case: normalizeForMatch strips the parentheses, so
// 'gidle.jpg' matches '(G)I-DLE' naturally once normalized. Included above
// via the explicit alias below since 'gidle' itself isn't a real artist name.
PHOTO_FILENAMES.push('gidle');
// Photos now live at /public/artist-photos-wide/ as 640x360 landscape crops.

function normalizeForMatch(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const PHOTO_MAP = {};
PHOTO_FILENAMES.forEach((fname) => {
  PHOTO_MAP[normalizeForMatch(fname.replace(/_/g, ' '))] = fname;
});
// &TEAM special case: normalizeForMatch strips '&' entirely rather than
// turning it into 'and', so '&TEAM' normalizes to 'team' while our filename
// 'and_team' normalizes to 'andteam' — they would not match automatically.
PHOTO_MAP['team'] = 'and_team';

function getPhotoFor(name) {
  const key = normalizeForMatch(name);
  return PHOTO_MAP[key] ? `/artist-photos-wide/${PHOTO_MAP[key]}.jpg` : null;
}

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
    const matches = ARTIST_DIRECTORY.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q)) return false;
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (genFilter !== 'all' && a.gen !== genFilter) return false;
      if (globalOnly && !a.global) return false;
      if (virtualOnly && !a.virtualFictional) return false;
      return true;
    });
    // Artists with a real photo always come first, then most well-known,
    // then everyone else alphabetically.
    return matches.sort((a, b) => {
      const aHasPhoto = getPhotoFor(a.name) ? 0 : 1;
      const bHasPhoto = getPhotoFor(b.name) ? 0 : 1;
      if (aHasPhoto !== bHasPhoto) return aHasPhoto - bHasPhoto;
      const ap = a.popularity ?? Infinity;
      const bp = b.popularity ?? Infinity;
      if (ap !== bp) return ap - bp;
      return a.name.localeCompare(b.name);
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
              display: 'block',
              width: '100%',
              textAlign: 'left',
              background: 'white',
              border: '1px solid #f3f4f6',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 10,
              cursor: 'pointer',
              WebkitAppearance: 'none',
              appearance: 'none',
              fontFamily: 'inherit',
              color: '#1B4332',
              padding: 0,
            }}
          >
            {getPhotoFor(a.name) && (
              <img
                src={getPhotoFor(a.name)}
                alt={a.name}
                style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</span>
              <span style={{ fontSize: 13, color: '#84A98C', fontWeight: 600, background: '#2D6A4F1A', padding: '4px 10px', borderRadius: 999 }}>
                {a.type}{a.gen ? ` · ${a.gen}th gen` : ''}
              </span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>No artists match those filters.</p>
        )}
      </div>
    </div>
  );
}
