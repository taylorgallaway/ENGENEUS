'use client';

export default function BadgeIcon({ badge, size = 76 }) {
  return (
    <img
      src={badge.image}
      alt={badge.name}
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
}
