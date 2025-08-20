
'use client';

import type { Solution } from '@prisma/client';
import Link from 'next/link';
import { Home, ChevronRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/dynamic-icon';
import { useLoadingStore } from '@/hooks/use-loading-store';

type SolutionDetailClientPageProps = {
  solution: Solution;
};

type KeyPoint = {
    title: string;
    image?: string;
    description: string;
}

const Breadcrumbs = ({ solutionTitle }: { solutionTitle: string }) => {
  const { startLoading } = useLoadingStore();
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

export default function SolutionDetailClientPage({ solution }: SolutionDetailClientPageProps) {
  const { startLoading } = useLoadingStore();
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
                <div className="mt-4 text-lg text-muted-foreground prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: solution.description }} />
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
                              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw"/>
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
