import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { StoreProvider } from '@/components/providers/store-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { BackToTop } from '@/components/layout/back-to-top';
import { Toaster } from '@/components/ui/sonner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sri Harshini Boutique — Tradition Woven with Elegance',
    template: '%s | Sri Harshini Boutique',
  },
  description:
    'Sri Harshini Boutique — a luxury South Indian boutique specialising in bridal silk sarees, maggam work blouses, designer lehengas and hand-embroidered couture. Tradition woven with elegance.',
  keywords: [
    'boutique',
    'bridal sarees',
    'Kanjeevaram silk',
    'maggam work',
    'lehenga',
    'South Indian wedding',
    'custom tailoring',
    'Hyderabad boutique',
  ],
  manifest: '/manifest.webmanifest',
  authors: [{ name: 'Sri Harshini Boutique' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'Sri Harshini Boutique — Tradition Woven with Elegance',
    description:
      'Luxury South Indian boutique specialising in bridal silk sarees, maggam work blouses and designer couture.',
    siteName: 'Sri Harshini Boutique',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sri Harshini Boutique',
    description:
      'Luxury South Indian boutique — bridal silk sarees, maggam work & designer couture.',
  },
  icons: {
    icon: '/favicon.ico',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7a1f33' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0d0a' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <StoreProvider>
                <div className="flex min-h-screen flex-col">
                  <SiteHeader />
                  <main className="flex-1">{children}</main>
                  <SiteFooter />
                </div>
                <BackToTop />
                <Toaster position="top-center" richColors />
              </StoreProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
