
'use client';

import type { Solution } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from './dynamic-icon';

type HomeSolutionsTabsProps = {
  solutions: Solution[];
};

export function HomeSolutionsTabs({ solutions }: HomeSolutionsTabsProps) {
  if (!solutions || solutions.length === 0) {
    return null;
  }

  // In a real scenario, you'd group solutions by a category.
  // For now, we'll put them all under one tab.
  const solutionGroups = {
    'Sadaya Solusi': solutions,
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary">Solusi Kami Lainnya</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Seluruh tim kami berdedikasi untuk menghadirkan solusi yang inovatif dan tepat guna untuk menjawab setiap tantangan bisnis Anda.
          </p>
        </div>

        <Tabs defaultValue={Object.keys(solutionGroups)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-auto max-w-4xl">
            {Object.keys(solutionGroups).map((groupName) => (
              <TabsTrigger key={groupName} value={groupName}>{groupName}</TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(solutionGroups).map(([groupName, groupSolutions]) => (
            <TabsContent key={groupName} value={groupName} className="mt-12">
              <div className="grid md:grid-cols-2 gap-8">
                {groupSolutions.map((solution) => (
                  <Card key={solution.id} className="p-8 shadow-lg rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                    <div className="flex items-start gap-6">
                      <div className="bg-primary/10 p-4 rounded-lg flex-shrink-0">
                         <DynamicIcon name={solution.icon} className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-primary mb-2">{solution.title}</h3>
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
