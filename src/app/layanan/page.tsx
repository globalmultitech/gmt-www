
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { DynamicIcon } from '@/components/dynamic-icon';
import { getSettings } from '@/lib/settings';
import prisma from '@/lib/db';

async function getPageData() {
    const settings = await getSettings();
    const services = await prisma.professionalService.findMany({
        orderBy: { createdAt: 'asc' }
    });
    return { settings, services };
}

export default async function LayananPage() {
  const { settings, services } = await getPageData();

  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{settings.servicesPageTitle}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {settings.servicesPageSubtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <DynamicIcon name={service.icon} className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                    {service.description && (
                         <p className="mt-1 text-muted-foreground">{service.description}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 pt-4 border-t">
                    {/* @ts-ignore */}
                    {(Array.isArray(service.details) ? service.details : []).map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3">
                        <Handshake className="h-5 w-5 text-sky-blue mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold">{settings.servicesPageCommitmentTitle}</h2>
            <p className="text-primary-foreground/80">
              {settings.servicesPageCommitmentText}
            </p>
            <div className="flex items-center gap-4 pt-4">
                <ShieldCheck className="h-10 w-10 text-sky-blue"/>
                <p className="font-semibold text-lg">Perlindungan Data dan Privasi Terjamin</p>
            </div>
          </div>
          <div className="relative h-64 md:h-80">
            <Image 
                src={settings.servicesPageHeaderImageUrl || "https://placehold.co/600x400.png"} 
                alt="Keamanan Siber" 
                fill 
                className="object-cover rounded-lg shadow-md" 
                data-ai-hint="cyber security"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </>
  );
}
