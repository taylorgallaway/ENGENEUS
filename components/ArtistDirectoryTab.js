'use client';

import { useState, useMemo } from 'react';
import { ARTIST_DIRECTORY } from '../lib/artistDirectory';
import { openArtistPage } from './UserProfileView';

// Filenames of the photos we actually have — matched against artist names by
// stripping spaces/punctuation/case, so small formatting differences in the
// directory data don't cause a missed match.
const PHOTO_FILENAMES = [
  '015b', '0wave', '100', '10cm', '10x10', '1159cinderella', '11degrees',
  '12bh', '12dal', '14u', '15', '1_n', '1chu', '1nb', '1ps', '1punch',
  '1set', '1team', '1the9', '1tym', '24k', '257', '2am', '2boram', '2eyes',
  '2nb', '2ne1', '2night', '2nyne', '2pm', '2wentys', '2yoon', '2z',
  '3piece', '3racha', '3ye', '415', '42crew', '4carat', '4for', '4g', '4k',
  '4l', '4lit', '4men', '4minute', '4some', '4ten', '4tomorrow', '4x', '4x4',
  '5but', '5tion', '5urprise', '6fu', '7princesses', '7senses', '82major',
  '84ly', '8eight', '90tan', '9muses', '9muses_a', 'a4', 'a_b', 'a_c_e',
  'a_cian', 'a_daily', 'a_de', 'a_dean', 'a_fati', 'a_feel', 'a_h_h_a',
  'a_i_n', 'a_irid', 'a_jax', 'a_kor', 'a_kor_black', 'a_plus', 'a_prince',
  'a_s_blue', 'a_s_red', 'a_seed', 'a_sia', 'a_six', 'a_some',
  'a_train_to_autumn', 'ab6ix', 'ab_avenue', 'ablue', 'ablume', 'aboutu',
  'abry', 'acaxia', 'acid_angel_from_asia', 'acid_eyes', 'adap',
  'add_all_ears', 'adios_audio', 'adora', 'adya', 'aen', 'aeon', 'aeonit',
  'aespa', 'aesther', 'af_dream_girls', 'afos', 'afots', 'after_school',
  'afuture', 'alnst_cast', 'alpha_drive_one', 'amprule', 'and_team', 'astro',
  'ateez', 'b_dawn', 'babymonster', 'big_ocean', 'bigbang', 'blackpink',
  'blackswan', 'blitzers', 'boa', 'boy_story', 'boynextdoor',
  'brown_eyed_girls', 'bts', 'cl', 'close_your_eyes', 'cnblue', 'cortis',
  'cravity', 'daydream', 'dearalice', 'dream_sweet', 'dreamcatcher',
  'eclipse', 'enhypen', 'epex', 'everglow', 'evnne', 'exo', 'f_x',
  'fe_verse', 'fifty_fifty', 'fria', 'ftisland', 'gfriend', 'girlset',
  'got7', 'h_o_t', 'hearts2hearts', 'hori7on', 'huntr_x', 'hyuna',
  'iiterniti', 'illit', 'infinite', 'ini', 'irise', 'isegye_idol', 'itzy',
  'iu', 'ivan', 'ive', 'jo1', 'k_da', 'kara', 'katseye', 'kep1er',
  'kickflip', 'kiiikiii', 'kiss_of_life', 'krystal_eyes', 'le_sserafim',
  'lngshot', 'loona', 'luka', 'luna', 'mamamoo', 'mave', 'mayhem', 'meovv',
  'mirror', 'miss_a', 'mizi', 'modyssey', 'monsta_x', 'nct', 'nct_127',
  'nct_dream', 'nct_wish', 'newbeat', 'newjeans', 'nexz', 'niziu', 'nmixx',
  'oh_my_girl', 'one_or_eight', 'one_pact', 'oneus', 'p1harmony', 'pentagon',
  'pinkverse', 'plave', 'priz_re', 'priz_v', 'psy', 're_revolution',
  'red_velvet', 'riize', 'saja_boys', 'santos_bravos', 'sechskies',
  'seo_taiji_and_boys', 'seventeen', 'shax', 'shinee', 'shinhwa', 'sistar',
  'snh48', 'sparkling', 'stardays', 'stayc', 'stellive', 'stray_kids', 'sua',
  'sunmi', 'super_junior', 'superkind', 'syndi8', 't_ara', 't_e_n',
  'teaparty', 'the_boyz', 'till', 'tomorrow_x_together', 'treasure',
  'true_damage', 'tuide', 'tvxq', 'twice', 'tws', 'u_kiss', 'up10tion',
  'wayf_boyz', 'wayv', 'winner', 'wjsn', 'wonder_girls', 'xg', 'xikers',
  'xlov', 'zerobaseone', 'zico',
];
// (G)I-DLE special case: normalizeForMatch strips the parentheses, so
// 'gidle.jpg' matches '(G)I-DLE' naturally once normalized. Included above
// via the explicit alias below since 'gidle' itself isn't a real artist name.
PHOTO_FILENAMES.push('gidle');
// Photos now live at /public/artist-photos-wide/ as 640x360 landscape crops.

function normalizeForMatch(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function ordinal(n) {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
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
  // "Hyuna" (fictional singer) and "HyunA" (real artist) collide under
  // normal loose matching since it ignores case — handle them explicitly.
  if (name === 'Hyuna') return '/artist-photos-wide/hyuna.jpg';
  if (name === 'HyunA') return null; // no photo yet for the real HyunA

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
            onClick={() => openArtistPage(a.name, a.type)}
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
                {a.type}{a.gen ? ` · ${ordinal(a.gen)} gen` : ''}
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
