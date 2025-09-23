

'use server';

import prisma from '@/lib/db';

export async function getGroupedProductsForSearch() {
  // Fetch all data in separate, simple queries to avoid complex include issues.
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: 'asc' },
  });
  const subCategories = await prisma.productSubCategory.findMany({
    orderBy: { name: 'asc' },
  });
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      subCategoryId: true,
    },
    orderBy: { title: 'asc' },
  });

  // Manually assemble the nested structure.
  const subCategoriesWithProducts = subCategories.map(sub => ({
    ...sub,
    products: products.filter(p => p.subCategoryId === sub.id),
  }));

  const categoriesWithSubCategories = categories.map(cat => ({
    ...cat,
    subCategories: subCategoriesWithProducts.filter(sub => sub.categoryId === cat.id),
  }));

  return categoriesWithSubCategories;
}
