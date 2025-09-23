

import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import ProductDetailClientPage from './product-detail-client-page';

type Props = {
  params: { slug: string };
};

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

async function getProductData(slug: string) {
  try {
    // Step 1: Fetch the product without any includes.
    const productRaw = await prisma.product.findUnique({
      where: { slug },
    });

    if (!productRaw) {
      return { product: null, relatedProducts: [] };
    }

    // Step 2: Fetch the subCategory and its related category in separate, simple steps.
    const subCategoryRaw = await prisma.productSubCategory.findUnique({
      where: { id: productRaw.subCategoryId },
    });

    let subCategoryWithCategory = null;
    if (subCategoryRaw) {
      const categoryRaw = await prisma.productCategory.findUnique({
        where: { id: subCategoryRaw.categoryId },
      });
      subCategoryWithCategory = {
        ...subCategoryRaw,
        category: categoryRaw || null,
      };
    }
    
    // Manually assemble the product object.
    const product = {
        ...productRaw,
        subCategory: subCategoryWithCategory,
    };

    // Step 3: Fetch related products.
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        subCategoryId: product.subCategoryId,
      },
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        images: true,
      },
    });

    return { product, relatedProducts };
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return { product: null, relatedProducts: [] };
  }
}


export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { slug: { not: '' } },
    select: { slug: true },
  });
 
  return products.map((product) => ({
    slug: product.slug,
  }));
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await getProductData(params.slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
    };
  }
  
  const mainImageUrl = (parseJsonSafe(product.images, []) as string[])?.[0];

  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.description || undefined,
    openGraph: {
        title: product.metaTitle || product.title,
        description: product.metaDescription || product.description || undefined,
        images: mainImageUrl ? [mainImageUrl] : [],
    },
  };
}


export default async function ProductDetailPage({ params }: Props) {
  const { slug } = params;
  const { product, relatedProducts } = await getProductData(slug);
  const settings = await getSettings();

  if (!product) {
    notFound();
  }

  // Ensure JSON fields are parsed for the client component
  const processedProduct = {
    ...product,
    images: parseJsonSafe(product.images, []),
    features: parseJsonSafe(product.features, []),
    technicalSpecifications: parseJsonSafe(product.technicalSpecifications, { headers: [], rows: [] }),
    generalSpecifications: parseJsonSafe(product.generalSpecifications, { headers: [], rows: [] }),
  };

  const processedRelatedProducts = relatedProducts.map(p => ({
    ...p,
    images: parseJsonSafe(p.images, []),
  }));


  return (
    <ProductDetailClientPage
        product={processedProduct as any}
        relatedProducts={processedRelatedProducts}
        settings={settings}
    />
  );
}


