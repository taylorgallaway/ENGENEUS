'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setMessage('Logging in...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Logged in! Redirecting...');
      router.push('/');
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ color: '#1B4332' }}>Log in to ENGENEUS</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', padding: 10, marginTop: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', padding: 10, marginTop: 10 }}
      />
      <button
        onClick={handleLogin}
        style={{ marginTop: 15, padding: '10px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 8 }}
      >
        Log In
      </button>
      <p style={{ marginTop: 15 }}>{message}</p>
    </main>
  );
}
