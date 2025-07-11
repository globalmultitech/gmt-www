
import HomeClientPage from './home-client-page';
import prisma from '@/lib/db';
import { getSettings } from '@/lib/settings';

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
    let imagesArray: string[] = [];
    if (typeof product.images === 'string') {
      try {
        imagesArray = JSON.parse(product.images);
      } catch (e) {
        console.warn(`Failed to parse images for product ID ${product.id}`);
      }
    } else if (Array.isArray(product.images)) {
        // @ts-ignore
        imagesArray = product.images;
    }
    return {
      ...product,
      images: imagesArray,
    };
  });

  const settings = await getSettings();

  const professionalServicesRaw = await prisma.professionalService.findMany({
    take: 4,
    orderBy: { createdAt: 'asc' },
  });

  const professionalServices = professionalServicesRaw.map(service => {
    let detailsArray: string[] = [];
    if (typeof service.details === 'string') {
      try {
        detailsArray = JSON.parse(service.details);
      } catch (e) {
        console.warn(`Failed to parse details for service ID ${service.id}`);
      }
    } else if (Array.isArray(service.details)) {
        // @ts-ignore
        detailsArray = service.details;
    }
    return {
      ...service,
      details: detailsArray,
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
