'use client';

import { useRef, useState, useEffect } from 'react';

export default function DrawItStep({ vocabulary, onComplete }) {
  const [index, setIndex] = useState(0);
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  const word = vocabulary[index];

  useEffect(() => {
    clearCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '90px sans-serif';
    ctx.fillStyle = '#e5e7eb';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word.korean, canvas.width / 2, canvas.height / 2);
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    drawingRef.current = true;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1B4332';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    drawingRef.current = false;
  };

  const handleNext = () => {
    if (index + 1 >= vocabulary.length) {
      onComplete();
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
        Draw It · {index + 1} / {vocabulary.length}
      </p>

      <p style={{ fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 12 }}>
        Trace over <strong style={{ color: '#1B4332' }}>{word.korean}</strong> ({word.english})
      </p>

      <canvas
        ref={canvasRef}
        width={320}
        height={220}
        style={{ width: '100%', maxWidth: 320, height: 220, border: '1px solid #e5e7eb', borderRadius: 12, touchAction: 'none', display: 'block', margin: '0 auto' }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button
          onClick={clearCanvas}
          style={{
            flex: 1, padding: 12, background: 'white', color: '#2D6A4F', border: '1px solid #2D6A4F',
            borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit',
          }}
        >
          Clear
        </button>
        <button
          onClick={handleNext}
          style={{
            flex: 1, padding: 12, background: '#2D6A4F', color: 'white', border: 'none',
            borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            WebkitAppearance: 'none', appearance: 'none', fontFamily: 'inherit',
          }}
        >
          {index + 1 >= vocabulary.length ? 'Finish lesson →' : 'Next word →'}
        </button>
      </div>
    </div>
  );
}
