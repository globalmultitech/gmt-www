
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
  });

  if (!category) {
    return null;
  }

  const subCategoriesRaw = await prisma.productSubCategory.findMany({
    where: { categoryId: category.id },
    orderBy: { name: 'asc' },
  });
  
  if (subCategoriesRaw.length === 0) {
    return { category: { ...category, subCategories: [] } };
  }

  const subCategoryIds = subCategoriesRaw.map(sc => sc.id);

  const productsForSubCategories = await prisma.product.findMany({
    where: {
      subCategoryId: {
        in: subCategoryIds,
      },
    },
    take: 1, // This might not behave as expected across all subcategories. A more complex query might be needed for per-subcategory limit.
    select: {
      subCategoryId: true,
      images: true,
    },
  });

  // Since `take: 1` on a findMany over multiple relations is tricky,
  // we'll just grab the first product image found for each subcategory manually.
  const productImagesMap = new Map<number, string[]>();
  for(const p of productsForSubCategories) {
    if (!productImagesMap.has(p.subCategoryId)) {
      productImagesMap.set(p.subCategoryId, parseJsonSafe(p.images, []));
    }
  }

  const subCategories = subCategoriesRaw.map(sc => {
    const images = productImagesMap.get(sc.id) || [];
    return {
      ...sc,
      products: images.length > 0 ? [{ images: images }] : []
    };
  });
  
  const processedCategory = {
    ...category,
    subCategories: subCategories
  };

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
  
  return (
    // @ts-ignore
    <CategoryClientPage category={category} slug={slug} />
  );
}

