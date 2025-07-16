
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CheckCircle, Award } from 'lucide-react';
import Image from 'next/image';
import { getSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/dynamic-icon';

type Props = {
  params: { slug: string };
};

const parseJsonField = (field: any, fallback: any[] = []) => {
    if (typeof field === 'string') {
        try {
            return JSON.parse(field);
        } catch (e) {
            return fallback;
        }
    }
    if (Array.isArray(field)) {
        return field;
    }
    return fallback;
};

export async function generateStaticParams() {
  const solutions = await prisma.solution.findMany({
    where: { slug: { not: null } },
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
    keyPoints: parseJsonField(solutionRaw.keyPoints),
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

const Breadcrumbs = ({ solutionTitle }: { solutionTitle: string }) => (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/solusi" className="hover:text-primary">Solusi</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground">{solutionTitle}</span>
  </nav>
);

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = params;
  const solution = await getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }
  
  const keyPoints = solution.keyPoints as string[];

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
            <h2 className="text-3xl font-headline font-bold text-primary mb-6">Poin-Poin Kunci Solusi</h2>
             <ul className="space-y-4">
                {keyPoints.map((item, index) => (
                    <li key={index} className="flex items-start gap-4 p-4 rounded-lg bg-dark-slate">
                        <CheckCircle className="h-6 w-6 text-sky-blue mt-1 flex-shrink-0" />
                        <span className="text-lg text-muted-foreground">{item}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-12 text-center">
                <Button asChild className="w-full md:w-auto" size="lg">
                    <Link href="/hubungi-kami">Diskusikan Kebutuhan Anda</Link>
                </Button>
            </div>
        </div>
      </div>
    </>
  );
}
