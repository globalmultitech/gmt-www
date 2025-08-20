

import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SubCategoryClientPage from './sub-category-client-page';


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

export default async function SubCategoryProductPage({ params }: Props) {
  const { slug } = params;
  const data = await getSubCategoryDataBySlug(slug);

  if (!data) {
    notFound();
  }

  const { subCategory, products } = data;

  return (
    <SubCategoryClientPage subCategory={subCategory} products={products} />
  );
}
