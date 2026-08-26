'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import BadgeCelebration from './BadgeCelebration';

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return 'just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

const COMEBACK_KEYWORDS = [
  'comeback', 'returns with', 'makes a return', 'new mini album',
  'new album', 'title track', 'makes a comeback',
];

function looksLikeComeback(title) {
  const lower = title.toLowerCase();
  return COMEBACK_KEYWORDS.some((kw) => lower.includes(kw));
}

export default function NewsTab({ user }) {
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState([]);
  const [message, setMessage] = useState('');
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('followed_artists')
        .eq('id', user.id)
        .single();

      const artists = profile?.followed_artists || [];

      if (artists.length === 0) {
        setMessage('Add some followed artists on your profile to see news here.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (data.error) {
          setMessage('Could not load news right now — try again later.');
          setLoading(false);
          return;
        }
        const lowerArtists = artists.map((a) => a.toLowerCase());
        const matched = (data.items || []).filter((item) => {
          const cats = (item.categories || []).map((c) => c.toLowerCase());
          const titleLower = item.title.toLowerCase();
          return lowerArtists.some((a) => cats.includes(a) || titleLower.includes(a));
        });
        setNewsItems(matched);

        // Comeback detection — check matched articles for comeback language,
        // log any new ones, and award badges based on how many they've seen.
        const comebackMatches = matched.filter((item) => looksLikeComeback(item.title));
        let newlyLogged = false;
        for (const item of comebackMatches) {
          const { error } = await supabase.from('comeback_sightings').insert({
            user_id: user.id,
            artist: item.categories?.[0] || 'Unknown',
            article_link: item.link,
          });
          if (!error) newlyLogged = true;
        }

        if (newlyLogged) {
          const earned = [];
          const tryAward = async (badgeId) => {
            const { error } = await supabase.from('user_badges').insert({ user_id: user.id, badge_id: badgeId });
            if (!error) earned.push(badgeId);
          };
          await tryAward('comeback');

          const { count } = await supabase
            .from('comeback_sightings')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);

          if ((count || 0) >= 5) await tryAward('comeback_veteran');
          if ((count || 0) >= 10) await tryAward('comeback_historian');

          if (earned.length > 0) setNewBadges(earned);
        }
      } catch (e) {
        setMessage('Could not load news right now — try again later.');
      }
      setLoading(false);
    }
    load();
  }, [user.id]);

  if (loading) return <p>Loading...</p>;

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
        News Hub
      </h1>
      {message && <p style={{ fontSize: 13, color: '#9ca3af' }}>{message}</p>}
      {!message && newsItems.length === 0 && (
        <p style={{ fontSize: 13, color: '#9ca3af' }}>No recent news found for your followed artists — check back soon.</p>
      )}
      {newsItems.map((item) => (
        <a
          key={item.link}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #eee',
            borderRadius: 12,
            padding: 15,
            marginBottom: 12,
          }}
        >
          <p style={{ fontSize: 11, color: '#2D6A4F', fontWeight: 700, margin: 0 }}>{timeAgo(item.pubDate)}</p>
          <p style={{ fontWeight: 700, margin: '4px 0', fontSize: 14, color: '#1B4332' }}>{item.title}</p>
          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>{item.excerpt}</p>
        </a>
      ))}

      <BadgeCelebration badgeIds={newBadges} onDismiss={() => setNewBadges([])} />
    </div>
  );
}
