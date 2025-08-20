
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { DynamicIcon } from '@/components/dynamic-icon';
import type { WebSettings } from '@/lib/settings';
import Link from 'next/link';
import type { ProfessionalService } from '@prisma/client';
import { useLoadingStore } from '@/hooks/use-loading-store';

type LayananPageProps = {
    settings: WebSettings;
    services: ProfessionalService[];
}

const parseJsonSafe = (jsonString: any, fallback: any[]) => {
    if (Array.isArray(jsonString)) return jsonString;
    if (typeof jsonString !== 'string') return fallback;
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
}

export default function LayananPageClient({ settings, services }: LayananPageProps) {
  const { startLoading } = useLoadingStore();
  
  const allDetailImages = services.flatMap(service => {
    const details = parseJsonSafe(service.details, []);
    return details.map((detail: { image?: string }) => detail.image).filter(Boolean);
  });

  const commitmentImageUrl = allDetailImages.length > 0 
    ? allDetailImages[Math.floor(Math.random() * allDetailImages.length)]
    : settings.servicesPageHeaderImageUrl;

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
              <Link key={service.id} href={`/layanan/${service.slug}`} className="group block" onClick={startLoading}>
                <Card className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <DynamicIcon name={service.icon} className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-headline text-2xl group-hover:text-sky-blue transition-colors">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="text-muted-foreground">{service.description}</p>
                    <div className="mt-4 font-semibold text-primary flex items-center group-hover:text-sky-blue transition-colors">
                      Pelajari Lebih Lanjut <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
                src={commitmentImageUrl || "https://placehold.co/600x400.png"} 
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
