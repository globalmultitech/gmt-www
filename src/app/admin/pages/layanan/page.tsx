
import { getSettings } from '@/lib/settings';
import LayananPageClientPage from './client-page';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getLayananData() {
  const settings = await getSettings();
  const services = await prisma.professionalService.findMany({
    orderBy: { createdAt: 'asc' }
  });
  return { settings, services };
}

export default async function LayananSettingsPage() {
  const { settings, services } = await getLayananData();

  if (!settings) {
    console.error("Web settings not found! Please seed the database.");
    redirect('/admin/dashboard?error=settings_not_found');
  }

  return <LayananPageClientPage settings={settings} initialServices={services} />;
}
