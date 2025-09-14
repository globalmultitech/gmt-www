/**
 * @fileOverview A tool for searching products in the database.
 */
import { ai } from '@/ai/genkit';
import prisma from '@/lib/db';
import { z } from 'zod';

export const ProductRecommenderInputSchema = z.string();
export const ProductRecommenderOutputSchema = z.string();
export type ProductRecommenderInput = z.infer<typeof ProductRecommenderInputSchema>;
export type ProductRecommenderOutput = z.infer<typeof ProductRecommenderOutputSchema>;


const ProductSearchInputSchema = z.object({
  query: z
    .string()
    .describe(
      'A search query to find products. Can be a product name, category, or a description of needs.'
    ),
});

const ProductSearchResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  category: z.string(),
  subCategory: z.string(),
});

const ProductSearchOutputSchema = z.array(ProductSearchResultSchema);

export const searchProductsTool = ai.defineTool(
  {
    name: 'searchProductsTool',
    description: 'Searches for products in the company database.',
    input: { schema: ProductSearchInputSchema },
    output: { schema: ProductSearchOutputSchema },
  },
  async (input) => {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: input.query, mode: 'insensitive' } },
          { description: { contains: input.query, mode: 'insensitive' } },
          {
            subCategory: {
              name: { contains: input.query, mode: 'insensitive' },
            },
          },
          {
            subCategory: {
              category: {
                name: { contains: input.query, mode: 'insensitive' },
              },
            },
          },
        ],
      },
      take: 5,
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        subCategory: {
          select: {
            name: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      slug: p.slug,
      category: p.subCategory.category.name,
      subCategory: p.subCategory.name,
    }));
  }
);
