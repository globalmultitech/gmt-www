
import HomeClientPage from './home-client-page';
import prisma from '@/lib/db';
import { getSettings } from '@/lib/settings';

const parseJsonField = (field: any, fallback: any[] = []) => {
    if (typeof field === 'string') {
        try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    }
    if (Array.isArray(field)) {
        return field;
    }
    return fallback;
};

async function getHomePageData() {
  const productsRaw = await prisma.product.findMany({
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

  const products = productsRaw.map(product => {
    return {
      ...product,
      images: parseJsonField(product.images, []),
    };
  });

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
