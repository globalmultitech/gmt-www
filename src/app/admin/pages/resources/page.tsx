
import { getSettings } from '@/lib/settings';
import ResourcesPageClientPage from './client-page';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ResourcesSettingsPage() {
  const settings = await getSettings();
  const newsItems = await prisma.newsItem.findMany({
    orderBy: {
      id: 'desc'
    }
  });

  if (!settings) {
    console.error("Web settings not found! Please seed the database.");
    redirect('/admin/dashboard?error=settings_not_found');
  }

  return <ResourcesPageClientPage settings={settings} initialNewsItems={newsItems} />;
}
