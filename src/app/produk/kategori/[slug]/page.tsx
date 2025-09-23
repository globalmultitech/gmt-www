

import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryClientPage from './category-client-page';


export async function generateStaticParams() {
  const categories = await prisma.productCategory.findMany({
    where: { slug: { not: '' } },
    select: { slug: true },
  });
 
  return categories.map((category) => ({
    slug: category.slug,
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

async function getCategoryDataBySlug(slug: string) {
  const category = await prisma.productCategory.findUnique({
    where: { slug },
    include: {
      ProductSubCategory: { // Corrected relation name
        orderBy: { name: 'asc' },
        include: {
          Product: { // Corrected relation name
            take: 1,
            select: { images: true }
          }
        },
      },
    },
  });

  if (!category) {
    return null;
  }
  
  // Process the data to match what the client component expects
  const processedCategory = {
      ...category,
      subCategories: category.ProductSubCategory.map(sc => ({
          ...sc,
          products: sc.Product.map(p => ({
              ...p,
              images: parseJsonSafe(p.images, [])
          }))
      }))
  };

  // Remove the old relation name to avoid confusion
  // @ts-ignore
  delete processedCategory.ProductSubCategory;


  return { category: processedCategory };
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;
  const data = await getCategoryDataBySlug(slug);

  if (!data) {
    notFound();
  }
  
  const { category } = data;
  
  // @ts-ignore
  return (
    <CategoryClientPage category={category} slug={slug} />
  );
}

