

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
      ProductSubCategory: {
        include: {
          ProductCategory: true,
        },
      },
    },
  });

  const products = productsRaw.map(product => {
    const { ProductSubCategory, ...rest } = product;
    return {
      ...rest,
      images: parseJsonField(product.images, []),
      description: product.description || '',
      subCategory: ProductSubCategory ? {
        name: ProductSubCategory.name,
        category: ProductSubCategory.ProductCategory
      } : null,
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
      other_Solution: { // Correct relation name for children
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'asc' },
  });

  const solutions = solutionsRaw.map(s => {
    const { other_Solution, ...rest } = s;
    return { ...rest, children: other_Solution }; // Map to 'children' for the client component
  })

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
