
import Image from 'next/image';
import { getSettings } from '@/lib/settings';
import prisma from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Handshake, Heart } from 'lucide-react';

export default async function TentangKamiPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{settings.aboutPageTitle}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {settings.aboutPageSubtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <Link href="/tentang-kami/partner" className="group block">
                <Card className="h-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                        <div className="inline-block p-5 bg-primary/10 text-primary rounded-full mb-6 transform transition-transform duration-300 group-hover:scale-110">
                            <Handshake className="h-12 w-12" />
                        </div>
                        <h2 className="font-headline text-3xl font-bold text-primary mb-2">Partner Kami</h2>
                        <p className="text-muted-foreground mb-6">Kami berkolaborasi dengan para pemimpin teknologi global untuk memberikan solusi terbaik.</p>
                        <div className="font-semibold text-sky-blue flex items-center justify-center gap-2 group-hover:text-sky-blue/80 transition-colors">
                            Lihat Semua Partner <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/tentang-kami/pelanggan" className="group block">
                <Card className="h-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                     <CardContent className="p-8 text-center">
                        <div className="inline-block p-5 bg-primary/10 text-primary rounded-full mb-6 transform transition-transform duration-300 group-hover:scale-110">
                            <Heart className="h-12 w-12" />
                        </div>
                        <h2 className="font-headline text-3xl font-bold text-primary mb-2">Pelanggan Kami</h2>
                        <p className="text-muted-foreground mb-6">Solusi kami telah dipercaya dan diimplementasikan di berbagai institusi terkemuka.</p>
                        <div className="font-semibold text-sky-blue flex items-center justify-center gap-2 group-hover:text-sky-blue/80 transition-colors">
                            Lihat Semua Pelanggan <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                </Card>
            </Link>

          </div>
        </div>
      </section>
    </>
  );
}
