

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
    select: {
      id: true,
      title: true,
      slug: true,
      images: true,
      description: true,
      ProductSubCategory: {
        select: {
          name: true,
          ProductCategory: {
            select: {
              name: true
            }
          }
        }
      }
    }
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
    take: 4,
    orderBy: { id: 'desc' },
  });

  const solutionsRaw = await prisma.solution.findMany({
    where: { parentId: null }, // Only fetch parent solutions
    include: {
      other_Solution: { // And include their direct children
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'asc' },
  });

  const solutions = solutionsRaw.map(s => ({
    ...s,
    children: s.other_Solution,
  }));


  return { products, settings, professionalServices, newsItems, solutions };
}

export default async function Home() {
  const { products, settings, professionalServices, newsItems, solutions } = await getHomePageData();
  
  return (
    <HomeClientPage 
      products={products} 
      settings={settings} 
      professionalServices={professionalServices} 
      newsItems={newsItems}
      solutions={solutions}
    />
  );
}
