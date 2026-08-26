'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BADGES } from '../lib/badges';
import BadgeIcon from './BadgeIcon';

function MyBadges({ userId }) {
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

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;

  const cardWidth = 96 + 8;

  return (
    <div>
      {earned.length === 0 ? (
        <p style={{ fontSize: 13, color: '#9ca3af' }}>No badges earned yet — keep using ENGENEUS to unlock some!</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
          {earned.map(({ badge_id }) => {
            const badge = BADGES[badge_id];
            if (!badge) return null;
            return (
              <div key={badge_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: cardWidth }} title={badge.description}>
                <BadgeIcon badge={badge} size={96} />
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

function MostFollowedBoard() {
  const [loading, setLoading] = useState(true);
  const [ranked, setRanked] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profiles').select('*');
      const sorted = (data || [])
        .map((p) => ({ ...p, count: (p.followed_artists || []).length }))
        .filter((p) => p.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      setRanked(sorted);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;

  if (ranked.length === 0) {
    return <p style={{ fontSize: 13, color: '#9ca3af' }}>No one's followed any artists yet.</p>;
  }

  return (
    <div>
      {ranked.map((person, i) => (
        <div
          key={person.id}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: i < 3 ? '#2D6A4F' : '#9ca3af', width: 24 }}>#{i + 1}</span>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {person.avatar_url && (
              <img src={person.avatar_url} alt={person.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1B4332', margin: 0, flex: 1 }}>{person.username}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#2D6A4F', margin: 0 }}>{person.count}</p>
        </div>
      ))}
    </div>
  );
}

function TopStreaksBoard() {
  const [loading, setLoading] = useState(true);
  const [ranked, setRanked] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profiles').select('*');
      const sorted = (data || [])
        .filter((p) => (p.current_streak || 0) > 0)
        .sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0))
        .slice(0, 20);
      setRanked(sorted);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;

  if (ranked.length === 0) {
    return <p style={{ fontSize: 13, color: '#9ca3af' }}>No active streaks yet — come back daily to start one!</p>;
  }

  return (
    <div>
      {ranked.map((person, i) => (
        <div
          key={person.id}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: i < 3 ? '#2D6A4F' : '#9ca3af', width: 24 }}>#{i + 1}</span>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {person.avatar_url && (
              <img src={person.avatar_url} alt={person.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1B4332', margin: 0, flex: 1 }}>{person.username}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#2D6A4F', margin: 0 }}>{person.current_streak} 🔥</p>
        </div>
      ))}
    </div>
  );
}

