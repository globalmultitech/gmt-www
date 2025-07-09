import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Home, ChevronRight, CheckCircle, Smartphone, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { JsonValue } from '@prisma/client/runtime/library';
import { getSettings } from '@/lib/settings';

type Props = {
  params: { slug: string };
};

async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
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

  const openGraphImages = product.image ? [
    {
      url: product.image,
      width: 1200,
      height: 630,
      alt: product.title,
    },
  ] : [];

  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.description,
    openGraph: {
        title: product.metaTitle || product.title,
        description: product.metaDescription || product.description,
        images: openGraphImages,
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

  const whatsappNumber = settings.whatsappSales.replace(/[^0-9]/g, '');
  const message = `Yth. tim ${settings.companyName},\n\nSaya tertarik dengan produk "${product.title}" dan ingin meminta informasi lebih lanjut.\n\nTerima kasih.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;


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
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{product.title}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
              <Button asChild size="lg">
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Minta Penawaran via WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
         <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Deskripsi</TabsTrigger>
            <TabsTrigger value="features">Fitur</TabsTrigger>
            <TabsTrigger value="specifications">Spesifikasi</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6 px-4 bg-background rounded-b-md border border-t-0">
            <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
              <p>{product.longDescription || product.description}</p>
            </article>
          </TabsContent>
          <TabsContent value="features" className="py-6 px-4 bg-background rounded-b-md border border-t-0">
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
          </TabsContent>
          <TabsContent value="specifications" className="py-6 px-4 bg-background rounded-b-md border border-t-0">
            {specifications.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableBody>
                        {specifications.map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell className="font-semibold text-foreground w-1/3">{String(key)}</TableCell>
                                <TableCell className="text-muted-foreground">{String(value)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-muted-foreground">Tidak ada data spesifikasi untuk produk ini.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
