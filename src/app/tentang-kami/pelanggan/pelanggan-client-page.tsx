
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { CustomerLogo } from '@prisma/client';

type PelangganClientPageProps = {
  customers: CustomerLogo[];
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

  if (customers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        <p className="text-lg">Daftar pelanggan akan segera diperbarui.</p>
      </div>
    );
  }

  return (
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
  );
}
