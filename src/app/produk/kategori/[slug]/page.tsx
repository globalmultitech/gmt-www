import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ChevronRight, CheckCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

async function getCategoryBySlug(slug: string) {
  const category = await prisma.productCategory.findUnique({
    where: { slug },
    include: {
      subCategories: {
        include: {
          products: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        where: {
          products: {
            some: {},
          },
        },
      },
    },
  });
  return category;
}


type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Kategori Tidak Ditemukan',
    };
  }

  return {
    title: `${category.name} | Kategori Produk`,
    description: category.description || `Jelajahi semua produk dalam kategori ${category.name}.`,
    openGraph: {
        title: category.name,
        description: category.description || `Jelajahi semua produk dalam kategori ${category.name}.`,
        images: category.imageUrl ? [category.imageUrl] : [],
    },
  };
}

const Breadcrumbs = ({ categoryName, categorySlug }: { categoryName: string, categorySlug: string }) => (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/produk" className="hover:text-primary">Produk</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground">{categoryName}</span>
  </nav>
);


export default async function CategoryProductPage({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs categoryName={category.name} categorySlug={category.slug} />
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mt-4">{category.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              {category.description}
            </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {category.subCategories.map((subCategory) => (
              <div key={subCategory.id}>
                <h3 className="text-2xl font-bold text-accent mb-6">{subCategory.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {subCategory.products.map((product) => {
                    const featuresList =
                      (product.features && Array.isArray(product.features)) ? product.features : [];
                    const mainImage = (product.images as string[])?.[0];

                    return (
                      <Link key={product.id} href={`/produk/${product.slug}`} className="group block">
                        <Card className="relative w-full h-96 overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                          {/* Background Image */}
                          <div className="absolute inset-0 z-0">
                            {mainImage ? (
                              <Image 
                                src={mainImage} 
                                alt={product.title} 
                                fill 
                                className="object-cover transition-transform duration-300 group-hover:scale-110" 
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                <ImageIcon className="h-20 w-20" />
                              </div>
                            )}
                          </div>
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

                          {/* Static Title at the Bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                            <h3 className="font-headline text-2xl font-bold text-white transition-transform duration-300 group-hover:-translate-y-4">
                              {product.title}
                            </h3>
                          </div>
                          
                          {/* Hover Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end text-white
                                      opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0
                                      transition-all duration-300 ease-in-out">
                            
                            {/* This is a spacer to push content up on hover */}
                             <h3 className="font-headline text-2xl font-bold text-white invisible">
                              {product.title}
                            </h3>

                            <p className="text-sm text-white/90 mt-2 mb-4 h-16 overflow-hidden">
                              {product.description}
                            </p>
                            
                            <ul className="space-y-1 mb-4 text-xs h-16 overflow-hidden">
                              {featuresList.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                                  <span>{String(feature)}</span>
                                </li>
                              ))}
                            </ul>
                            
                            <Button variant="secondary" className="w-full mt-auto">
                              Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
             {category.subCategories.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <p className="text-lg">Belum ada produk yang tersedia dalam kategori ini.</p>
                    <p>Silakan periksa kembali nanti.</p>
                </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
