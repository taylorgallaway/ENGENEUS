'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LearnWordsStep from './LearnWordsStep';
import SayItStep from './SayItStep';
import MatchStep from './MatchStep';
import DrawItStep from './DrawItStep';

const WORD_PHASES = ['learn', 'say-it', 'draw-it'];

export default function LessonView({ lesson, user, onBack }) {
  const vocabulary = lesson.vocabulary || [];
  const hasVocab = vocabulary.length > 0;

  const [wordIndex, setWordIndex] = useState(0);
  const [wordPhaseIndex, setWordPhaseIndex] = useState(0);
  const [stage, setStage] = useState(hasVocab ? 'words' : 'match'); // 'words' -> 'match' -> 'lyrics'

  const vocabByKorean = {};
  vocabulary.forEach((w) => { vocabByKorean[w.korean] = w; });

  const advanceWithinWord = () => {
    if (wordPhaseIndex + 1 < WORD_PHASES.length) {
      setWordPhaseIndex(wordPhaseIndex + 1);
    } else if (wordIndex + 1 < vocabulary.length) {
      setWordIndex(wordIndex + 1);
      setWordPhaseIndex(0);
    } else {
      setStage('match');
    }
  };

  const currentWord = vocabulary[wordIndex];
  const currentWordPhase = WORD_PHASES[wordPhaseIndex];

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
      <p style={{ fontSize: 13, color: '#84A98C', fontWeight: 600, marginBottom: 20 }}>
        {lesson.artist || 'Unknown artist'}
      </p>

      {stage === 'words' && (
        <>
          <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginBottom: 4 }}>
            Word {wordIndex + 1} / {vocabulary.length}
          </p>
          {currentWordPhase === 'learn' && (
            <LearnWordsStep
              word={currentWord}
              user={user}
              songName={lesson.songName}
              artist={lesson.artist}
              onComplete={advanceWithinWord}
            />
          )}
          {currentWordPhase === 'say-it' && (
            <SayItStep word={currentWord} onComplete={advanceWithinWord} />
          )}
          {currentWordPhase === 'draw-it' && (
            <DrawItStep word={currentWord} onComplete={advanceWithinWord} />
          )}
        </>
      )}

      {stage === 'match' && (
        <MatchStep vocabulary={vocabulary} onComplete={() => setStage('lyrics')} />
      )}

      {stage === 'lyrics' && (
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
