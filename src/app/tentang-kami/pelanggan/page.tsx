
import Image from 'next/image';
import prisma from '@/lib/db';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

async function getCustomerData() {
    const customers = await prisma.customerLogo.findMany({
        orderBy: { id: 'asc' }
    });
    return { customers };
}

export const metadata: Metadata = {
  title: 'Pelanggan Kami | Global Multi Technology',
  description: 'Solusi kami telah dipercaya dan diimplementasikan di berbagai institusi terkemuka di Indonesia.',
};


const Breadcrumbs = () => (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/tentang-kami" className="hover:text-primary">Tentang Kami</Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-semibold text-foreground">Pelanggan Kami</span>
    </nav>
  );

export default async function PelangganPage() {
  const { customers } = await getCustomerData();

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
            {customers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 items-center">
                    {customers.map((logo) => (
                        <div key={logo.id} title={logo.alt} className="relative h-24 transition-transform duration-300 hover:scale-110 grayscale hover:grayscale-0 opacity-70 hover:opacity-100">
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
            ) : (
                 <div className="text-center text-muted-foreground py-16">
                    <p className="text-lg">Daftar pelanggan akan segera diperbarui.</p>
                </div>
            )}
        </div>
      </section>
    </>
  );
}
