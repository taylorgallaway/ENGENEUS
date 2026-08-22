'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProfileTab from '../components/ProfileTab';
import MatchesTab from '../components/MatchesTab';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

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

  if (loading) {
    return <p style={{ fontFamily: 'sans-serif', margin: 40 }}>Loading...</p>;
  }

  if (!user) {
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
          <a href="/login" style={navLinkStyle}>Log In</a>
          <a href="/signup" style={navLinkStyle}>Sign Up</a>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', emoji: '👤' },
    { id: 'matches', label: 'Matches', emoji: '💚' },
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: 'white', paddingBottom: 80 }}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '30px 20px' }}>
        {activeTab === 'profile' && <ProfileTab user={user} />}
        {activeTab === 'matches' && <MatchesTab user={user} />}
      </div>

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: activeTab === tab.id ? '#2D6A4F' : '#9ca3af',
              fontWeight: activeTab === tab.id ? 700 : 400,
              fontSize: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9ca3af', fontSize: 12 }}
        >
          <span style={{ fontSize: 20 }}>🚪</span>
          Log Out
        </button>
      </nav>
    </div>
  );
}
