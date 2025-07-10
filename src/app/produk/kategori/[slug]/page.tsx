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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {subCategory.products.map((product) => {
                    const featuresList =
                      (product.features && Array.isArray(product.features)) ? product.features : [];
                    const mainImage = (product.images as string[])?.[0];

                    return (
                      <Card
                        key={product.id}
                        className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                      >
                        <Link href={`/produk/${product.slug}`} className="block">
                          <div className="relative h-56 w-full bg-muted">
                            {mainImage ? (
                              <Image src={mainImage} alt={product.title} fill className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <ImageIcon className="h-10 w-10" />
                              </div>
                            )}
                          </div>
                        </Link>
                        <CardHeader>
                          <Link href={`/produk/${product.slug}`} className="block">
                            <CardTitle className="font-headline text-2xl hover:text-primary">
                              {product.title}
                            </CardTitle>
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
