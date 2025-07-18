
import { Card, CardContent } from '@/components/ui/card';
import { Home, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const toSlug = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function generateStaticParams() {
  const categories = await prisma.productCategory.findMany({
    where: { name: { not: '' } },
    select: { name: true },
  });
 
  return categories.map((category) => ({
    slug: toSlug(category.name),
  }));
}

async function getCategoryDataBySlug(slug: string) {
  const categories = await prisma.productCategory.findMany({ select: { id: true, name: true, description: true, imageUrl: true }});
  const category = categories.find(c => toSlug(c.name) === slug);

  if (!category) {
    return null;
  }

  const subCategories = await prisma.productSubCategory.findMany({
      where: { categoryId: category.id },
      orderBy: { name: 'asc' },
  });
  
  return { category, subCategories };
}


type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCategoryDataBySlug(params.slug);

  if (!data?.category) {
    return {
      title: 'Kategori Tidak Ditemukan',
    };
  }
  const { category } = data;

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

const Breadcrumbs = ({ categoryName }: { categoryName: string }) => (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/produk" className="hover:text-primary">Produk</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground">{categoryName}</span>
  </nav>
);


export default async function CategoryPage({ params }: Props) {
  const { slug } = params;
  const data = await getCategoryDataBySlug(slug);

  if (!data) {
    notFound();
  }
  
  const { category, subCategories } = data;

  return (
    <>
      {/* Page Header */}
      <section className="bg-secondary pt-20">
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs categoryName={category.name} />
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mt-4">{category.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              {category.description}
            </p>
        </div>
      </section>

      {/* Sub-Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-center mb-8">Pilih Sub-Kategori</h2>
          {subCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subCategories.map((subCategory) => (
                <Link key={subCategory.id} href={`/produk/sub-kategori/${toSlug(subCategory.name)}`} className="group block">
                    <Card className="h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <CardContent className="p-6 flex justify-between items-center">
                        <span className="font-semibold text-lg">{subCategory.name}</span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                      </CardContent>
                    </Card>
                </Link>
              ))}
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
