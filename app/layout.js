export const metadata = {
  title: 'ENGENEUS',
  description: 'Learn Through Music',
  icons: {
    icon: '/logo-assets/icon-192.png',
    apple: '/logo-assets/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="ENGENEUS" />
        <link rel="apple-touch-icon" href="/logo-assets/apple-touch-icon.png" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
