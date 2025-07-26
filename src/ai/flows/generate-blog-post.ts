'use server';
/**
 * @fileOverview An AI agent for generating blog post content from a title.
 *
 * - generateBlogPost - A function that generates a blog post.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  blogPostTitle: z.string().describe('The title of the blog post to generate.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  blogPostContent: z.string().describe('The generated content of the blog post in simple HTML format.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `Anda adalah seorang penulis konten profesional untuk sebuah perusahaan teknologi bernama "Global Multi Technology" yang berspesialisasi dalam solusi IT perbankan dan keuangan.
Tugas Anda adalah menulis postingan blog yang menarik dan informatif berdasarkan judul yang diberikan.

**Instruksi Format Keluaran:**
- Tulis konten dalam **Bahasa Indonesia**.
- Format keluaran harus berupa **HTML sederhana**.
- Gunakan tag paragraf \`<p>\` untuk setiap paragraf.
- Anda dapat menggunakan daftar tidak berurutan dengan tag \`<ul>\` dan \`<li>\`.
- Gunakan tag \`<strong>\` untuk penekanan jika perlu.
- Jangan gunakan tag HTML kompleks lainnya seperti tabel, div, atau style inline.
- Konten harus terdiri dari 3-5 paragraf.

Judul Postingan Blog: {{{blogPostTitle}}}
`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
