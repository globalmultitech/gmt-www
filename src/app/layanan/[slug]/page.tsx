
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CheckCircle, Award } from 'lucide-react';
import Image from 'next/image';
import { getSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/dynamic-icon';

type Props = {
  params: { slug: string };
};

const parseJsonField = (field: any, fallback: any[] = []) => {
    if (typeof field === 'string') {
        try {
            return JSON.parse(field);
        } catch (e) {
            return fallback;
        }
    }
    if (typeof field === 'object' && field !== null) {
        return field;
    }
    return fallback;
};

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
    details: parseJsonField(serviceRaw.details),
    benefits: parseJsonField(serviceRaw.benefits),
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
  
  const benefitsList = service.benefits as string[];
  const detailsList = service.details as string[];

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
        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
                <h2 className="text-3xl font-headline font-bold text-primary mb-4">Deskripsi Lengkap Layanan</h2>
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: service.longDescription || '' }} />
                </article>
            </div>
            <div className="lg:col-span-4">
                <div className="p-6 rounded-lg bg-dark-slate sticky top-24">
                    <h3 className="text-2xl font-headline font-bold text-primary mb-4">Manfaat Utama</h3>
                     <ul className="space-y-3">
                        {benefitsList.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Award className="h-5 w-5 text-sky-blue mt-1 flex-shrink-0" />
                                <span className="text-muted-foreground">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Button asChild className="w-full mt-6">
                        <Link href="/hubungi-kami">Diskusikan Kebutuhan Anda</Link>
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
