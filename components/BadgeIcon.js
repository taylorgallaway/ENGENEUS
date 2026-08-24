'use client';

// A soft circular backdrop holding the badge art — the subtle background turns
// any leftover edge from the source art into an intentional frame.
export default function BadgeIcon({ badge, size = 96 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#fafafa',
        border: '1px solid #f0f0f0',
        padding: size * 0.08,
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
