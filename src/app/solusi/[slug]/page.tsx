

import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { getSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/dynamic-icon';
import { useLoadingStore } from '@/hooks/use-loading-store';

type Props = {
  params: { slug: string };
};

type KeyPoint = {
    title: string;
    image?: string;
    description: string;
}

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

const Breadcrumbs = ({ solutionTitle }: { solutionTitle: string }) => {
  const { startLoading } = useLoadingStore.getState();
  return (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" onClick={startLoading} className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/solusi" onClick={startLoading} className="hover:text-primary">Solusi</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground">{solutionTitle}</span>
  </nav>
  )
};

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = params;
  const solution = await getSolutionBySlug(slug);
  const { startLoading } = useLoadingStore.getState();

  if (!solution) {
    notFound();
  }
  
  const keyPoints = solution.keyPoints as KeyPoint[];

  return (
    <>
      <div className="bg-secondary pt-20">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <Breadcrumbs solutionTitle={solution.title} />
          </div>
          <div className="pb-12 md:pb-16 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-full w-min">
                    <DynamicIcon name={solution.icon} className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{solution.title}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{solution.description}</p>
            </div>
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg border bg-muted">
                {solution.image ? (
                    <Image
                        src={solution.image}
                        alt={solution.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <DynamicIcon name={solution.icon} className="h-20 w-20 text-muted-foreground" />
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-headline font-bold text-primary mb-8 text-center">Poin-Poin Kunci Solusi</h2>
             <div className="space-y-8">
                {keyPoints.map((item, index) => (
                  <div key={index} className="grid md:grid-cols-5 gap-6 items-center bg-dark-slate/50 p-6 rounded-lg">
                      {item.image && (
                          <div className="relative h-48 md:h-full rounded-lg overflow-hidden md:col-span-2">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                      )}
                      <div className={`space-y-3 ${item.image ? 'md:col-span-3' : 'md:col-span-5'}`}>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-sky-blue flex-shrink-0" />
                            <h3 className="text-2xl font-bold font-headline">{item.title}</h3>
                          </div>
                          <div className="prose dark:prose-invert max-w-none pl-9" dangerouslySetInnerHTML={{ __html: item.description }} />
                      </div>
                  </div>
                ))}
            </div>
            <div className="mt-12 text-center">
                <Button asChild className="w-full md:w-auto" size="lg">
                    <Link href="/hubungi-kami" onClick={startLoading}>Diskusikan Kebutuhan Anda</Link>
                </Button>
            </div>
        </div>
      </div>
    </>
  );
}
