

import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getSettings } from '@/lib/settings';
import WhatsAppButton from './whatsapp-button';
import ProductImageGallery from './image-gallery';
import RelatedProducts from './related-products';
import { Button } from '@/components/ui/button';
import { TokopediaIcon } from '@/components/icons/tokopedia-icon';
import { ShopeeIcon } from '@/components/icons/shopee-icon';

type Props = {
  params: { slug: string };
};

type Feature = {
    title: string;
    description: string;
}

type Specification = {
    key: string;
    value: string;
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

// Fungsi ini memberitahu Next.js halaman dinamis mana yang harus dibuat saat build
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });
 
  return products.map((product) => ({
    slug: product.slug,
  }));
}


async function getProductBySlug(slug: string) {
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
    return null;
  }
  
  // Parse all JSON fields here
  return {
    ...productRaw,
    images: parseJsonSafe(productRaw.images, []),
    features: parseJsonSafe(productRaw.features, []),
    specifications: parseJsonSafe(productRaw.specifications, []),
  }
}

async function getRelatedProducts(currentProductId: number, subCategoryId: number) {
    const rawProducts = await prisma.product.findMany({
        where: { 
            id: { not: currentProductId },
            subCategoryId: subCategoryId,
        },
        take: 4,
    });

    // Parse the images field for each product
    return rawProducts.map(product => ({
        ...product,
        images: parseJsonSafe(product.images, []),
    }));
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const product = await getProductBySlug(slug);

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

const Breadcrumbs = ({ productTitle }: { productTitle: string }) => (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/produk" className="hover:text-primary">Produk</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground">{productTitle}</span>
  </nav>
);

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  const settings = await getSettings();

  if (!product) {
    notFound();
  }
  
  const relatedProducts = await getRelatedProducts(product.id, product.subCategoryId);
  
  const featuresList = product.features as Feature[];
  const specificationsList = product.specifications as Specification[];

  return (
    <>
      <div className="bg-secondary pt-20">
        <div className="container mx-auto px-4">
          <div className="py-8 md:py-12">
            <Breadcrumbs productTitle={product.title} />
          </div>
          
          <div className="pb-12 md:pb-16 grid md:grid-cols-2 gap-8 md:gap-12">
            
            <ProductImageGallery images={product.images as string[]} productTitle={product.title} />

            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{product.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>
              
              <div className="flex flex-wrap items-center gap-3 my-6">
                <WhatsAppButton product={product} settings={settings} />
                {product.tokopediaUrl && (
                  <Button asChild variant="outline" size="lg" className="border-green-500 hover:bg-green-500/10 hover:text-green-600 text-green-600">
                    <Link href={product.tokopediaUrl} target="_blank" rel="noopener noreferrer">
                        <TokopediaIcon className="mr-2 h-5 w-5" />
                        Tokopedia
                    </Link>
                  </Button>
                )}
                  {product.shopeeUrl && (
                  <Button asChild variant="outline" size="lg" className="border-orange-500 hover:bg-orange-500/10 hover:text-orange-600 text-orange-600">
                    <Link href={product.shopeeUrl} target="_blank" rel="noopener noreferrer">
                        <ShopeeIcon className="mr-2 h-5 w-5" />
                        Shopee
                    </Link>
                  </Button>
                )}
              </div>

              <Accordion type="multiple" className="w-full">
                  <AccordionItem value="item-desc">
                  <AccordionTrigger className="text-xl font-headline font-bold text-primary">Deskripsi Lengkap</AccordionTrigger>
                  <AccordionContent>
                      <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none pt-4">
                        <div dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }} />
                      </article>
                  </AccordionContent>
                </AccordionItem>
                
                {featuresList.length > 0 && (
                    <AccordionItem value="item-features">
                    <AccordionTrigger className="text-xl font-headline font-bold text-primary">Fitur Utama</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-4 pt-4">
                          {featuresList.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <CheckCircle className="h-4 w-4" />
                              </div>
                              <div>
                                <p className='font-semibold'>{feature.title}</p>
                                <div className="text-muted-foreground prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: feature.description }} />
                              </div>
                          </li>
                          ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {specificationsList.length > 0 && (
                  <AccordionItem value="item-specs">
                    <AccordionTrigger className="text-xl font-headline font-bold text-primary">Spesifikasi Teknis</AccordionTrigger>
                    <AccordionContent>
                      <div className="overflow-x-auto rounded-lg border bg-card mt-2">
                          <Table>
                              <TableBody>
                              {specificationsList.map((spec) => (
                                  <TableRow key={spec.key}>
                                  <TableCell className="font-semibold text-card-foreground w-1/3">{spec.key}</TableCell>
                                  <TableCell className="text-muted-foreground">{spec.value}</TableCell>
                                  </TableRow>
                              ))}
                              </TableBody>
                          </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </>
  );
}
