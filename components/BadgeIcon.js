'use client';

// Wraps the badge art in a soft circular backdrop slightly larger than the image
// itself — this turns the thin leftover cropping border into an intentional frame
// instead of a stray edge, and gives room to breathe.
export default function BadgeIcon({ badge, size = 76 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#fafafa',
        border: '1px solid #f0f0f0',
        padding: size * 0.1,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <img
        src={badge.image}
        alt={badge.name}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}
