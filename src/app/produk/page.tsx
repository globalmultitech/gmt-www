import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettings } from '@/lib/settings';
import { CheckCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

async function getProducts() {
    return prisma.product.findMany({
        orderBy: {
            createdAt: 'asc'
        }
    });
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `Produk Unggulan | ${settings.companyName}`;
  const description = "Jelajahi rangkaian produk perangkat keras dan lunak kami yang dirancang untuk inovasi dan efisiensi dalam transformasi digital.";

  return {
    title,
    description,
  };
}


export default async function ProdukPage() {
  const products = await getProducts();

  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Produk Kami</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Jelajahi rangkaian produk perangkat keras dan lunak kami yang dirancang untuk inovasi dan efisiensi.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              let featuresList = [];
              try {
                if (product.features) {
                  const parsedFeatures = JSON.parse(product.features);
                  if(Array.isArray(parsedFeatures)) {
                    featuresList = parsedFeatures;
                  }
                }
              } catch (e) {
                 console.error("Failed to parse features JSON for product:", product.title, e);
              }
              
              return (
              <Card key={product.id} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                 <Link href={`/produk/${product.slug}`} className="block">
                    <div className="relative h-56 w-full bg-muted">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <ImageIcon className="h-10 w-10" />
                            </div>
                        )}
                    </div>
                </Link>
                <CardHeader>
                   <Link href={`/produk/${product.slug}`} className="block">
                     <CardTitle className="font-headline text-2xl hover:text-primary">{product.title}</CardTitle>
                   </Link>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-primary mb-3">Fitur Utama:</h4>
                    <ul className="space-y-2">
                        {featuresList.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{String(feature)}</span>
                        </li>
                        ))}
                    </ul>
                  </div>
                   <Button asChild className="mt-6 w-full">
                        <Link href={`/produk/${product.slug}`}>
                            Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
              </Card>
            )})}
          </div>
        </div>
      </section>
    </>
  );
}
