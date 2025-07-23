
import prisma from '@/lib/db';
import { getCategoriesWithSubcategories } from '../../kategori/actions';
import { ProductForm } from '../product-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AddProductPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categories = await getCategoriesWithSubcategories();
  const subCategoryId = searchParams?.subCategoryId;
  const defaultSubCategoryId = typeof subCategoryId === 'string' ? Number(subCategoryId) : undefined;

  return (
    <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/admin/produk">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Produk
            </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Tambah Produk Baru</h1>
        <ProductForm categories={categories} defaultSubCategoryId={defaultSubCategoryId} />
    </div>
  );
}
