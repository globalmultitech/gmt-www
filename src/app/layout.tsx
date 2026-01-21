
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/app-shell';
import PageTransitionLoader from '@/components/page-transition-loader';
import { Suspense } from 'react';
import { getSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const defaultTitle = settings.companyName || 'Global Multi Technology';
  const defaultDescription = settings.footerText || 'Solusi dan layanan teknologi terdepan untuk transformasi digital perusahaan Anda.';
  const defaultImage = settings.heroImageUrl || settings.logoUrl;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${defaultTitle}`,
    },
    description: defaultDescription,
    openGraph: {
      title: {
        default: defaultTitle,
        template: `%s | ${defaultTitle}`,
      },
      description: defaultDescription,
      siteName: defaultTitle,
      url: 'https://www.globalmultitechnology.id',
      images: defaultImage ? [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: defaultTitle,
        }
      ] : [],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      images: defaultImage ? [defaultImage] : [],
    },
    metadataBase: new URL('https://www.globalmultitechnology.id'),
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased bg-background')}>
          <AppShell header={<Header />} footer={<Footer />}>
            {children}
          </AppShell>
          <Suspense fallback={null}>
            <PageTransitionLoader />
          </Suspense>
          <Toaster />
      </body>
    </html>
  );
}
