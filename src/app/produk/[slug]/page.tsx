

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

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });
 
  return products.map((product) => ({
    slug: product.slug,
  }));
}

async function getProductData(slug: string) {
  try {
    const productRaw = await prisma.product.findUnique({
      where: { slug },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!productRaw) {
      return { product: null, relatedProducts: [] };
    }

    const product = {
      ...productRaw,
      images: parseJsonSafe(productRaw.images, []),
      features: parseJsonSafe(productRaw.features, []),
      technicalSpecifications: parseJsonSafe(productRaw.technicalSpecifications, { headers: [], rows: [] }),
      generalSpecifications: parseJsonSafe(productRaw.generalSpecifications, { headers: [], rows: [] }),
    };

    const relatedProductsRaw = await prisma.product.findMany({
      where: { 
          id: { not: product.id },
          subCategoryId: product.subCategoryId,
      },
      take: 4,
    });

    const relatedProducts = relatedProductsRaw.map(p => ({
        ...p,
        images: parseJsonSafe(p.images, []),
    }));

    return { product, relatedProducts };
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return { product: null, relatedProducts: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await getProductData(params.slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
    };
  }
  
  const mainImageUrl = (product.images as string[])?.[0];

  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.description,
    openGraph: {
        title: product.metaTitle || product.title,
        description: product.metaDescription || product.description,
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

  return (
    <ProductDetailClientPage
        product={product}
        relatedProducts={relatedProducts}
        settings={settings}
    />
  );
}
