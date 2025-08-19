
import prisma from '@/lib/db';
import { getCategoriesWithSubcategories } from '../../../kategori/actions';
import { ProductForm } from '../../product-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getProduct(id: number) {
    const product = await prisma.product.findUnique({
        where: { id },
    });
    if (!product) {
        notFound();
    }
    return product;
}

export default async function EditProductPage({ params }: { params: { id: string }}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }
  
  const [product, categories] = await Promise.all([
      getProduct(id),
      getCategoriesWithSubcategories()
  ]);

  return (
     <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/admin/produk">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Produk
            </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Edit Produk</h1>
        <ProductForm categories={categories} product={product}/>
    </div>
  );
}
