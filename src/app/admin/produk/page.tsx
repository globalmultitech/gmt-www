import prisma from '@/lib/db';
import ProductManagementClientPage from './client-page';
import { getCategoriesWithSubcategories } from '../kategori/actions';

export const dynamic = 'force-dynamic';

export default async function ProductManagementPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const categories = await getCategoriesWithSubcategories();

  return <ProductManagementClientPage products={products} categories={categories} />;
}
