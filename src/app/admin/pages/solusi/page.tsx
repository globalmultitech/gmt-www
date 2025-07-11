
import SolusiPageClientPage from './client-page';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

async function getSolutionsData() {
  const settings = await getSettings();
  const solutions = await prisma.solution.findMany({
    orderBy: { createdAt: 'asc' }
  });
  return { settings, solutions };
}

export default async function SolusiSettingsPage() {
  const { settings, solutions } = await getSolutionsData();

  if (!settings) {
    console.error("Web settings not found! Please seed the database.");
    redirect('/admin/dashboard?error=settings_not_found');
  }

  return <SolusiPageClientPage settings={settings} initialSolutions={solutions} />;
}
