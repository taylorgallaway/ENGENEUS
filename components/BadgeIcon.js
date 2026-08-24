'use client';

export default function BadgeIcon({ badge, size = 72 }) {
  const gradId = `grad-${badge.id}`;
  const [dark, mid, light] = badge.colors;

  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>

      <polygon points="32,66 32,112 42,101 50,113 50,66" fill={dark} />
      <polygon points="50,66 50,113 58,101 68,112 68,66" fill={dark} />

      <circle cx="50" cy="44" r="40" fill={`url(#${gradId})`} stroke={dark} strokeWidth="3" />

      <path
        d="M 22 30 A 32 32 0 0 1 62 14"
        fill="none"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <text x="50" y="52" fontSize="34" textAnchor="middle" dominantBaseline="middle">
        {badge.emoji}
      </text>
    </svg>
  );
}
