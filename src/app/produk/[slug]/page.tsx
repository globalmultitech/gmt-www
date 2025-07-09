
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Home, ChevronRight, CheckCircle, Smartphone, Image as ImageIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { getSettings } from '@/lib/settings';
import WhatsAppButton from './whatsapp-button';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
    };
  }
  
  const productImageUrl = product.image ?? undefined;

  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.description,
    openGraph: {
        title: product.metaTitle || product.title,
        description: product.metaDescription || product.description,
        images: productImageUrl ? [productImageUrl] : [],
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
  
  const specifications = (product.specifications && typeof product.specifications === 'object' && !Array.isArray(product.specifications)) 
    ? Object.entries(product.specifications) 
    : [];

  const featuresList = (product.features && Array.isArray(product.features))
    ? product.features
    : [];

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Breadcrumbs productTitle={product.title} />
      </div>
      
      <div className="bg-background">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Image Section */}
            <div>
              <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg border bg-muted">
                {product.image ? (
                    <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-20 w-20" />
                    </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
               <div className="mb-4">
                 <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{product.title}</h1>
                 <p className="mt-2 text-lg text-muted-foreground">{product.description}</p>
              </div>
              
              <div className="mt-4">
                <WhatsAppButton product={product} settings={settings} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column: Long Description */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-headline font-bold mb-6 text-primary">Deskripsi Lengkap</h2>
            <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
              <p>{product.longDescription || product.description}</p>
            </article>
          </div>

          {/* Right Column: Features & Specs */}
          <div className="lg:col-span-2">
            <div className="space-y-8 lg:sticky top-24">
              {/* Features */}
              <div>
                <h3 className="text-2xl font-headline font-bold mb-4">Fitur Utama</h3>
                <ul className="space-y-4">
                  {featuresList.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-muted-foreground">{String(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <hr className="border-border" />
              
              {/* Specifications */}
              <div>
                <h3 className="text-2xl font-headline font-bold mb-4">Spesifikasi Teknis</h3>
                {specifications.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border bg-card">
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
                ) : (
                  <p className="text-muted-foreground">Tidak ada data spesifikasi untuk produk ini.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