function TopLearnersBoard() {
  const [loading, setLoading] = useState(true);
  const [ranked, setRanked] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('completed_lessons').select('user_id');
      const counts = {};
      (data || []).forEach((row) => {
        counts[row.user_id] = (counts[row.user_id] || 0) + 1;
      });
      const userIds = Object.keys(counts);
      if (userIds.length === 0) {
        setLoading(false);
        return;
      }
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds);
      const combined = (profiles || [])
        .map((p) => ({ ...p, count: counts[p.id] || 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      setRanked(combined);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;
  if (ranked.length === 0) return <p style={{ fontSize: 13, color: '#9ca3af' }}>No lessons completed yet — be the first!</p>;

  return (
    <div>
      {ranked.map((person, i) => (
        <div key={person.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: i < 3 ? '#2D6A4F' : '#9ca3af', width: 24 }}>#{i + 1}</span>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6', border: '1px solid #e5e7eb', overflow: 'hidden', flexShrink: 0 }}>
            {person.avatar_url && <img src={person.avatar_url} alt={person.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1B4332', margin: 0, flex: 1 }}>{person.username}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#2D6A4F', margin: 0 }}>{person.count} songs</p>
        </div>
      ))}
    </div>
  );
}

function TopFandomsBoard() {
  const [loading, setLoading] = useState(true);
  const [ranked, setRanked] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('fandom_messages').select('artist');
      const counts = {};
      (data || []).forEach((row) => {
        counts[row.artist] = (counts[row.artist] || 0) + 1;
      });
      const sorted = Object.entries(counts)
        .map(([artist, count]) => ({ artist, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      setRanked(sorted);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;
  if (ranked.length === 0) return <p style={{ fontSize: 13, color: '#9ca3af' }}>No fandom chat activity yet.</p>;

  return (
    <div>
      {ranked.map((row, i) => (
        <div key={row.artist} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: i < 3 ? '#2D6A4F' : '#9ca3af', width: 24 }}>#{i + 1}</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1B4332', margin: 0, flex: 1 }}>{row.artist}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#2D6A4F', margin: 0 }}>{row.count} messages</p>
        </div>
      ))}
    </div>
  );
}

function TopDonatorsBoard() {
  const [loading, setLoading] = useState(true);
  const [ranked, setRanked] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('donations').select('user_id, amount');
      const totals = {};
      (data || []).forEach((row) => {
        totals[row.user_id] = (totals[row.user_id] || 0) + Number(row.amount || 0);
      });
      const userIds = Object.keys(totals);
      if (userIds.length === 0) {
        setLoading(false);
        return;
      }
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds);
      const combined = (profiles || [])
        .map((p) => ({ ...p, total: totals[p.id] || 0 }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 20);
      setRanked(combined);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</p>;
  if (ranked.length === 0) return <p style={{ fontSize: 13, color: '#9ca3af' }}>No donations yet.</p>;

  return (
    <div>
      {ranked.map((person, i) => (
        <div key={person.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: i < 3 ? '#2D6A4F' : '#9ca3af', width: 24 }}>#{i + 1}</span>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6', border: '1px solid #e5e7eb', overflow: 'hidden', flexShrink: 0 }}>
            {person.avatar_url && <img src={person.avatar_url} alt={person.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1B4332', margin: 0, flex: 1 }}>{person.username}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#2D6A4F', margin: 0 }}>${person.total.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

function ComingSoonBoard({ needs }) {
  return (
    <div style={{ padding: '20px 0', textAlign: 'center' }}>
      <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
        This leaderboard isn't live yet — it needs <strong style={{ color: '#1B4332' }}>{needs}</strong> to exist first. It'll start filling in with real rankings the moment that's built.
      </p>
    </div>
  );
}

const LEADERBOARDS = [
  { id: 'most_followed', label: 'Most Followed', kind: 'real' },
  { id: 'top_learners', label: 'Top Learners', kind: 'learners' },
  { id: 'top_streaks', label: 'Top Streaks', kind: 'streaks' },
  { id: 'top_fandoms', label: 'Top Fandoms', kind: 'fandoms' },
  { id: 'top_donators', label: 'Top Donators', kind: 'donators' },
];

function Leaderboard() {
  const [board, setBoard] = useState('most_followed');
  const active = LEADERBOARDS.find((b) => b.id === board);

  useEffect(() => {
    // Rank-based badges (Top Five, Top Fandom, 1% Contributor) get checked
    // whenever someone actually looks at the leaderboard, rather than on a
    // schedule — no extra infrastructure needed for that.
    fetch('/api/award-rank-badges', { method: 'POST' }).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, justifyContent: 'center' }}>
        {LEADERBOARDS.map((b) => (
          <button
            key={b.id}
            onClick={() => setBoard(b.id)}
            style={{
              padding: '9px 16px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              background: board === b.id ? '#2D6A4F' : '#f3f4f6',
              color: board === b.id ? 'white' : '#6b7280',
              WebkitAppearance: 'none',
              appearance: 'none',
              fontFamily: 'inherit',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, color: '#84A98C', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>
        {active.label}
      </p>

      {active.kind === 'real' && <MostFollowedBoard />}
      {active.kind === 'streaks' && <TopStreaksBoard />}
      {active.kind === 'learners' && <TopLearnersBoard />}
      {active.kind === 'fandoms' && <TopFandomsBoard />}
      {active.kind === 'donators' && <TopDonatorsBoard />}
      {active.kind === 'soon' && <ComingSoonBoard needs={active.needs} />}
    </div>
  );
}

export default function AwardsTab({ user }) {
  const [subTab, setSubTab] = useState('badges');

  return (
    <div>
      <h1
        style={{
          color: '#1B4332',
          marginTop: 16,
          marginBottom: 20,
          fontSize: 36,
          fontWeight: 900,
          textTransform: 'uppercase',
          WebkitTextStroke: '1px #1B4332',
        }}
      >
        Awards
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
        {[
          { id: 'badges', label: 'My Badges' },
          { id: 'leaderboard', label: 'Leaderboard' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px 4px',
              fontSize: 13,
              fontWeight: 700,
              color: subTab === tab.id ? '#2D6A4F' : '#9ca3af',
              borderBottom: subTab === tab.id ? '2px solid #2D6A4F' : '2px solid transparent',
              marginRight: 20,
              WebkitAppearance: 'none',
              appearance: 'none',
              fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'badges' && <MyBadges userId={user.id} />}
      {subTab === 'leaderboard' && <Leaderboard />}
    </div>
  );
}
