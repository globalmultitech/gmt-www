
import { getSettings } from '@/lib/settings';
import prisma from '@/lib/db';
import ResourcesPageClient from './resources-client-page';
import type { Metadata } from 'next';


export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.resourcesPageTitle} | ${settings.companyName}`;
  const description = settings.resourcesPageSubtitle;

  return {
    title,
    description,
  };
}

export default async function ResourcesPage() {
  const settings = await getSettings();
  const newsItems = await prisma.newsItem.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <ResourcesPageClient settings={settings} newsItems={newsItems} />
  );
}
