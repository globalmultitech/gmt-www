
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import LayananListPage from './client-page';

export const dynamic = 'force-dynamic';

async function getLayananData() {
  const services = await prisma.professionalService.findMany({
    orderBy: { createdAt: 'asc' }
  });
  return { services };
}

export default async function LayananSettingsPage() {
  const { services } = await getLayananData();

  return <LayananListPage services={services} />;
}
