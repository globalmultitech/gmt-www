'use server';
/**
 * @fileOverview Product recommendation agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { 
  searchProductsTool,
  ProductRecommenderInputSchema,
  ProductRecommenderOutputSchema,
  type ProductRecommenderInput,
  type ProductRecommenderOutput
} from '../tools/product-search';


const productRecommenderPrompt = ai.definePrompt(
  {
    name: 'productRecommenderPrompt',
    input: { schema: ProductRecommenderInputSchema },
    output: { format: 'text' },
    tools: [searchProductsTool],
    prompt: `You are an expert product recommender for a company called Global Multi Technology.
Your task is to help users find the right product based on their needs.
Use the searchProductsTool to find relevant products from the company's database.
Analyze the user's query to extract keywords for the tool.
If you find relevant products, present them to the user in a helpful and concise way.
If you don't find any relevant products, inform the user politely and ask if they can rephrase their request.
Always reply in Bahasa Indonesia. Format your response using simple HTML paragraph tags <p>.

Please recommend products for the following query: {{{query}}}`,
  }
);


const productRecommenderFlow = ai.defineFlow(
  {
    name: 'productRecommenderFlow',
    inputSchema: ProductRecommenderInputSchema,
    outputSchema: ProductRecommenderOutputSchema,
  },
  async ({ query }) => {
    const llmResponse = await productRecommenderPrompt({ query });
    const response = llmResponse.text;
    if (!response) {
      throw new Error('Failed to get recommendation from AI model.');
    }
    return { recommendation: response };
  }
);

export async function recommendProduct(
  input: ProductRecommenderInput
): Promise<ProductRecommenderOutput> {
  return await productRecommenderFlow(input);
}
