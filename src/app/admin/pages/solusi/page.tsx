
import prisma from '@/lib/db';
import SolusiListPage from './client-page';

export const dynamic = 'force-dynamic';

async function getSolusiData() {
  const solutions = await prisma.solution.findMany({
    orderBy: { createdAt: 'asc' }
  });
  return { solutions };
}

export default async function SolusiSettingsPage() {
  const { solutions } = await getSolusiData();

  return <SolusiListPage solutions={solutions} />;
}
