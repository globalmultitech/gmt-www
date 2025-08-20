
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Home, ChevronRight, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoadingStore } from '@/hooks/use-loading-store';
import type { ProductCategory, ProductSubCategory, Product } from '@prisma/client';

type EnrichedSubCategory = ProductSubCategory & {
  products: { images: any }[]
}

type EnrichedCategory = ProductCategory & {
  subCategories: EnrichedSubCategory[];
}

type CategoryClientPageProps = {
  category: EnrichedCategory;
  slug: string;
}

const Breadcrumbs = ({ categoryName, categorySlug, subCategoryName }: { categoryName: string, categorySlug: string, subCategoryName?: string }) => {
    const { startLoading } = useLoadingStore();
    const toSubCategorySlug = (name: string) => {
      if (!name) return '';
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };

    return (
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" onClick={startLoading} className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/produk" onClick={startLoading} className="hover:text-primary">Produk</Link>
        <ChevronRight className="h-4 w-4" />
        {subCategoryName ? (
            <>
                <Link href={`/produk/kategori/${categorySlug}`} onClick={startLoading} className="hover:text-primary">{categoryName}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-semibold text-foreground">{subCategoryName}</span>
            </>
        ) : (
            <span className="font-semibold text-foreground">{categoryName}</span>
        )}
      </nav>
    );
};


export default function CategoryClientPage({ category, slug }: CategoryClientPageProps) {
  const { startLoading } = useLoadingStore();

  const toSubCategorySlug = (name: string) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };
  
  return (
    <>
      {/* Page Header */}
      <section className="bg-secondary pt-20">
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs categoryName={category.name} categorySlug={slug} />
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mt-4">{category.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground text-justify">
              {category.description}
            </p>
        </div>
      </section>

      {/* Sub-Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-center mb-8">Pilih Sub-Kategori</h2>
          {category.subCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.subCategories.map((subCategory) => {
                const firstProductImage = subCategory.products[0]?.images?.[0];
                
                return (
                 <Link key={subCategory.id} href={`/produk/sub-kategori/${toSubCategorySlug(subCategory.name)}`} className="group block" onClick={startLoading}>
                     <Card className="flex flex-col h-full overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                        <div className="relative h-56 w-full">
                           {firstProductImage ? (
                             <Image 
                                src={firstProductImage} 
                                alt={subCategory.name} 
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
                           <h3 className="absolute bottom-4 left-4 font-headline text-2xl font-bold text-primary-foreground">{subCategory.name}</h3>
                        </div>
                        <CardContent className="pt-6 flex-grow flex flex-col">
                            <p className="text-muted-foreground text-sm line-clamp-3">Jelajahi semua produk dalam sub-kategori {subCategory.name}.</p>
                            <div className="mt-auto pt-4 font-semibold text-sky-blue flex items-center group-hover:text-sky-blue/80 transition-colors">
                                Lihat Sub-Kategori <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                     </Card>
                   </Link>
                )
              })}
            </div>
          ) : (
             <div className="text-center text-muted-foreground py-16">
                <p className="text-lg">Belum ada sub-kategori yang tersedia.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
