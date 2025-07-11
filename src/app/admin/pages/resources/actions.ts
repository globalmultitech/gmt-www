
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import { generateBlogPost } from '@/ai/flows/generate-blog-post';

const toSlug = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-'); // replace multiple - with single -
};

// Simplified schema for client data. ID is not validated here.
const NewsItemSchema = z.object({
    id: z.number(), 
    title: z.string().default(''),
    category: z.string().default(''),
    image: z.string().nullable().default(''),
    content: z.string().nullable().default(''),
    slug: z.string().optional(),
});

const ResourcesPageSettingsSchema = z.object({
  resourcesPageTitle: z.string().optional(),
  resourcesPageSubtitle: z.string().optional(),
  newsItems: z.array(NewsItemSchema).optional(),
});

export async function updateResourcesPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const jsonString = formData.get('resourcesData') as string;
    if (!jsonString) {
      return { message: 'Data formulir tidak ditemukan.' };
    }
    const dataToValidate = JSON.parse(jsonString);

    const validatedFields = ResourcesPageSettingsSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
      console.error('Validation Error:', JSON.stringify(validatedFields.error.flatten(), null, 2));
      return { message: "Input tidak valid. Silakan periksa kembali." };
    }
    
    const data = validatedFields.data;

    // --- Page Settings Update ---
    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            resourcesPageTitle: data.resourcesPageTitle,
            resourcesPageSubtitle: data.resourcesPageSubtitle,
        }
    });

    // --- NewsItems Synchronization ---
    const newsItemsFromClient = data.newsItems ?? [];
    const newsItemsInDb = await prisma.newsItem.findMany({ select: { id: true } });
    const dbItemIds = new Set(newsItemsInDb.map(s => s.id));
    
    // Filter out client items that are just empty shells
    const validClientItems = newsItemsFromClient.filter(item => item.title.trim());
    const validClientItemIds = new Set(validClientItems.map(s => s.id));

    const operations = [];

    // 1. Delete items that are in DB but not in the valid client form items
    const idsToDelete = [...dbItemIds].filter(id => !validClientItemIds.has(id));
    if (idsToDelete.length > 0) {
        operations.push(prisma.newsItem.deleteMany({ where: { id: { in: idsToDelete } } }));
    }

    // 2. Upsert (Update or Create) valid items
    for (const item of validClientItems) {
        
        const finalSlug = toSlug(item.title);
        
        if (!finalSlug) {
            return { message: `Gagal menyimpan: Judul "${item.title}" tidak dapat menghasilkan URL yang valid.` };
        }
        
        const sanitizedData = {
            title: item.title,
            slug: finalSlug,
            category: item.category,
            image: item.image,
            content: item.content,
        };
        
        // Check for slug uniqueness before committing
        const existingSlugItem = await prisma.newsItem.findFirst({ 
            where: { 
                slug: finalSlug, 
                id: { not: dbItemIds.has(item.id) ? item.id : -1 }
            }
        });
        
        if (existingSlugItem) {
            return { message: `Gagal menyimpan: URL slug "${finalSlug}" sudah digunakan oleh artikel lain.` };
        }

        // Use the presence of the ID in the database's list to determine if it's an update or create
        if (dbItemIds.has(item.id)) {
            // Update existing item
            operations.push(prisma.newsItem.update({ where: { id: item.id }, data: sanitizedData }));
        } else {
            // Create new item
            operations.push(prisma.newsItem.create({ data: sanitizedData }));
        }
    }

    await prisma.$transaction(operations);

    revalidatePath('/', 'layout');
    revalidatePath('/resources', 'layout');
    revalidatePath('/resources/[slug]', 'page');
    revalidatePath('/admin/pages/resources');
    return { message: 'Pengaturan Halaman Blog berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Resources Page settings error:', error);
    // @ts-ignore
    if (error.code === 'P2002') { 
        // @ts-ignore
        const field = error.meta?.target?.[0] || 'field';
        return { message: `Gagal menyimpan: Nilai untuk ${field} sudah ada.`}
    }
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}


export async function generateBlogPostContent(title: string) {
    if (!title) {
        return { error: 'Judul tidak boleh kosong.' };
    }

    try {
        const result = await generateBlogPost({ blogPostTitle: title });
        return { content: result.blogPostContent };
    } catch (error) {
        console.error('Error generating blog post content:', error);
        return { error: 'Gagal menghasilkan konten dari AI. Silakan coba lagi nanti.' };
    }
}
