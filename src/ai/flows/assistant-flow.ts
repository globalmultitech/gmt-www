'use server';
/**
 * @fileOverview An AI assistant that answers questions based on website data.
 */

import { ai } from '@/ai/genkit';
import prisma from '@/lib/db';
import { z } from 'genkit';

const AssistantInputSchema = z.object({
  question: z.string().describe("The user's question about products or services."),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the user's question."),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

// This function will read the data directly from the Prisma database.
async function getWebsiteData(): Promise<string> {
  try {
    const [
      products,
      services,
      solutions,
      newsItems,
      settings,
    ] = await prisma.$transaction([
      prisma.product.findMany({
        include: {
          ProductSubCategory: {
            include: {
              Category: true,
            },
          },
        },
      }),
      prisma.professionalService.findMany(),
      prisma.solution.findMany(),
      prisma.newsItem.findMany(),
      prisma.webSettings.findUnique({ where: { id: 1 } }),
    ]);

    const websiteData = {
      companyName: settings?.companyName,
      contact: {
        email: settings?.contactEmail,
        phone: settings?.contactPhone,
        address: settings?.address,
      },
      products: products.map(p => ({
        title: p.title,
        description: p.description,
        category: p.ProductSubCategory?.Category?.name,
        subCategory: p.ProductSubCategory?.name,
      })),
      services: services.map(s => ({
        title: s.title,
        description: s.description,
      })),
      solutions: solutions.map(s => ({
        title: s.title,
        description: s.description,
      })),
      articles: newsItems.map(n => ({
        title: n.title,
        category: n.category,
        contentSummary: n.content?.substring(0, 200),
      })),
    };
    
    return JSON.stringify(websiteData, null, 2);

  } catch (error) {
    console.error('Error reading website data from database:', error);
    // Return a message indicating data is unavailable, so the AI can respond gracefully.
    return 'Website data is currently unavailable due to a database error.';
  }
}

export async function askAssistant(input: AssistantInput): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: z.object({ question: z.string(), websiteData: z.string() }) },
  output: { schema: AssistantOutputSchema },
  prompt: `You are a professional and friendly AI assistant for "Global Multi Technology", a company specializing in IT solutions.
Your role is to answer user questions about our products and services based *exclusively* on the provided website data in JSON format.

**Instructions:**
- Answer in **Bahasa Indonesia**.
- Be concise, helpful, and friendly.
- Your knowledge is strictly limited to the data provided below. Do not use any external knowledge.
- If the answer cannot be found in the data, politely state that you do not have that information and suggest they contact the company directly through the "Hubungi Kami" page.
- When mentioning a product, service, or solution, always include its name.

**Website Data (JSON):**
\`\`\`json
{{{websiteData}}}
\`\`\`

**User's Question:**
"{{{question}}}"
`,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    // Fetch the website data from the database
    const websiteData = await getWebsiteData();

    // Call the prompt with the user's question and the website data
    const { output } = await prompt({
      ...input,
      websiteData, // Pass the data to be used in the handlebars template
    });

    return output!;
  }
);
