import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MultiTranslate – Translate Text Into Multiple Languages',
  description:
    'Translate words, sentences and text into multiple languages instantly with MultiTranslate. High-speed multi-lingual parallel engine with audio speech and learning mode.',
  applicationName: 'MultiTranslate',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MultiTranslate',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  keywords: [
    'translator',
    'multi-language translator',
    'malayalam translator',
    'hindi translator',
    'spanish translation',
    'pwa translator',
    'simultaneous translation',
  ],
  authors: [{ name: 'MultiTranslate' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased suppressHydrationWarning">
      <body className="min-h-full flex flex-col selection:bg-blue-500/20 selection:text-blue-600">
        {children}
      </body>
    </html>
  );
}
