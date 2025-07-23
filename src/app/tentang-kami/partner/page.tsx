
import Image from 'next/image';
import prisma from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Home, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { Metadata } from 'next';

async function getPartnerData() {
    const partners = await prisma.partnerLogo.findMany({
        orderBy: { id: 'asc' }
    });
    return { partners };
}

export const metadata: Metadata = {
  title: 'Partner Kami | Global Multi Technology',
  description: 'Kami berkolaborasi dengan para pemimpin teknologi global untuk memberikan solusi terbaik bagi pelanggan kami.',
};

const Breadcrumbs = () => (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/tentang-kami" className="hover:text-primary">Tentang Kami</Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-semibold text-foreground">Partner Kami</span>
    </nav>
  );

export default async function PartnerPage() {
  const { partners } = await getPartnerData();

  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-12">
           <Breadcrumbs />
           <div className="mt-4">
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Partner Kami</h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
                    Kami berkolaborasi dengan para pemimpin teknologi global untuk memberikan solusi terbaik bagi pelanggan kami.
                </p>
           </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            {partners.length > 0 ? (
                <div className="space-y-16">
                    {partners.map((partner, index) => (
                        <div key={partner.id} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                           <div className={`relative h-80 rounded-lg overflow-hidden shadow-lg bg-muted ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                             {partner.src ? (
                                <Image
                                    src={partner.src}
                                    alt={partner.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain p-8"
                                />
                             ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-16 w-16" />
                                </div>
                             )}
                           </div>
                           <div className="text-center md:text-left">
                             <h2 className="text-3xl font-bold text-primary font-headline">{partner.alt}</h2>
                             <p className="mt-4 text-lg text-muted-foreground">{partner.description}</p>
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-16">
                    <p className="text-lg">Daftar partner akan segera diperbarui.</p>
                </div>
            )}
        </div>
      </section>
    </>
  );
}
