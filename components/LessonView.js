'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LearnWordsStep from './LearnWordsStep';
import SayItStep from './SayItStep';
import MatchStep from './MatchStep';
import DrawItStep from './DrawItStep';

const PHASES = ['words', 'say-it', 'match', 'draw-it', 'lyrics'];

export default function LessonView({ lesson, user, onBack }) {
  const hasVocab = lesson.vocabulary && lesson.vocabulary.length > 0;
  const [phaseIndex, setPhaseIndex] = useState(hasVocab ? 0 : PHASES.length - 1);

  const vocabByKorean = {};
  (lesson.vocabulary || []).forEach((w) => { vocabByKorean[w.korean] = w; });

  const advance = () => setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1));
  const phase = PHASES[phaseIndex];

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

      {phase === 'words' && (
        <LearnWordsStep
          vocabulary={lesson.vocabulary}
          user={user}
          songName={lesson.songName}
          artist={lesson.artist}
          onComplete={advance}
        />
      )}

      {phase === 'say-it' && <SayItStep vocabulary={lesson.vocabulary} onComplete={advance} />}

      {phase === 'match' && <MatchStep vocabulary={lesson.vocabulary} onComplete={advance} />}

      {phase === 'draw-it' && <DrawItStep vocabulary={lesson.vocabulary} onComplete={advance} />}

      {phase === 'lyrics' && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            Lyrics Review
          </p>
          {(lesson.lines || []).map((line, i) => (
            <div key={i} style={{ border: '1px solid #f3f4f6', borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <p style={{ fontWeight: 700, margin: 0, color: '#1B4332' }}>{line.korean}</p>
              <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>{line.english}</p>
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
          <p style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 700, marginTop: 20, textAlign: 'center' }}>
            🎉 Lesson complete!
          </p>
        </>
      )}
    </div>
  );
}
