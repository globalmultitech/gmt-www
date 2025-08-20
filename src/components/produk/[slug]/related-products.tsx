
'use client';

import type { Product } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLoadingStore } from '@/hooks/use-loading-store';

type RelatedProductsProps = {
  products: Product[];
};

function RelatedProductsSkeleton() {
    return (
        <section className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-headline font-bold mb-8 text-primary">Produk Unggulan Lainnya</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="flex flex-col h-full overflow-hidden">
                           <Skeleton className="h-48 w-full" />
                           <CardHeader className="flex-grow">
                             <Skeleton className="h-6 w-3/4" />
                           </CardHeader>
                           <CardContent>
                               <Skeleton className="h-10 w-full" />
                           </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [isClient, setIsClient] = useState(false);
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const { startLoading } = useLoadingStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (products.length === 0) {
    return null;
  }
  
  if (!isClient) {
    return <RelatedProductsSkeleton />;
  }

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-bold mb-8 text-primary">Produk Unggulan Lainnya</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            slidesToScroll: 1,
          }}
          plugins={[autoplayPlugin.current]}
          onMouseEnter={autoplayPlugin.current.stop}
          onMouseLeave={autoplayPlugin.current.reset}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => {
              const mainImage = (product.images as string[])?.[0];
              return (
                <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col h-full overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <Link href={`/produk/${product.slug}`} onClick={startLoading} className="block">
                        <div className="relative h-48 w-full bg-muted">
                          {mainImage ? (
                            <Image
                              src={mainImage}
                              alt={product.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                          <Link href={`/produk/${product.slug}`} onClick={startLoading} className="hover:text-primary">
                            {product.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full" variant="default" size="sm">
                          <Link href={`/produk/${product.slug}`} onClick={startLoading}>
                            Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
}
