'use server';

import { summarizeBlogPost } from '@/ai/flows/blog-post-summarizer';

export async function getBlogPostSummary(blogPostContent: string) {
  if (!blogPostContent) {
    return { error: 'Konten tidak boleh kosong.' };
  }
  
  try {
    // Adding a delay to simulate network latency for loading state demonstration
    // await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = await summarizeBlogPost({ blogPostContent });
    return { summary: result.summary };
  } catch (error) {
    console.error('Error summarizing blog post:', error);
    return { error: 'Gagal meringkas blog post. Silakan coba lagi nanti.' };
  }
}
