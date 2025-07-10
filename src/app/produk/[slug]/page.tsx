
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

async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      subCategory: {
        include: {
          category: true,
        },
      },
    },
  });
  return product;
}

async function getRelatedProducts(productId: number, subCategoryId: number | null) {
  if (!subCategoryId) return [];

  return prisma.product.findMany({
    where: {
      subCategoryId: subCategoryId,
      id: {
        not: productId,
      },
    },
    take: 4, // Limit to 4 related products
  });
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
    };
  }
  
  const mainImageUrl = (product.images as string[])?.[0] ?? undefined;

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
  const product = await getProductBySlug(params.slug);
  const settings = await getSettings();

  if (!product) {
    notFound();
  }
  
  const relatedProducts = await getRelatedProducts(product.id, product.subCategoryId);

  const specifications = (product.specifications && typeof product.specifications === 'object' && !Array.isArray(product.specifications)) 
    ? Object.entries(product.specifications) 
    : [];

  const featuresList = (product.features && Array.isArray(product.features))
    ? product.features
    : [];

  return (
    <>
      <div className="bg-background">
        <div className="container mx-auto px-4">
          <div className="py-8 md:py-12">
            <Breadcrumbs productTitle={product.title} />
          </div>
          
          <div className="pb-12 md:pb-16">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Image Section */}
              <ProductImageGallery images={product.images as string[]} productTitle={product.title} />

              {/* Details Section */}
              <div className="flex flex-col">
                <div className="mb-2">
                  <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{product.title}</h1>
                  <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>
                </div>
                
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

                 {specifications.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-specs">
                      <AccordionTrigger className="text-xl font-headline font-bold text-primary">Spesifikasi Teknis</AccordionTrigger>
                      <AccordionContent>
                        <div className="overflow-x-auto rounded-lg border bg-card mt-2">
                            <Table>
                                <TableBody>
                                {specifications.map(([key, value]) => (
                                    <TableRow key={key}>
                                    <TableCell className="font-semibold text-card-foreground w-1/3">{String(key)}</TableCell>
                                    <TableCell className="text-muted-foreground">{String(value)}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

              </div>
            </div>

            {/* Accordion for More Details */}
            <div className="mt-16">
              <Accordion type="multiple" defaultValue={['item-1']} className="w-full max-w-4xl mx-auto">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-2xl font-headline font-bold text-primary">Deskripsi Lengkap</AccordionTrigger>
                  <AccordionContent>
                     <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none pt-4">
                        <p>{product.longDescription || product.description}</p>
                     </article>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-2xl font-headline font-bold text-primary">Fitur Utama</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4 pt-4">
                        {featuresList.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle className="h-4 w-4" />
                            </div>
                            <span className="text-muted-foreground">{String(feature)}</span>
                        </li>
                        ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </>
  );
}
