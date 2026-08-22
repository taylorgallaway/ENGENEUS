'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    setMessage('Creating account...');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Success! Check your email to confirm your account.');
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ color: '#1B4332' }}>Create your ENGENEUS account</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', padding: 10, marginTop: 10 }}
      />
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', padding: 10, marginTop: 10 }}
      />
      <button
        onClick={handleSignUp}
        style={{ marginTop: 15, padding: '10px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 8 }}
      >
        Sign Up
      </button>
      <p style={{ marginTop: 15 }}>{message}</p>
    </main>
  );
}
