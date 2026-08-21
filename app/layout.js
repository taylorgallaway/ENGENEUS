export const metadata = {
  title: 'ENGENEUS',
  description: 'Learn Through Music',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
