'use server';
/**
 * @fileOverview An AI assistant that answers questions based on website data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  sender: z.enum(['user', 'ai']),
  content: z.string(),
});

const AssistantInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the user's question."),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

// This function will fetch the data from the JSON files served in the /public directory.
async function getWebsiteData(): Promise<string> {
  const baseUrl = 'https://www.globalmultitechnology.id';
  const dataEndpoints = {
    categories: `${baseUrl}/kategori.json`,
    products: `${baseUrl}/produk.json`,
  };

  const results = await Promise.allSettled(
    Object.entries(dataEndpoints).map(async ([key, url]) => {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return { key, data };
      } catch (error) {
        console.warn(`Could not fetch data for '${key}' from ${url}. Continuing without it.`, error);
        return { key, data: null, error: (error as Error).message };
      }
    })
  );

  const websiteData: { [key: string]: any } = {};
  let hasData = false;

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.data) {
      websiteData[result.value.key] = result.value.data;
      hasData = true;
    }
  }

  if (!hasData) {
     console.error('All data fetching failed. Assistant will have no context.');
     return 'Website data is currently unavailable due to a data fetching error on all sources.';
  }

  return JSON.stringify(websiteData, null, 2);
}


export async function askAssistant(input: AssistantInput): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: z.object({ history: z.array(MessageSchema), websiteData: z.string() }) },
  output: { schema: AssistantOutputSchema },
  prompt: `You are a professional and friendly AI assistant for "Global Multi Technology", a company specializing in IT solutions.
Your role is to answer user questions about our products and services based *exclusively* on the provided website data in JSON format.

**Instructions:**
- Answer in **Bahasa Indonesia**.
- Be concise, helpful, and friendly.
- If the user asks for specifications or data that is structured, present it in a **Markdown table**.
- Your knowledge is strictly limited to the data provided below. Do not use any external knowledge.
- If the answer cannot be found in the data, or if the data is unavailable, politely state that you do not have that information and suggest they contact the company directly through the "Hubungi Kami" page. For example, if the user asks a question and the website data is unavailable, say: "Maaf, saat ini saya tidak memiliki informasi mengenai produk yang tersedia karena ada masalah dalam mengambil data. Silakan hubungi kami melalui halaman 'Hubungi Kami' untuk informasi".
- When mentioning a product, service, or solution, always include its name.

**Website Data (JSON):**
\`\`\`json
{{{websiteData}}}
\`\`\`

**Conversation History:**
{{#each history}}
  **{{sender}}**: {{{content}}}
{{/each}}
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
      history: input.history,
      websiteData, // Pass the data to be used in the handlebars template
    });

    return output!;
  }
);
