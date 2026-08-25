'use client';

import { ArrowLeft } from 'lucide-react';

export default function LessonView({ lesson, onBack }) {
  const vocabByKorean = {};
  (lesson.vocabulary || []).forEach((w) => { vocabByKorean[w.korean] = w; });

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6b7280',
          fontSize: 13,
          marginBottom: 16,
          padding: 0,
          WebkitAppearance: 'none',
          appearance: 'none',
          fontFamily: 'inherit',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <p style={{ fontSize: 20, fontWeight: 900, color: '#1B4332', margin: '0 0 4px' }}>
        {lesson.songName || 'Untitled'}
      </p>
      <p style={{ fontSize: 13, color: '#84A98C', fontWeight: 600, marginBottom: 24 }}>
        {lesson.artist || 'Unknown artist'}
      </p>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
        Vocabulary
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {(lesson.vocabulary || []).map((w) => (
          <span
            key={w.korean}
            title={`${w.romanization} — ${w.english}`}
            style={{ fontSize: 12, background: '#2D6A4F1A', color: '#1B4332', padding: '6px 10px', borderRadius: 999, fontWeight: 600 }}
          >
            {w.korean} <span style={{ color: '#84A98C' }}>· {w.english}</span>
          </span>
        ))}
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
        Lyrics
      </p>
      {(lesson.lines || []).map((line, i) => (
        <div key={i} style={{ border: '1px solid #f3f4f6', borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <p style={{ fontWeight: 700, margin: 0, color: '#1B4332' }}>{line.korean}</p>
          <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>{line.english}</p>
          {line.skipReason && (
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>(skipped: {line.skipReason})</p>
          )}
          {(line.wordKoreans || []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {line.wordKoreans.map((kw) => {
                const w = vocabByKorean[kw];
                return (
                  <span
                    key={kw}
                    title={w ? `${w.romanization} — ${w.english}` : ''}
                    style={{ fontSize: 11, background: '#2D6A4F1A', color: '#1B4332', padding: '3px 8px', borderRadius: 999 }}
                  >
                    {kw}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 20, textAlign: 'center' }}>
        This is the raw lesson content — the full interactive lesson (word practice, matching, speaking, drawing) is the next build step.
      </p>
    </div>
  );
}
