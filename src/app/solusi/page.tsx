
import { ArrowRight, Handshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSettings } from '@/lib/settings';
import { DynamicIcon } from '@/components/dynamic-icon';
import prisma from '@/lib/db';
import type { Solution } from '@prisma/client';

type SolutionWithChildren = Solution & { children: Solution[] };

async function getPageData() {
    const settings = await getSettings();
    const solutions = await prisma.solution.findMany({
        where: { parentId: null },
        include: { children: { orderBy: { createdAt: 'asc' }}},
        orderBy: { createdAt: 'asc' }
    });
    return { settings, solutions };
}

export default async function SolusiPage() {
  const { settings, solutions } = await getPageData();

  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{settings.solutionsPageTitle}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {settings.solutionsPageSubtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {solutions.map((solution, index) => (
              <div key={solution.id} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className={`relative h-80 rounded-lg overflow-hidden shadow-lg ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                  <Link href={`/solusi/${solution.slug}`}>
                    <Image
                        src={solution.image || "https://placehold.co/600x400.png"}
                        alt={solution.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        data-ai-hint={solution.aiHint || 'technology solution'}
                    />
                   </Link>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-sky-blue">
                      <DynamicIcon name={solution.icon} className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-headline font-bold text-primary">
                       <Link href={`/solusi/${solution.slug}`} className="hover:text-sky-blue transition-colors">
                        {solution.title}
                       </Link>
                    </h2>
                  </div>
                  <div className="text-muted-foreground prose" dangerouslySetInnerHTML={{ __html: solution.description }} />
                   {solution.children.length > 0 && (
                      <ul className="space-y-2 pt-2">
                        {solution.children.map((child, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Handshake className="h-5 w-5 text-sky-blue mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{child.title}</span>
                          </li>
                        ))}
                      </ul>
                   )}
                   <div className="pt-4">
                      <Button asChild>
                        <Link href={`/solusi/${solution.slug}`}>Pelajari Lebih Lanjut <ArrowRight className="ml-2 h-4 w-4"/></Link>
                      </Button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">Punya Kebutuhan Spesifik?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Tim kami siap membantu merancang solusi kustom yang paling sesuai untuk tantangan bisnis Anda.
          </p>
          <Button asChild size="lg">
            <Link href="/hubungi-kami">Diskusikan Proyek Anda <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
