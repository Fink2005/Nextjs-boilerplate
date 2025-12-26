import { sfPro } from '@/app/fonts/sfPro';
import TanstackProviders from '@/components/providers/TanstackProvider';
import RefreshToken from '@/components/refresh-token';
import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/libs/i18nRouting';
import '@/styles/global.css';
import RootTemplate from '@/templates/RootTemplate';
import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://gasy-9x9-plus-fe.vercel.app'),

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',

  },

  openGraph: {
    title: 'Truyen AI - Nền tảng truyện tranh AI hàng đầu Việt Nam',
    description: 'Khám phá và tạo ra những câu chuyện tranh độc đáo với Truyen AI, nơi trí tuệ nhân tạo gặp gỡ sáng tạo.',
    url: '/',
    siteName: 'Truyen AI',
    images: [
      {
        url: '/truyenai.png',
        width: 1200,
        height: 630,
        alt: 'Truyen AI Logo',
      },
    ],
    type: 'website',
  },
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={sfPro.variable}>
      <body className="min-h-screen">
        <head>
          <meta name="apple-mobile-web-app-title" content="9x9plus" />
        </head>
        <NextIntlClientProvider>
          <RefreshToken />
          <NextTopLoader color="#317FCA" showSpinner={false} height={5} />
          <TanstackProviders>
            <RootTemplate>
              {props.children}
            </RootTemplate>
          </TanstackProviders>
          <Toaster position="top-center" toastOptions={{ style: { color: 'white', background: 'linear-gradient(180deg, #68DAF2 0%, #1C5BB9 95.1%)', }, }} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
