import type { Product } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RelatedProductsProps = {
  products: Product[];
};

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-bold mb-8 text-primary">Produk Terkait Lainnya</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const mainImage = (product.images as string[])?.[0];
            return (
              <Card key={product.id} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Link href={`/produk/${product.slug}`} className="block">
                  <div className="relative h-48 w-full bg-muted">
                    {mainImage ? (
                      <Image
                        src={mainImage}
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
                <CardHeader className="flex-grow">
                  <CardTitle className="font-headline text-lg">
                    <Link href={`/produk/${product.slug}`} className="hover:text-primary">
                      {product.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline" size="sm">
                    <Link href={`/produk/${product.slug}`}>
                      Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
