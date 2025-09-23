
import HomeClientPage from './home-client-page';
import prisma from '@/lib/db';
import { getSettings } from '@/lib/settings';

const parseJsonField = (field: any, fallback: any = []) => {
    if (typeof field === 'string') {
        try {
            const parsed = JSON.parse(field);
            return parsed;
        } catch (e) {
            return fallback;
        }
    }
    if (typeof field === 'object' && field !== null) {
        return field;
    }
    return fallback;
};


async function getHomePageData() {
  const productsRaw = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      subCategory: {
        include: {
          category: true,
        },
      },
    },
  });

  const products = productsRaw.map(product => ({
    ...product,
    images: parseJsonField(product.images, []),
    description: product.description || '',
  }));


  const settings = await getSettings();

  const professionalServicesRaw = await prisma.professionalService.findMany({
    take: 4,
    orderBy: { createdAt: 'asc' },
  });
  
  const professionalServices = professionalServicesRaw.map(service => {
    return {
        ...service,
        details: parseJsonField(service.details)
    };
  });


  const newsItems = await prisma.newsItem.findMany({
    take: 4,
    orderBy: { id: 'desc' },
  });

  const solutions = await prisma.solution.findMany({
    where: { parentId: null }, // Only fetch parent solutions
    include: {
      children: { // And include their direct children
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'asc' },
  });

  return { products, settings, professionalServices, newsItems, solutions };
}

export default async function Home() {
  const { products, settings, professionalServices, newsItems, solutions } = await getHomePageData();
  
  return (
    <HomeClientPage 
      products={products as any} 
      settings={settings} 
      professionalServices={professionalServices} 
      newsItems={newsItems}
      solutions={solutions}
    />
  );
}
