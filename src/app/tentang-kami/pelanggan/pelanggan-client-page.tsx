
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { CustomerLogo } from '@prisma/client';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { useLoadingStore } from '@/hooks/use-loading-store';

type PelangganClientPageProps = {
  customers: CustomerLogo[];
};

const Breadcrumbs = () => {
    const { startLoading } = useLoadingStore();
    return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link href="/" onClick={startLoading} className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/tentang-kami" onClick={startLoading} className="hover:text-primary">Tentang Kami</Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-semibold text-foreground">Pelanggan Kami</span>
    </nav>
    )
};


export default function PelangganClientPage({ customers }: PelangganClientPageProps) {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  useEffect(() => {
    if (customers.length === 0) return;

    const interval = setInterval(() => {
      const numToActivate = Math.min(5, customers.length);
      const newActiveIndices = new Set<number>();
      
      while (newActiveIndices.size < numToActivate) {
        const randomIndex = Math.floor(Math.random() * customers.length);
        newActiveIndices.add(randomIndex);
      }
      
      setActiveIndices(Array.from(newActiveIndices));
    }, 2000); // Change logos every 2 seconds

    return () => clearInterval(interval);
  }, [customers]);

  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-12">
           <Breadcrumbs />
           <div className="mt-4">
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Dipercaya oleh</h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
                    Solusi kami telah dipercaya dan diimplementasikan di berbagai institusi terkemuka di Indonesia.
                </p>
           </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
             {customers.length === 0 ? (
                <div className="text-center text-muted-foreground py-16">
                    <p className="text-lg">Daftar pelanggan akan segera diperbarui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 items-center">
                {customers.map((logo, index) => (
                    <div
                    key={logo.id}
                    title={logo.alt}
                    className={cn(
                        'relative h-24 transition-all duration-500 ease-in-out',
                        activeIndices.includes(index)
                        ? 'scale-110 grayscale-0 opacity-100'
                        : 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                    )}
                    >
                    <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-contain"
                    />
                    </div>
                ))}
                </div>
            )}
        </div>
      </section>
    </>
  );
}
