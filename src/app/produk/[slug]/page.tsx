

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
  TableHeader,
  TableHead,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  params: { slug: string };
};

type Feature = {
    title: string;
    description: string;
}

type Specifications = {
    headers: string[];
    rows: string[][];
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

const Breadcrumbs = ({ productTitle }: { productTitle: string }) => (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/produk" className="hover:text-primary">Produk</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground">{productTitle}</span>
  </nav>
);

const SpecificationAccordion = ({ title, specs }: { title: string, specs: Specifications }) => {
  if (!specs || !specs.headers || specs.headers.length === 0 || specs.rows.length === 0) {
    return null;
  }
  return (
    <AccordionItem value={title}>
        <AccordionTrigger className="text-xl font-headline font-bold text-primary">{title}</AccordionTrigger>
        <AccordionContent>
            <div className="overflow-x-auto rounded-lg border bg-card mt-2">
                <Table>
                    <TableHeader>
                      <TableRow>
                        {specs.headers.map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {specs.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className="text-muted-foreground prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: cell }} />
                          ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        </AccordionContent>
    </AccordionItem>
  )
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = params;
  const { product, relatedProducts } = await getProductData(slug);
  const settings = await getSettings();

  if (!product) {
    notFound();
  }
    
  const featuresList = product.features as Feature[];
  const techSpecs = product.technicalSpecifications as Specifications;
  const generalSpecs = product.generalSpecifications as Specifications;

  return (
    <>
      <div className="bg-secondary pt-20">
        <div className="container mx-auto px-4">
          <div className="py-8 md:py-12">
            <Breadcrumbs productTitle={product.title} />
          </div>
          
           <div className="md:grid md:grid-cols-2 md:gap-12">
              <div className="md:sticky md:top-24 h-fit">
                <ProductImageGallery images={product.images as string[]} productTitle={product.title} />
              </div>

              <div className="flex flex-col mt-8 md:mt-0">
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
                </Accordion>
              </div>
          </div>
        </div>
      </div>
      
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold mb-8 text-primary text-center">Spesifikasi</h2>
            <Accordion type="multiple" className="w-full space-y-4">
                <SpecificationAccordion title="Spesifikasi Teknis" specs={techSpecs} />
                <SpecificationAccordion title="Spesifikasi Umum" specs={generalSpecs} />
            </Accordion>
        </div>
      </section>
      
      <RelatedProducts products={relatedProducts} />
    </>
  );
}
