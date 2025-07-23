
import Image from 'next/image';
import prisma from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Home, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { Metadata } from 'next';

async function getPartnerData() {
    const partners = await prisma.partnerLogo.findMany({
        orderBy: { createdAt: 'asc' }
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
                <div className="space-y-8">
                    {partners.map((partner) => (
                        <Card key={partner.id} className="flex flex-col md:flex-row items-center gap-8 p-6 shadow-sm">
                           <div className="relative h-32 w-48 flex-shrink-0 bg-muted rounded-md border flex items-center justify-center">
                             {partner.src ? (
                                <Image
                                    src={partner.src}
                                    alt={partner.alt}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 12rem"
                                    className="object-contain p-2"
                                />
                             ) : (
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                             )}
                           </div>
                           <div className="text-center md:text-left">
                             <h2 className="text-2xl font-bold text-primary font-headline">{partner.alt}</h2>
                             <p className="mt-2 text-muted-foreground">{partner.description}</p>
                           </div>
                        </Card>
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
