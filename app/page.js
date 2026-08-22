'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const navLinkStyle = {
    display: 'block',
    padding: '12px 20px',
    background: '#2D6A4F',
    color: 'white',
    borderRadius: 8,
    textDecoration: 'none',
    marginTop: 10,
    textAlign: 'center',
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        background: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          margin: 0,
          background: 'linear-gradient(90deg, #1B4332, #2D6A4F)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        ENGENEUS
      </h1>
      <p style={{ color: '#84A98C', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.25rem' }}>
        Learn Through Music
      </p>

      <div style={{ width: '100%', maxWidth: 300, marginTop: 40 }}>
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <>
            <p style={{ color: '#6b7280' }}>Logged in as {user.email}</p>
            <a href="/profile" style={navLinkStyle}>My Profile</a>
            <a href="/matches" style={navLinkStyle}>Fandom Matches</a>
            <button onClick={handleLogout} style={{ ...navLinkStyle, background: '#9ca3af', border: 'none', cursor: 'pointer', width: '100%' }}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <a href="/login" style={navLinkStyle}>Log In</a>
            <a href="/signup" style={navLinkStyle}>Sign Up</a>
          </>
        )}
      </div>
    </main>
  );
}
