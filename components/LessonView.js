'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import LearnWordsStep from './LearnWordsStep';
import SayItStep from './SayItStep';
import MatchStep from './MatchStep';
import DrawItStep from './DrawItStep';

const WORD_PHASES = ['learn', 'say-it', 'draw-it'];
const MATCH_PAIR_TYPES = [
  ['romanization', 'english'],
  ['romanization', 'korean'],
  ['korean', 'english'],
];

// Groups of 4 — if only 1 word would be left dangling at the end, it merges
// into the previous group instead of getting its own lonely match round.
function computeGroups(vocab) {
  const groups = [];
  let i = 0;
  while (i < vocab.length) {
    const remaining = vocab.length - i;
    let size = Math.min(4, remaining);
    if (remaining - size === 1) size = remaining;
    groups.push(vocab.slice(i, i + size));
    i += size;
  }
  return groups;
}

export default function LessonView({ lesson, user, onBack }) {
  const vocabulary = lesson.vocabulary || [];
  const groups = useMemo(() => computeGroups(vocabulary), [vocabulary]);
  const hasVocab = groups.length > 0;

  // mode: 'learning' (learn/say/draw each word, then 3 match rounds for its group)
  //       'review'   (replay the 3 match rounds for every group again, cumulative)
  //       'lyrics'   (final recap)
  const [mode, setMode] = useState(hasVocab ? 'learning' : 'lyrics');
  const [groupIndex, setGroupIndex] = useState(0);
  const [groupStage, setGroupStage] = useState('words'); // 'words' | 'match'
  const [wordIndexInGroup, setWordIndexInGroup] = useState(0);
  const [wordPhaseIndex, setWordPhaseIndex] = useState(0);
  const [matchRoundIndex, setMatchRoundIndex] = useState(0);

  const vocabByKorean = {};
  vocabulary.forEach((w) => { vocabByKorean[w.korean] = w; });

  const currentGroup = groups[groupIndex] || [];
  const currentWord = currentGroup[wordIndexInGroup];
  const currentWordPhase = WORD_PHASES[wordPhaseIndex];

  const advanceWithinWord = () => {
    if (wordPhaseIndex + 1 < WORD_PHASES.length) {
      setWordPhaseIndex(wordPhaseIndex + 1);
    } else if (wordIndexInGroup + 1 < currentGroup.length) {
      setWordIndexInGroup(wordIndexInGroup + 1);
      setWordPhaseIndex(0);
    } else {
      setGroupStage('match');
      setMatchRoundIndex(0);
    }
  };

  const advanceMatchRound = () => {
    if (matchRoundIndex + 1 < MATCH_PAIR_TYPES.length) {
      setMatchRoundIndex(matchRoundIndex + 1);
      return;
    }
    // finished all 3 pair-types for this group
    if (mode === 'learning') {
      if (groupIndex + 1 < groups.length) {
        setGroupIndex(groupIndex + 1);
        setWordIndexInGroup(0);
        setWordPhaseIndex(0);
        setGroupStage('words');
      } else {
        setMode('review');
        setGroupIndex(0);
        setMatchRoundIndex(0);
      }
    } else {
      // review mode
      if (groupIndex + 1 < groups.length) {
        setGroupIndex(groupIndex + 1);
        setMatchRoundIndex(0);
      } else {
        setMode('lyrics');
      }
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          cursor: 'pointer', color: '#6b7280', fontSize: 13, marginBottom: 16, padding: 0,
          WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit',
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

      {mode === 'learning' && groupStage === 'words' && currentWord && (
        <>
          <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginBottom: 4 }}>
            Group {groupIndex + 1} / {groups.length} · Word {wordIndexInGroup + 1} / {currentGroup.length}
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
          {currentWordPhase === 'say-it' && <SayItStep word={currentWord} onComplete={advanceWithinWord} />}
          {currentWordPhase === 'draw-it' && <DrawItStep word={currentWord} onComplete={advanceWithinWord} />}
        </>
      )}

      {mode === 'learning' && groupStage === 'match' && (
        <>
          <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginBottom: 4 }}>
            Group {groupIndex + 1} / {groups.length} · Match {matchRoundIndex + 1} / 3
          </p>
          <MatchStep
            vocabulary={currentGroup}
            pairType={MATCH_PAIR_TYPES[matchRoundIndex]}
            onComplete={advanceMatchRound}
          />
        </>
      )}

      {mode === 'review' && (
        <>
          <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginBottom: 4 }}>
            Final Review · Group {groupIndex + 1} / {groups.length} · Match {matchRoundIndex + 1} / 3
          </p>
          <MatchStep
            vocabulary={groups[groupIndex]}
            pairType={MATCH_PAIR_TYPES[matchRoundIndex]}
            onComplete={advanceMatchRound}
          />
        </>
      )}

      {mode === 'lyrics' && (
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
