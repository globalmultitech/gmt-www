import HomeClientPage from './home-client-page';
import prisma from '@/lib/db';
import { getSettings } from '@/lib/settings';

async function getProducts() {
  return prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      subCategory: {
        include: {
          category: true,
        },
      },
    },
  });
}

export default async function Home() {
  const products = await getProducts();
  const settings = await getSettings();

  return <HomeClientPage products={products} settings={settings} />;
}
