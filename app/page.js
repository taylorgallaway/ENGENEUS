export default function Home() {
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
      <p
        style={{
          color: '#84A98C',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          marginTop: '0.25rem',
        }}
      >
        Learn Through Music
      </p>
      <p style={{ marginTop: '2.5rem', color: '#6b7280', fontSize: '1rem' }}>
        🎉 It&apos;s alive — the real site is on its way.
      </p>
    </main>
  );
}
