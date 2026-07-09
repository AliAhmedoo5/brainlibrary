import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-nastaliq',
  display: 'swap'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0D14'
};

export const metadata: Metadata = {
  title: 'Brain Library — Bilingual Knowledge Management',
  description: 'High-end personal knowledge management and note-taking web app with offline-first cloud synchronization and native Urdu RTL support.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon-192.svg'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Brain Library'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${nastaliq.variable} dark`}>
      <body className="min-h-screen bg-[var(--bg-primary)] antialiased transition-colors duration-200">
        <LocaleProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
