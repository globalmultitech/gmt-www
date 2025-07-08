import BlogSection from '@/components/blog-section';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const newsItems = [
  {
    title: 'GMT Hadiri Pameran Teknologi Finansial Terbesar di Asia',
    date: '20 Juni 2024',
    category: 'Acara',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'conference technology',
  },
  {
    title: 'Kolaborasi Strategis dengan Bank Nasional untuk Digitalisasi Cabang',
    date: '10 Juni 2024',
    category: 'Kemitraan',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'business handshake',
  },
  {
    title: 'Global Multi Technology Raih Penghargaan "Best B2B Tech Solution 2024"',
    date: '1 Juni 2024',
    category: 'Penghargaan',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'award trophy',
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Resources</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Dapatkan wawasan terbaru dari industri, berita perusahaan, dan artikel mendalam dari para ahli kami.
          </p>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">Berita Terbaru</h2>
          <p className="text-lg text-muted-foreground mb-12">Ikuti perkembangan dan pencapaian terbaru dari Global Multi Technology.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <Card key={item.title} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                 <div className="relative h-56 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    data-ai-hint={item.aiHint}
                  />
                </div>
                <CardHeader>
                  <p className="text-sm text-accent font-semibold">{item.category}</p>
                  <CardTitle className="font-headline text-xl h-16">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                   <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{item.date}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Link href="#" className="font-semibold text-primary hover:text-accent flex items-center">
                        Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">Wawasan dari Blog Kami</h2>
          <p className="text-lg text-muted-foreground mb-12">Jelajahi artikel, studi kasus, dan analisis mendalam dari tim ahli kami.</p>
          <BlogSection />
        </div>
      </section>
    </>
  );
}
