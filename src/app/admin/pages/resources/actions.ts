
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import type { NewsItem } from '@prisma/client';

// Schema for a single news item from the client
const NewsItemSchema = z.object({
    id: z.number(), // Use a temporary ID from the client for existing items
    title: z.string().default(''),
    date: z.string().default(''),
    category: z.string().default(''),
    image: z.string().nullable().default(''),
    aiHint: z.string().nullable().default(''),
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
      const errorMessages = validatedFields.error.flatten().fieldErrors;
      const message = Object.entries(errorMessages)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('; ');
          
      return { message: message || "Input tidak valid. Silakan periksa kembali." };
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

    // --- News Items Synchronization ---
    const newsItemsFromClient = data.newsItems ?? [];
    const newsItemsInDb = await prisma.newsItem.findMany({ select: { id: true } });
    const dbItemIds = new Set(newsItemsInDb.map(s => s.id));
    const clientItemIds = new Set(newsItemsFromClient.map(s => s.id).filter(id => id < Date.now()));

    const operations = [];

    // 1. Delete items that are in DB but not in client form
    const idsToDelete = [...dbItemIds].filter(id => !clientItemIds.has(id));
    if (idsToDelete.length > 0) {
        operations.push(prisma.newsItem.deleteMany({ where: { id: { in: idsToDelete } } }));
    }

    for (const item of newsItemsFromClient) {
        const sanitizedData = {
            title: item.title,
            date: item.date,
            category: item.category,
            image: item.image,
            aiHint: item.aiHint
        };
        
        if (!item.title && !item.category && !item.date) {
            continue;
        }

        if (dbItemIds.has(item.id)) {
            operations.push(prisma.newsItem.update({ where: { id: item.id }, data: sanitizedData }));
        } else {
            operations.push(prisma.newsItem.create({ data: sanitizedData }));
        }
    }

    await prisma.$transaction(operations);


    revalidatePath('/', 'layout');
    revalidatePath('/resources');
    revalidatePath('/admin/pages/resources');
    return { message: 'Pengaturan Halaman Blog berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Resources Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
