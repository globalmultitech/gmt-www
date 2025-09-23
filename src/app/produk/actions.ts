

'use server';

import prisma from '@/lib/db';

export async function getGroupedProductsForSearch() {
  const categories = await prisma.productCategory.findMany({
    include: {
      subCategories: {
        orderBy: { name: 'asc' },
        include: {
          Products: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
            orderBy: { title: 'asc' },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories;
}
