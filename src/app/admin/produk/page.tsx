import prisma from '@/lib/db';
import ProductManagementClientPage from './client-page';

export const dynamic = 'force-dynamic';

export default async function ProductManagementPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <ProductManagementClientPage products={products} />;
}
