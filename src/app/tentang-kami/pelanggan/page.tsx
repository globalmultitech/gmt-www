
import Image from 'next/image';
import prisma from '@/lib/db';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import PelangganClientPage from './pelanggan-client-page';

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
            <PelangganClientPage customers={customers} />
        </div>
      </section>
    </>
  );
}
