'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';

const RULES = [
  { label: 'No Bullying or Harassment', desc: 'Treat every fan with respect. Hate speech, personal attacks, or targeted exclusion will not be tolerated.' },
  { label: 'No Arguments', desc: 'Keep discussions friendly. Healthy debates about music are welcome; toxic fan wars and fighting are banned.' },
  { label: 'Keep Swearing to a Minimum', desc: 'Excessive profanity is strictly prohibited to keep our rooms welcoming and youth-safe.' },
  { label: 'No Inappropriate Content', desc: 'Uploading explicit, adult (NSFW), or graphic images and text is met with a zero-tolerance permanent ban.' },
  { label: 'No Spamming or Self-Promo', desc: 'Do not flood the chats with repetitive messages, and do not advertise external links or personal stores.' },
  { label: 'Protect Personal Privacy', desc: 'Do not share private personal information (doxxing), real names, or contact details of yourself or others.' },
  { label: 'No Bots or Automation', desc: 'Automated scripts, spam bots, or scrapers are strictly prohibited to ensure system stability.' },
];

export default function InfoModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Community Rules and Copyright Notice"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 4 }}
      >
        <Info size={20} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 50,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: 24,
              maxWidth: 480,
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ color: '#1B4332', fontWeight: 900, fontSize: 20, margin: 0 }}>Community Rules &amp; Guidelines</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>
              <p>
                ENGENEUS was built by fans, for fans. Our platform was designed to enable users to learn the music they love in a community that shares their passion.
              </p>
              <p>
                Enjoying the site?{' '}
                <a href="https://ko-fi.com/engeneus" target="_blank" rel="noopener noreferrer" style={{ color: '#2D6A4F', fontWeight: 600 }}>
                  Buy us a coffee!
                </a>{' '}
                Every tip helps keep our platform alive and accessible for fans.
              </p>
              <p>
                Not enjoying the site? Feel free to reach out to{' '}
                <a href="mailto:tgallaway15@icloud.com" style={{ color: '#2D6A4F', fontWeight: 600 }}>
                  tgallaway15@icloud.com
                </a>{' '}
                with any questions, comments, or concerns!
              </p>

              <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '20px 0' }} />

              <h3 style={{ color: '#1B4332', fontWeight: 800, fontSize: 15, margin: '0 0 8px' }}>Community Rules &amp; Guidelines</h3>
              <p>
                To ensure our chat rooms remain a safe, fun, and welcoming community for everyone, all users must follow our core guidelines. Violations will result in warnings or immediate account bans:
              </p>
              <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
                {RULES.map((rule) => (
                  <li key={rule.label} style={{ marginBottom: 8 }}>
                    <strong style={{ color: '#1B4332' }}>{rule.label}:</strong> {rule.desc}
                  </li>
                ))}
              </ul>

              <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '20px 0' }} />

              <h3 style={{ color: '#1B4332', fontWeight: 800, fontSize: 15, margin: '0 0 8px' }}>Copyright Notice &amp; DMCA Takedown Policy</h3>

              <p style={{ fontWeight: 700, color: '#1B4332', margin: '12px 0 4px' }}>1. Educational Fair Use Notice</p>
              <p>
                Engeneus is an interactive, community-driven educational platform designed strictly for linguistic analysis, language learning, and Korean-English translation study. This platform utilizes user-submitted text fragments and song lyrics under the Fair Use provisions of international copyright law (including Section 107 of the U.S. Copyright Act), as the materials are transformed into interactive linguistic quizzes, vocabulary worksheets, and educational mini-games. Engeneus does not claim ownership over any song lyrics, track titles, or artist metadata inputted by its users.
              </p>

              <p style={{ fontWeight: 700, color: '#1B4332', margin: '12px 0 4px' }}>2. DMCA Takedown Policy &amp; Digital Safety Harbor</p>
              <p>
                Engeneus respects the intellectual property rights of music creators, publishers, and record labels. In accordance with the Digital Millennium Copyright Act (DMCA) and global safe harbor provisions, we maintain a strict, immediate response system for copyright owners. If you are a copyright holder or an authorized agent representing a K-pop artist/label, and you object to the educational use of your lyrics on this platform, you may request immediate removal.
              </p>

              <p style={{ fontWeight: 700, color: '#1B4332', margin: '12px 0 4px' }}>3. How to Submit a Removal Request</p>
              <p>
                To notify our team, please send an email to{' '}
                <a href="mailto:tgallaway15@icloud.com" style={{ color: '#2D6A4F', fontWeight: 600 }}>
                  tgallaway15@icloud.com
                </a>
                . We will respond within 2 to 4 weeks.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
