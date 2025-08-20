

import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import SolutionDetailClientPage from './solution-detail-client-page';

type Props = {
  params: { slug: string };
};

const parseJsonSafe = (jsonString: any, fallback: any[]) => {
    if (Array.isArray(jsonString)) return jsonString;
    if (typeof jsonString !== 'string') return fallback;
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

export async function generateStaticParams() {
  const solutions = await prisma.solution.findMany({
    where: { slug: { not: '' } }, // Filter out empty or null slugs
    select: { slug: true },
  });
 
  return solutions
    .filter(solution => solution.slug)
    .map((solution) => ({
      slug: solution.slug,
    }));
}

async function getSolutionBySlug(slug: string) {
  const solutionRaw = await prisma.solution.findUnique({
    where: { slug },
  });

  if (!solutionRaw) {
    return null;
  }
  
  return {
    ...solutionRaw,
    keyPoints: parseJsonSafe(solutionRaw.keyPoints, []),
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const solution = await getSolutionBySlug(params.slug);
  const settings = await getSettings();

  if (!solution) {
    return {
      title: 'Solusi Tidak Ditemukan',
    };
  }
  
  return {
    title: `${solution.title} | ${settings.companyName}`,
    description: solution.description || `Pelajari lebih lanjut tentang solusi ${solution.title} kami.`,
    openGraph: {
        title: solution.title,
        description: solution.description || '',
        images: solution.image ? [solution.image] : [],
    },
  };
}


export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = params;
  const solution = await getSolutionBySlug(slug);
  
  if (!solution) {
    notFound();
  }
  
  return (
      <SolutionDetailClientPage solution={solution} />
  );
}
