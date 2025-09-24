'use server';
/**
 * @fileOverview An AI assistant that answers questions based on website data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs';
import path from 'path';


const AssistantInputSchema = z.object({
  question: z.string().describe("The user's question about products or services."),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the user's question."),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

// This function will read the data directly from the JSON files in the /public directory.
async function getWebsiteData(): Promise<string> {
  try {
    const kategoriPath = path.join(process.cwd(), 'public', 'kategori.json');
    const produkPath = path.join(process.cwd(), 'public', 'produk.json');

    const kategoriData = fs.readFileSync(kategoriPath, 'utf-8');
    const produkData = fs.readFileSync(produkPath, 'utf-8');

    const categories = JSON.parse(kategoriData);
    const products = JSON.parse(produkData);

    const websiteData = {
      categories,
      products,
    };
    
    return JSON.stringify(websiteData, null, 2);

  } catch (error) {
    console.error('Error reading website data from JSON files:', error);
    // Return a message indicating data is unavailable, so the AI can respond gracefully.
    return 'Website data is currently unavailable due to a file reading error.';
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
    // Fetch the website data from the JSON files
    const websiteData = await getWebsiteData();

    // Call the prompt with the user's question and the website data
    const { output } = await prompt({
      ...input,
      websiteData, // Pass the data to be used in the handlebars template
    });

    return output!;
  }
);
