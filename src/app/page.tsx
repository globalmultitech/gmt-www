
import HomeClientPage from './home-client-page';
import prisma from '@/lib/db';
import { getSettings } from '@/lib/settings';

async function getHomePageData() {
  const products = await prisma.product.findMany({
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

  const settings = await getSettings();

  const professionalServices = await prisma.professionalService.findMany({
    take: 4,
    orderBy: { createdAt: 'asc' },
  });

  const newsItems = await prisma.newsItem.findMany({
    take: 3,
    orderBy: { id: 'desc' },
  });

  return { products, settings, professionalServices, newsItems };
}

export default async function Home() {
  const { products, settings, professionalServices, newsItems } = await getHomePageData();
  
  return (
    <HomeClientPage 
      products={products} 
      settings={settings} 
      professionalServices={professionalServices} 
      newsItems={newsItems}
    />
  );
}
