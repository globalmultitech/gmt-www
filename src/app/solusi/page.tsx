

import { getSettings } from '@/lib/settings';
import prisma from '@/lib/db';
import SolusiPageClient from './solusi-client-page';
import type { Metadata } from 'next';

async function getPageData() {
    const settings = await getSettings();
    const solutionsRaw = await prisma.solution.findMany({
        where: { parentId: null }, // Only fetch parent solutions
        include: {
        other_Solution: { // And include their direct children
            orderBy: { createdAt: 'asc' }
        }
        },
        orderBy: { createdAt: 'asc' },
    });

    // Map other_Solution to children to match client component prop type
    const solutions = solutionsRaw.map(s => {
        const { other_Solution, ...rest } = s;
        return { ...rest, children: other_Solution || [] };
    });

    return { settings, solutions };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.solutionsPageTitle} | ${settings.companyName}`;
  const description = settings.solutionsPageSubtitle;

  return {
    title,
    description,
  };
}


export default async function SolusiPage() {
    const { settings, solutions } = await getPageData();
  
    return (
        <SolusiPageClient settings={settings} solutions={solutions} />
    );
}
