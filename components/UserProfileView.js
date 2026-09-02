'use client';

import BadgesSection from './BadgesSection';

function fallbackSearchUrl(artist) {
  return `https://www.google.com/search?q=${encodeURIComponent(artist + ' kpopping kpop profile')}`;
}

export async function openArtistPage(artist) {
  let res;
  try {
    res = await fetch(`/api/kpopping-lookup?name=${encodeURIComponent(artist)}`);
  } catch (e) {
    alert(`STEP 1 (fetch) failed: ${e.message}`);
    window.open(fallbackSearchUrl(artist), '_blank', 'noopener,noreferrer');
    return;
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    alert(`STEP 2 (parsing response) failed: ${e.message} — status was ${res.status}`);
    window.open(fallbackSearchUrl(artist), '_blank', 'noopener,noreferrer');
    return;
  }

  if (data.url) {
    try {
      window.open(data.url, '_blank', 'noopener,noreferrer');
      return;
    } catch (e) {
      alert(`STEP 3 (opening found url) failed: ${e.message} — url was ${data.url}`);
    }
  } else {
    alert(`No direct match — debug info: ${data.debug || 'none'}`);
  }

  window.open(fallbackSearchUrl(artist), '_blank', 'noopener,noreferrer');
}

function toCodePoint(emoji) {
  return [...emoji]
    .map((c) => c.codePointAt(0).toString(16))
    .filter((cp) => cp !== 'fe0f')
    .join('-');
}

function StickerImg({ emoji, size = 20 }) {
  const cp = toCodePoint(emoji);
  const base = cp === '1fabc'
    ? 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72'
    : 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72';
  return (
    <img
      src={`${base}/${cp}.png`}
      alt={emoji}
      width={size}
      height={size}
      style={{ display: 'inline-block' }}
    />
  );
}

export default function UserProfileView({ profile, onBack }) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6b7280',
          fontSize: 13,
          marginBottom: 16,
          padding: 0,
          WebkitAppearance: 'none',
          appearance: 'none',
          fontFamily: 'inherit',
        }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#f3f4f6',
            border: '2px solid #e5e7eb',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt={profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        <p style={{ fontWeight: 900, fontSize: 24, letterSpacing: '0.03em', margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
          {profile.bias_sticker && <StickerImg emoji={profile.bias_sticker} size={18} />}
          {profile.username}
        </p>
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Bio</p>
      <p style={{ fontSize: 14, color: '#374151', marginBottom: 20, whiteSpace: 'pre-wrap' }}>{profile.bio || '(no bio yet)'}</p>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Favorite Song</p>
      <p style={{ fontSize: 14, color: '#2D6A4F', fontWeight: 600, marginBottom: 20 }}>{profile.fav_song || 'none'}</p>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Favorite Artist</p>
      <p style={{ fontSize: 14, color: '#2D6A4F', fontWeight: 600, marginBottom: 20 }}>{profile.fav_artist || 'none'}</p>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Following</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, marginLeft: -2, padding: 0 }}>
        {(profile.followed_artists || []).length === 0 && (
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Not following anyone yet.</span>
        )}
        {(profile.followed_artists || []).map((artist) => (
          <button
            key={artist}
            onClick={() => openArtistPage(artist)}
            style={{
              background: '#2D6A4F1A',
              color: '#1B4332',
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 10px',
              margin: 0,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              WebkitAppearance: 'none',
              appearance: 'none',
            }}
          >
            {artist}
          </button>
        ))}
      </div>

      <BadgesSection userId={profile.id} />
    </div>
  );
}
