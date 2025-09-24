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
  try {
    // In a deployed Next.js environment, files in the `public` directory are served at the root.
    // We need to fetch them via HTTP/S. We construct a base URL.
    // Ensure NEXT_PUBLIC_BASE_URL is set in your environment variables.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

    const kategoriUrl = `${baseUrl}/kategori.json`;
    const produkUrl = `${baseUrl}/produk.json`;

    const [kategoriResponse, produkResponse] = await Promise.all([
        fetch(kategoriUrl),
        fetch(produkUrl)
    ]);

    if (!kategoriResponse.ok) {
        throw new Error(`Failed to fetch kategori.json: ${kategoriResponse.statusText}`);
    }
    if (!produkResponse.ok) {
        throw new Error(`Failed to fetch produk.json: ${produkResponse.statusText}`);
    }

    const categories = await kategoriResponse.json();
    const products = await produkResponse.json();

    const websiteData = {
      categories,
      products,
    };
    
    return JSON.stringify(websiteData, null, 2);

  } catch (error) {
    console.error('Error fetching website data from JSON files:', error);
    // Return a message indicating data is unavailable, so the AI can respond gracefully.
    return 'Website data is currently unavailable due to a data fetching error.';
  }
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
- If the answer cannot be found in the data, politely state that you do not have that information and suggest they contact the company directly through the "Hubungi Kami" page.
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
