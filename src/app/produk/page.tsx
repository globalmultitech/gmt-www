import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettings } from '@/lib/settings';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

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
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-56 w-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h4 className="font-semibold text-primary mb-3">Fitur Utama:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
