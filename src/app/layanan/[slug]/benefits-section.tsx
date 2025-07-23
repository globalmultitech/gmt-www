'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

type Benefit = {
  title: string;
  image?: string;
  description: string;
};

type BenefitsSectionProps = {
  benefits: Benefit[];
};

export default function BenefitsSection({ benefits }: BenefitsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!benefits || benefits.length === 0) {
    return null;
  }

  const activeBenefit = benefits[activeIndex];

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-12 text-center">
          Manfaat & Keuntungan
        </h2>
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column: Benefit Titles */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="flex flex-col gap-2">
              {benefits.map((benefit, index) => (
                <Button
                  key={index}
                  variant={activeIndex === index ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start text-left h-auto py-3 px-4',
                    activeIndex !== index && 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                  onClick={() => setActiveIndex(index)}
                >
                  <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="flex-grow">{benefit.title}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Right Column: Active Benefit Content */}
          <div className="md:col-span-8 lg:col-span-9">
            {activeBenefit && (
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted mb-6">
                  {activeBenefit.image ? (
                    <Image
                      src={activeBenefit.image}
                      alt={activeBenefit.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  ) : (
                     <div className="flex items-center justify-center h-full w-full">
                        <CheckCircle className="w-16 h-16 text-muted-foreground" />
                     </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4">{activeBenefit.title}</h3>
                <div
                  className="prose dark:prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: activeBenefit.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
