
import prisma from '@/lib/db';
import ProductManagementClientPage from './client-page';

export const dynamic = 'force-dynamic';

async function getGroupedProducts() {
  const categoriesWithProducts = await prisma.productCategory.findMany({
    include: {
      subCategories: {
        orderBy: { name: 'asc' },
        include: {
          products: {
            orderBy: { id: 'desc' },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });
  return categoriesWithProducts;
}

export default async function ProductManagementPage() {
  const groupedProducts = await getGroupedProducts();

  return <ProductManagementClientPage groupedProducts={groupedProducts} />;
}
