
import { getSettings } from '@/lib/settings';
import prisma from '@/lib/db';
import ResourcesPageClient from './resources-client-page';


export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const settings = await getSettings();
  const newsItems = await prisma.newsItem.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <ResourcesPageClient settings={settings} newsItems={newsItems} />
  );
}
