
import { getSettings } from '@/lib/settings';
import prisma from '@/lib/db';
import LayananPageClient from './layanan-client-page';
import type { Metadata } from 'next';

async function getPageData() {
    const settings = await getSettings();
    const services = await prisma.professionalService.findMany({
        orderBy: { createdAt: 'asc' },
    });
    return { settings, services };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.servicesPageTitle} | ${settings.companyName}`;
  const description = settings.servicesPageSubtitle;

  return {
    title,
    description,
  };
}

export default async function LayananPage() {
    const { settings, services } = await getPageData();
    return (
        <LayananPageClient settings={settings} services={services} />
    );
}
