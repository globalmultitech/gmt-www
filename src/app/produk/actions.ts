
'use server';

import prisma from '@/lib/db';

export async function getGroupedProductsForSearch() {
  return prisma.productCategory.findMany({
    select: {
      id: true,
      name: true,
      subCategories: {
        select: {
          id: true,
          name: true,
          products: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
            orderBy: {
              title: 'asc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}
