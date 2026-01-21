
import prisma from '@/lib/db';
import ProdukPageClient from './produk-client-page';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';

async function getCategories() {
    return prisma.productCategory.findMany({
        orderBy: { name: 'asc' },
    });
}

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const title = `Kategori Produk | ${settings.companyName}`;
    const description = 'Jelajahi semua kategori produk yang kami tawarkan, dari perangkat keras hingga perangkat lunak canggih.';
  
    return {
      title,
      description,
      openGraph: {
          title,
          description,
      }
    };
}

export default async function ProdukPage() {
    const categories = await getCategories();

    return (
        <ProdukPageClient categories={categories as any} />
    );
}
