
import Image from 'next/image';
import { getSettings } from '@/lib/settings';
import prisma from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';

async function getPageData() {
    const settings = await getSettings();
    const partners = await prisma.partnerLogo.findMany({
        orderBy: { id: 'asc' }
    });
    const customers = await prisma.customerLogo.findMany({
        orderBy: { id: 'asc' }
    });
    return { settings, partners, customers };
}

export default async function TentangKamiPage() {
  const { settings, partners, customers } = await getPageData();

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

      {/* Partners Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Partner Kami</h2>
            <p className="mt-2 text-lg text-muted-foreground">Kami berkolaborasi dengan pemimpin teknologi global.</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((logo) => (
                <div key={logo.id} className="relative h-20 w-48 transition-transform duration-300 hover:scale-110">
                    <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        sizes="(max-width: 640px) 192px, 192px"
                        className="object-contain"
                    />
                </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Customers Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Dipercaya oleh</h2>
                <p className="mt-2 text-lg text-muted-foreground">Solusi kami telah diimplementasikan di berbagai institusi terkemuka.</p>
            </div>
             <div className="flex flex-wrap justify-center items-center gap-8">
                {customers.map((logo, index) => (
                    <div key={logo.id} className="relative h-20 w-48 transition-transform duration-300 hover:scale-110">
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            fill
                            sizes="(max-width: 640px) 192px, 192px"
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  );
}
