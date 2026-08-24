'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BADGES } from '../lib/badges';
import BadgeIcon from './BadgeIcon';

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

  const iconSize = 96;
  const cardWidth = iconSize + 8;

  return (
    <div style={{ marginTop: 44, marginBottom: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 20px' }}>
        Badges
      </p>
      {earned.length === 0 ? (
        <p style={{ fontSize: 12, color: '#9ca3af' }}>No badges earned yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {earned.map(({ badge_id }) => {
            const badge = BADGES[badge_id];
            if (!badge) return null;
            return (
              <div key={badge_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: cardWidth }} title={badge.description}>
                <BadgeIcon badge={badge} size={iconSize} />
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1B4332',
                    textAlign: 'center',
                    marginTop: 8,
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
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
