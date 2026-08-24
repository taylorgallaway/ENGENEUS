'use client';

import { useEffect } from 'react';
import { BADGES } from '../lib/badges';

export default function BadgeCelebration({ badgeIds, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!badgeIds || badgeIds.length === 0) return null;
  const badges = badgeIds.map((id) => BADGES[id]).filter(Boolean);
  if (badges.length === 0) return null;

  const colors = ['#2D6A4F', '#84A98C', '#FBBF24', '#F87171', '#60A5FA'];

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${(i * 37) % 100}%`,
              top: '-10px',
              width: 6,
              height: 12,
              background: colors[i % colors.length],
              borderRadius: 2,
              animation: `badgeConfetti ${1.6 + (i % 5) * 0.2}s linear ${(i % 6) * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'white', borderRadius: 24, padding: 28, textAlign: 'center', maxWidth: 320, position: 'relative' }}
      >
        <p style={{ fontSize: 12, fontWeight: 700, color: '#84A98C', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
          Badge Earned!
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          {badges.map((badge) => (
            <div key={badge.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 90 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1B4332, #2D6A4F, #84A98C)',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 34,
                  }}
                >
                  {badge.emoji}
                </div>
              </div>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#1B4332', marginTop: 8 }}>{badge.name}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onDismiss}
          style={{ padding: '10px 24px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
        >
          Nice!
        </button>
      </div>

      <style>{`
        @keyframes badgeConfetti {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
