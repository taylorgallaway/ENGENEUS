'use client';

import { useEffect, useState } from 'react';
import { User, Heart, MessageCircle, Newspaper, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import ProfileTab from '../components/ProfileTab';
import MatchesTab from '../components/MatchesTab';
import ChatsSection from '../components/ChatsSection';
import ChatWindow from '../components/ChatWindow';
import FandomChatWindow from '../components/FandomChatWindow';
import NewsTab from '../components/NewsTab';
import UserProfileView from '../components/UserProfileView';
import AwardsTab from '../components/AwardsTab';
import InfoModal from '../components/InfoModal';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [chatWithUser, setChatWithUser] = useState(null);
  const [fandomRoom, setFandomRoom] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

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
    { id: 'profile', label: 'Profile', Icon: User },
    { id: 'matches', label: 'Matches', Icon: Heart },
    { id: 'news', label: 'News', Icon: Newspaper },
    { id: 'awards', label: 'Awards', Icon: Trophy },
    { id: 'chats', label: 'Chats', Icon: MessageCircle },
  ];

  const overlayActive = !!chatWithUser || !!fandomRoom || !!viewingProfile;

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: 'white', paddingBottom: 80 }}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '16px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <InfoModal />
      </div>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '10px 20px 30px' }}>
        {chatWithUser ? (
          <ChatWindow currentUser={user} otherUser={chatWithUser} onBack={() => setChatWithUser(null)} />
        ) : fandomRoom ? (
          <FandomChatWindow currentUser={user} artist={fandomRoom} onBack={() => setFandomRoom(null)} />
        ) : viewingProfile ? (
          <UserProfileView profile={viewingProfile} onBack={() => setViewingProfile(null)} />
        ) : (
          <>
            {activeTab === 'profile' && <ProfileTab user={user} />}
            {activeTab === 'matches' && (
              <MatchesTab
                user={user}
                onMessage={(person) => setChatWithUser(person)}
                onViewProfile={(person) => setViewingProfile(person)}
              />
            )}
            {activeTab === 'news' && <NewsTab user={user} />}
            {activeTab === 'awards' && <AwardsTab user={user} />}
            {activeTab === 'chats' && (
              <ChatsSection
                user={user}
                onOpenChat={(person) => setChatWithUser(person)}
                onOpenFandomRoom={(artist) => setFandomRoom(artist)}
              />
            )}
          </>
        )}
      </div>

      {!overlayActive && (
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
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                color: activeTab === id ? '#2D6A4F' : '#9ca3af',
                fontWeight: activeTab === id ? 700 : 400,
                fontSize: 10,
              }}
            >
              <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 2} />
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
