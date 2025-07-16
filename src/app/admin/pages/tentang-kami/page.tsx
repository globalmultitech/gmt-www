
import TentangKamiPageClientPage from './client-page';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getSettings } from '@/lib/settings';


export const dynamic = 'force-dynamic';

async function getTentangKamiData() {
  const settings = await getSettings(); // Still need this for page titles
  const partners = await prisma.partnerLogo.findMany({
    orderBy: { id: 'asc' }
  });
  const customers = await prisma.customerLogo.findMany({
    orderBy: { id: 'asc' }
  });
  return { settings, partners, customers };
}

export default async function TentangKamiSettingsPage() {
  const { settings, partners, customers } = await getTentangKamiData();

  if (!settings) {
    console.error("Web settings not found! Please seed the database.");
    redirect('/admin/dashboard?error=settings_not_found');
  }

  return <TentangKamiPageClientPage settings={settings} initialPartners={partners} initialCustomers={customers} />;
}
