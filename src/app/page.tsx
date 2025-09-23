

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
  // 1. Fetch products and their related data using the correct relation names.
  const products = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      subCategory: {
        include: {
          Category: true,
        },
      },
    },
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
    take: 4,
    orderBy: { id: 'desc' },
  });

  // Fetch all solutions and manually construct the hierarchy
  const solutions = await prisma.solution.findMany({
    where: { parentId: null }, // Only fetch parent solutions
    include: {
      Children: { // And include their direct children
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'asc' },
  });


  return { products, settings, professionalServices, newsItems, solutions };
}

export default async function Home() {
  const { products, settings, professionalServices, newsItems, solutions } = await getHomePageData();
  
  // Manually rename for client component compatibility if needed, but the query should be fixed first.
  const clientProducts = products.map(p => ({
      ...p,
      subCategory: p.subCategory
  }));

  return (
    <HomeClientPage 
      products={clientProducts as any} 
      settings={settings} 
      professionalServices={professionalServices} 
      newsItems={newsItems}
      solutions={solutions as any}
    />
  );
}
