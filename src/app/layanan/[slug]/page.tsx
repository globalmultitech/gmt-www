

import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import ServiceDetailClientPage from './service-detail-client-page';

type Props = {
  params: { slug: string };
};

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

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }
  
  return (
    <ServiceDetailClientPage service={service} />
  );
}
