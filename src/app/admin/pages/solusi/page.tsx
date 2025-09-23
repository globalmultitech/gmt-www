
import prisma from '@/lib/db';
import SolusiListPage from './client-page';

export const dynamic = 'force-dynamic';

async function getSolusiData() {
  const solutions = await prisma.solution.findMany({
    where: {
      parentId: null // Fetch only parent solutions
    },
    include: {
      Children: { // Include their children
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
  return { solutions };
}

export default async function SolusiSettingsPage() {
  const { solutions } = await getSolusiData();

  return <SolusiListPage solutions={solutions.map(s => ({ ...s, children: s.Children })) as any} />;
}
