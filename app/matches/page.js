'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Matches() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadMatches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage('You need to log in first.');
        setLoading(false);
        return;
      }

      const { data: myProfile } = await supabase
        .from('profiles')
        .select('followed_artists')
        .eq('id', user.id)
        .single();

      const myArtists = myProfile?.followed_artists || [];

      if (myArtists.length === 0) {
        setMessage('Add some followed artists on your profile first, then come back here.');
        setLoading(false);
        return;
      }

      const { data: everyone, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      if (error) {
        setMessage(`Error: ${error.message}`);
        setLoading(false);
        return;
      }

      const withOverlap = (everyone || [])
        .map(person => {
          const theirArtists = person.followed_artists || [];
          const shared = theirArtists.filter(a => myArtists.includes(a));
          return { ...person, shared };
        })
        .filter(person => person.shared.length > 0)
        .sort((a, b) => b.shared.length - a.shared.length);

      setMatches(withOverlap);
      setLoading(false);
    }

    loadMatches();
  }, []);

  if (loading) return <p style={{ fontFamily: 'sans-serif', margin: 40 }}>Loading...</p>;

  return (
    <main style={{ maxWidth: 500, margin: '60px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ color: '#1B4332' }}>Fandom Matches</h1>
      {message && <p>{message}</p>}
      {matches.map(person => (
        <div key={person.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 15, marginTop: 15 }}>
          <p style={{ fontWeight: 'bold', margin: 0 }}>
            {person.bias_sticker} {person.username}
          </p>
          <p style={{ fontSize: 13, color: '#666', margin: '5px 0' }}>{person.bio}</p>
          <p style={{ fontSize: 13, color: '#2D6A4F' }}>
            Shared: {person.shared.join(', ')}
          </p>
        </div>
      ))}
      {!loading && matches.length === 0 && !message && (
        <p>No matches yet — no one else shares your followed artists.</p>
      )}
    </main>
  );
}
