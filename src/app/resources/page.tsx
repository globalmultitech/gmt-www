
import BlogSection from '@/components/blog-section';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettings } from '@/lib/settings';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function ResourcesPage() {
  const settings = await getSettings();
  const newsItems = await prisma.newsItem.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{settings.resourcesPageTitle}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {settings.resourcesPageSubtitle}
          </p>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">Berita & Wawasan Terbaru</h2>
          <p className="text-lg text-muted-foreground mb-12">Ikuti perkembangan, studi kasus, dan analisis mendalam dari Global Multi Technology.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <Card key={item.id} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <Link href={`/resources/${item.slug}`} className="block">
                  <div className="relative h-56 w-full">
                    <Image
                      src={item.image || 'https://placehold.co/600x400.png'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      data-ai-hint="technology news"
                    />
                  </div>
                </Link>
                <CardHeader>
                  <p className="text-sm text-sky-blue font-semibold">{item.category}</p>
                  <CardTitle className="font-headline text-xl h-16">{item.title}</CardTitle>
                   <div className="flex items-center text-xs text-muted-foreground pt-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(new Date(item.createdAt), "d MMMM yyyy", { locale: id })}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                    {item.content}
                  </p>
                </CardContent>
                <CardFooter>
                    <Link href={`/resources/${item.slug}`} className="font-semibold text-primary hover:text-sky-blue flex items-center">
                        Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
