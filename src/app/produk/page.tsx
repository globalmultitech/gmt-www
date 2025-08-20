

import prisma from '@/lib/db';
import ProdukPageClient from './produk-client-page';
import type { Metadata } from 'next';

async function getCategories() {
    return prisma.productCategory.findMany({
        orderBy: { name: 'asc' },
    });
}

export const metadata: Metadata = {
    title: 'Kategori Produk | Global Multi Technology',
    description: 'Jelajahi semua kategori produk yang kami tawarkan, dari perangkat keras hingga perangkat lunak canggih.',
};

export default async function ProdukPage() {
    const categories = await getCategories();

    return (
        <ProdukPageClient categories={categories} />
    );
}
