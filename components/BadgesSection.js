'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BADGES } from '../lib/badges';

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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {earned.map(({ badge_id }) => {
            const badge = BADGES[badge_id];
            if (!badge) return null;
            return (
              <div key={badge_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 70 }} title={badge.description}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1B4332, #2D6A4F, #84A98C)',
                    padding: 3,
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
                      fontSize: 26,
                    }}
                  >
                    {badge.emoji}
                  </div>
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#1B4332', textAlign: 'center', marginTop: 6, lineHeight: 1.2 }}>
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
