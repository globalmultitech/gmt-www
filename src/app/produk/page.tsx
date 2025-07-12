
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettings } from '@/lib/settings';
import { ArrowRight, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

async function getCategories() {
  return prisma.productCategory.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

const toSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `Kategori Produk | ${settings.companyName}`;
  const description =
    'Jelajahi kategori produk kami, mulai dari perangkat keras canggih hingga solusi perangkat lunak inovatif untuk transformasi digital.';

  return {
    title,
    description,
  };
}

export default async function ProdukPage() {
  const categories = await getCategories();

  return (
    <>
      {/* Page Header */}
      <section className="bg-dark-slate text-primary pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Kategori Produk</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan solusi yang tepat untuk kebutuhan Anda dengan menjelajahi kategori produk kami.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          {categories.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <Link key={category.id} href={`/produk/kategori/${toSlug(category.name)}`} className="group block">
                     <Card className="flex flex-col h-full overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                        <div className="relative h-56 w-full">
                           {category.imageUrl ? (
                             <Image 
                                src={category.imageUrl} 
                                alt={category.name} 
                                fill 
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105" 
                             />
                           ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                               <Package className="h-16 w-16" />
                            </div>
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                           <h3 className="absolute bottom-4 left-4 font-headline text-2xl font-bold text-primary-foreground">{category.name}</h3>
                        </div>
                        <CardContent className="pt-6 flex-grow flex flex-col">
                            <p className="text-muted-foreground text-sm flex-grow">{category.description}</p>
                            <div className="mt-4 font-semibold text-sky-blue flex items-center group-hover:text-sky-blue/80 transition-colors">
                                Lihat Produk <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                     </Card>
                   </Link>
                ))}
             </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg">Belum ada kategori produk yang tersedia saat ini.</p>
              <p>Silakan periksa kembali nanti.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
