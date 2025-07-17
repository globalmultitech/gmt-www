
'use client';

import type { Solution } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from './dynamic-icon';

type SolutionWithChildren = Solution & { children: Solution[] };

type HomeSolutionsTabsProps = {
  solutions: SolutionWithChildren[];
};

export function HomeSolutionsTabs({ solutions }: HomeSolutionsTabsProps) {
  if (!solutions || solutions.length === 0) {
    return null;
  }

  // Filter out parent solutions that have no children, as they won't have content to show in tabs.
  const solutionGroups = solutions.filter(s => s.children && s.children.length > 0);

  if (solutionGroups.length === 0) {
    return null; // Or some fallback UI
  }
  
  const defaultTab = solutionGroups[0]?.title || '';

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary">Solusi Kami Lainnya</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Seluruh tim kami berdedikasi untuk menghadirkan solusi yang inovatif dan tepat guna untuk menjawab setiap tantangan bisnis Anda.
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-auto max-w-4xl h-auto flex-wrap">
            {solutionGroups.map((group) => (
              <TabsTrigger key={group.id} value={group.title} className="flex-1">{group.title}</TabsTrigger>
            ))}
          </TabsList>
          
          {solutionGroups.map((group) => (
            <TabsContent key={group.id} value={group.title} className="mt-12">
              <div className="grid md:grid-cols-2 gap-8">
                {group.children.map((solution) => (
                  <Card key={solution.id} className="p-6 md:p-8 shadow-lg rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="bg-primary/10 p-3 md:p-4 rounded-lg flex-shrink-0">
                         <DynamicIcon name={solution.icon} className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{solution.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 h-20">{solution.description}</p>
                        <Link href={`/solusi/${solution.slug}`} className="font-semibold text-sky-blue flex items-center group">
                          Pelajari lebih jauh
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
