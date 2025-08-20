

import { Card } from '@/components/ui/card';
import { Home, ChevronRight, CheckCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { useLoadingStore } from '@/hooks/use-loading-store';

const toSlug = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function generateStaticParams() {
  const subCategories = await prisma.productSubCategory.findMany({
    where: { name: { not: '' } },
    select: { name: true },
  });
 
  return subCategories.map((subCategory) => ({
    slug: toSlug(subCategory.name),
  }));
}

const parseJsonSafe = (json: any, fallback: any) => {
    if (typeof json === 'string') {
        try {
            return JSON.parse(json);
        } catch (e) {
            return fallback;
        }
    }
    return json ?? fallback;
}


async function getSubCategoryDataBySlug(slug: string) {
  const subCategories = await prisma.productSubCategory.findMany({ include: { category: true } });
  const subCategory = subCategories.find(sc => toSlug(sc.name) === slug);

  if (!subCategory) {
    return null;
  }

  const rawProducts = await prisma.product.findMany({
    where: {
      subCategoryId: subCategory.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  
  const products = rawProducts.map(product => ({
      ...product,
      images: parseJsonSafe(product.images, []),
      features: parseJsonSafe(product.features, []),
  }));

  return {
    subCategory,
    products,
  };
}


type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const data = await getSubCategoryDataBySlug(slug);

  if (!data?.subCategory) {
    return {
      title: 'Sub-Kategori Tidak Ditemukan',
    };
  }

  return {
    title: `${data.subCategory.name} | ${data.subCategory.category.name}`,
    description: `Jelajahi semua produk dalam sub-kategori ${data.subCategory.name}.`,
  };
}

const Breadcrumbs = ({ categoryName, categorySlug, subCategoryName }: { categoryName: string, categorySlug: string, subCategoryName: string }) => {
  const { startLoading } = useLoadingStore.getState();
  return (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" onClick={startLoading} className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/produk" onClick={startLoading} className="hover:text-primary">Produk</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href={`/produk/kategori/${categorySlug}`} onClick={startLoading} className="hover:text-primary">{categoryName}</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground">{subCategoryName}</span>
  </nav>
  )
};


export default async function SubCategoryProductPage({ params }: Props) {
  const { slug } = params;
  const data = await getSubCategoryDataBySlug(slug);
  const { startLoading } = useLoadingStore.getState();

  if (!data) {
    notFound();
  }

  const { subCategory, products } = data;

  return (
    <>
      {/* Page Header */}
      <section className="bg-secondary pt-20">
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs 
              categoryName={subCategory.category.name} 
              categorySlug={toSlug(subCategory.category.name)} 
              subCategoryName={subCategory.name} 
            />
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mt-4">{subCategory.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              Jelajahi semua produk kami dalam sub-kategori {subCategory.name}.
            </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => {
                const featuresList = (product.features as {title: string, description: string}[]) || [];
                const mainImage = (product.images as string[])?.[0];

                return (
                  <Link key={product.id} href={`/produk/${product.slug}`} className="group block" onClick={startLoading}>
                    <Card className="relative w-full h-80 overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                      {/* Background Image */}
                      <div className="absolute inset-0 z-0">
                        {mainImage ? (
                          <Image 
                            src={mainImage} 
                            alt={product.title} 
                            fill 
                            className="object-cover transition-transform duration-300 group-hover:scale-110" 
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
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
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="font-headline text-lg font-bold text-white transition-transform duration-300 group-hover:-translate-y-4 leading-tight">
                          {product.title}
                        </h3>
                      </div>
                      
                      {/* Hover Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col justify-end text-white
                                  opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0
                                  transition-all duration-300 ease-in-out">
                        
                        <h3 className="font-headline text-lg font-bold text-white invisible leading-tight">
                          {product.title}
                        </h3>

                        <p className="text-xs text-white/90 mt-2 mb-3 h-12 overflow-hidden">
                          {product.description}
                        </p>
                        
                        <ul className="space-y-1 mb-3 text-xs h-14 overflow-hidden">
                          {featuresList.slice(0, 2).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" />
                              <span className="truncate">{feature.title}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button variant="secondary" size="sm" className="w-full mt-auto h-8 text-xs">
                          Lihat Detail <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
             <div className="text-center text-muted-foreground py-16">
                <p className="text-lg">Belum ada produk yang tersedia dalam sub-kategori ini.</p>
                <p>Silakan periksa kembali nanti.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
