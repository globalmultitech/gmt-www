
'use client';

import type { NewsItem } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState, useEffect } from 'react';

type BlogSectionProps = {
  newsItems: NewsItem[];
};

const FormattedDate = ({ dateString }: { dateString: string }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(format(new Date(dateString), 'MMMM d, yyyy', { locale: id }));
  }, [dateString]);

  return <>{formattedDate || ' '}</>;
};

export default function BlogSection({ newsItems }: BlogSectionProps) {
  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-dark-slate">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary">
            Knowledge Center
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get fresh, valuable insights to make smarter business decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newsItems.map((item) => (
            <Link key={item.id} href={`/resources/${item.slug}`} className="group block">
              <Card className="h-full overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={item.image || 'https://placehold.co/400x300.png'}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    data-ai-hint="technology business"
                  />
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    <FormattedDate dateString={item.createdAt.toISOString()} />
                  </p>
                  <h3 className="font-bold text-lg leading-tight mb-4 h-16 overflow-hidden">
                    {item.title}
                  </h3>
                  <div className="font-semibold text-primary flex items-center gap-2 group-hover:text-sky-blue transition-colors">
                    Read more <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
