

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
  // 1. Fetch products and their related data using manual joins.
  const productsRaw = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const allSubCategories = await prisma.productSubCategory.findMany();
  const allCategories = await prisma.productCategory.findMany();

  const subCategoriesMap = new Map(allSubCategories.map(sc => [sc.id, sc]));
  const categoriesMap = new Map(allCategories.map(c => [c.id, c]));

  const products = productsRaw.map(product => {
    const subCategoryRaw = subCategoriesMap.get(product.subCategoryId);
    let subCategory = null;

    if (subCategoryRaw) {
      const category = categoriesMap.get(subCategoryRaw.categoryId);
      subCategory = {
        ...subCategoryRaw,
        category: category || null,
      };
    }

    return {
      ...product,
      images: parseJsonField(product.images, []),
      description: product.description || '',
      subCategory: subCategory,
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

  // Fetch parent solutions and children solutions in separate queries
  const parentSolutions = await prisma.solution.findMany({
    where: { parentId: null },
    orderBy: { createdAt: 'asc' },
  });
  
  const childrenSolutions = await prisma.solution.findMany({
    where: { parentId: { not: null } },
    orderBy: { createdAt: 'asc' },
  });

  // Manually join them
  const solutions = parentSolutions.map(parent => ({
    ...parent,
    children: childrenSolutions.filter(child => child.parentId === parent.id),
  }));

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
