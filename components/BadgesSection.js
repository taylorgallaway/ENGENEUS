'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BADGES } from '../lib/badges';
import { starClipPath } from '../lib/badgeShape';

const SHAPE = starClipPath(10, 50, 36);

export default function BadgesSection({ userId }) {
  const [loading, setLoading] = useState(true);
  const [earned, setEarned] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId);
      setEarned(data || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return null;

  return (
    <div style={{ marginTop: 32, marginBottom: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>
        Badges
      </p>
      {earned.length === 0 ? (
        <p style={{ fontSize: 12, color: '#9ca3af' }}>No badges earned yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {earned.map(({ badge_id }) => {
            const badge = BADGES[badge_id];
            if (!badge) return null;
            return (
              <div key={badge_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 72 }} title={badge.description}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    clipPath: SHAPE,
                    background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]}, ${badge.colors[2]})`,
                    boxShadow: `0 3px 10px ${badge.colors[1]}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{badge.emoji}</span>
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#1B4332', textAlign: 'center', marginTop: 8, lineHeight: 1.2 }}>
                  {badge.name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
