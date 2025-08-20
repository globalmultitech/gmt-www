

import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/app-shell';
import PageTransitionLoader from '@/components/page-transition-loader';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Global Multi Technology',
  description: 'Solusi dan layanan teknologi terdepan untuk transformasi digital perusahaan Anda.',
};

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
