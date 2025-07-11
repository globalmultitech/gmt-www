'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const NewsItemSchema = z.object({
    title: z.string().optional().default(''),
    date: z.string().optional().default(''),
    category: z.string().optional().default(''),
    image: z.string().optional().default(''),
    aiHint: z.string().optional().default(''),
});

const ResourcesPageSettingsSchema = z.object({
  resourcesPageTitle: z.string().optional(),
  resourcesPageSubtitle: z.string().optional(),
  newsItems: z.array(NewsItemSchema).optional(),
});


function getAsArrayOfObjects(formData: FormData, key: string) {
    const items: { [key: number]: any } = {};
    const regex = new RegExp(`^${key}\\[(\\d+)\\]\\[(.*?)\\]$`);

    for (const [path, value] of formData.entries()) {
        const match = path.match(regex);
        if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            if (!items[index]) {
                items[index] = {};
            }
            items[index][field] = value;
        }
    }
    
    return Object.values(items).filter(item => {
        if (!item || typeof item !== 'object') return false;
        return Object.values(item).some(value => {
            if (typeof value === 'string') return value.trim() !== '';
            return false;
        });
    });
}


export async function updateResourcesPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const dataToValidate = {
        resourcesPageTitle: formData.get('resourcesPageTitle'),
        resourcesPageSubtitle: formData.get('resourcesPageSubtitle'),
        newsItems: getAsArrayOfObjects(formData, 'newsItems'),
    };

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

    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            resourcesPageTitle: data.resourcesPageTitle,
            resourcesPageSubtitle: data.resourcesPageSubtitle,
            newsItems: data.newsItems,
        }
    });

    revalidatePath('/', 'layout');
    return { message: 'Pengaturan Halaman Resources berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Resources Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
