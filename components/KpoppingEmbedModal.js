'use client';

// Test component: attempts to embed an artist's Kpopping page directly in
// the app via iframe. Browsers can't reliably tell us if a site blocks
// embedding (a blocked frame often still "loads" from JS's perspective),
// so instead of guessing, this always shows a visible "open on Kpopping"
// link too — if the frame below looks blank/broken, that's Kpopping
// blocking embeds, and the link is the real way through.

export default function KpoppingEmbedModal({ url, artistName, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          margin: 'auto',
          width: '95%',
          maxWidth: 700,
          height: '85vh',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14, color: '#1B4332' }}>{artistName}</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#2D6A4F', fontWeight: 700, textDecoration: 'underline' }}
            >
              Open on Kpopping instead
            </a>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                color: '#9ca3af',
                lineHeight: 1,
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            >
              ×
            </button>
          </div>
        </div>
        <iframe
          src={url}
          title={`${artistName} on Kpopping`}
          style={{ flex: 1, border: 'none', width: '100%' }}
        />
      </div>
    </div>
  );
}
