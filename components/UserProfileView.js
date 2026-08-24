'use client';

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

function fallbackSearchUrl(artist) {
  return `https://www.google.com/search?q=${encodeURIComponent(artist + ' K-pop profile')}`;
}

async function openArtistPage(artist) {
  try {
    const res = await fetch(`/api/artist-lookup?name=${encodeURIComponent(artist)}`);
    const data = await res.json();
    if (data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer');
      return;
    }
  } catch (e) {
    // fall through to the backup search below
  }
  window.open(fallbackSearchUrl(artist), '_blank', 'noopener,noreferrer');
}

export default function UserProfileView({ profile, onBack }) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 13, marginBottom: 16, padding: 0 }}
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
        <p style={{ fontWeight: 900, fontSize: 24, letterSpacing: '0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          {profile.bias_sticker && <StickerImg emoji={profile.bias_sticker} size={18} />}
          {profile.username}
        </p>
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Bio</p>
      <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>{profile.bio || '(no bio yet)'}</p>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Active Fav</p>
      <p style={{ fontSize: 14, color: '#2D6A4F', fontWeight: 600, marginBottom: 20 }}>
        {profile.fav_song || 'none'} — {profile.fav_artist || 'none'}
      </p>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Following</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {artist}
          </button>
        ))}
      </div>
    </div>
  );
}
