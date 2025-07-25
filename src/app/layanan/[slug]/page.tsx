

import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { getSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/dynamic-icon';
import { Card, CardContent } from '@/components/ui/card';
import BenefitsSection from './benefits-section';

type Props = {
  params: { slug: string };
};

type DetailPoint = {
    title: string;
    image?: string;
    description: string;
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

export async function generateStaticParams() {
  const services = await prisma.professionalService.findMany({
    where: { slug: { not: '' } },
    select: { slug: true },
  });
 
  return services
    .filter(service => service.slug)
    .map((service) => ({
    slug: service.slug,
  }));
}

async function getServiceBySlug(slug: string) {
  const serviceRaw = await prisma.professionalService.findUnique({
    where: { slug },
  });

  if (!serviceRaw) {
    return null;
  }
  
  return {
    ...serviceRaw,
    details: parseJsonSafe(serviceRaw.details, []),
    benefits: parseJsonSafe(serviceRaw.benefits, []),
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  const settings = await getSettings();

  if (!service) {
    return {
      title: 'Layanan Tidak Ditemukan',
    };
  }
  
  return {
    title: `${service.title} | ${settings.companyName}`,
    description: service.description || `Pelajari lebih lanjut tentang layanan ${service.title} kami.`,
    openGraph: {
        title: service.title,
        description: service.description || '',
        images: service.imageUrl ? [service.imageUrl] : [],
    },
  };
}

const Breadcrumbs = ({ serviceTitle }: { serviceTitle: string }) => (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/layanan" className="hover:text-primary">Layanan</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground">{serviceTitle}</span>
  </nav>
);

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }
  
  const detailsList = service.details as DetailPoint[];
  const benefitsList = service.benefits as DetailPoint[];

  return (
    <>
      <div className="bg-secondary pt-20">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <Breadcrumbs serviceTitle={service.title} />
          </div>
          <div className="pb-12 md:pb-16 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-full w-min">
                    <DynamicIcon name={service.icon} className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{service.title}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{service.description}</p>
            </div>
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg border bg-muted">
                {service.imageUrl ? (
                    <Image
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <DynamicIcon name={service.icon} className="h-20 w-20 text-muted-foreground" />
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-headline font-bold text-primary mb-6 text-center">Deskripsi Lengkap Layanan</h2>
              <article className="prose prose-lg dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: service.longDescription || '' }} />
              </article>
            </div>
            
            {detailsList && detailsList.length > 0 && (
                <div>
                    <h2 className="text-3xl font-headline font-bold text-primary mb-8 text-center">Detail Layanan Kami</h2>
                    <div className="space-y-24">
                        {detailsList.map((item, index) => (
                          <div key={index} className="relative mb-16 last:mb-0">
                                {item.image && (
                                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted shadow-lg">
                                        <Image 
                                        src={item.image} 
                                        alt={item.title} 
                                        fill 
                                        sizes="(max-width: 768px) 100vw, 896px"
                                        className="object-cover" 
                                        />
                                    </div>
                                )}
                                <div className="relative px-4 sm:px-8 md:px-12 -mt-16">
                                  <Card className="bg-card shadow-xl p-6 md:p-8 rounded-lg">
                                    <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-4">
                                        {item.title}
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.description }} />
                                  </Card>
                                </div>
                           </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <BenefitsSection benefits={benefitsList} />

      <div className="text-center py-16 md:py-24 bg-background">
          <Button asChild size="lg">
              <Link href="/hubungi-kami">Diskusikan Kebutuhan Anda</Link>
          </Button>
      </div>
    </>
  );
}
