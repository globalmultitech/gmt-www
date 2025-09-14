'use server';

import { summarizeBlogPost } from '@/ai/flows/blog-post-summarizer';
import { recommendProduct } from '@/ai/flows/product-recommender';

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

export async function getProductRecommendation(query: string) {
  if (!query) {
    return { error: 'Prompt tidak boleh kosong.' };
  }
  try {
    const result = await recommendProduct(query);
    return { recommendation: result };
  } catch (error) {
    console.error('Error getting product recommendation:', error);
    return { error: 'Gagal mendapatkan rekomendasi produk. Silakan coba lagi nanti.' };
  }
}
