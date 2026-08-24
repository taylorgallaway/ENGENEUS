export const metadata = {
  title: 'ENGENEUS',
  description: 'Learn Through Music',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
