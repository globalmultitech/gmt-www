
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const NewsItemSchema = z.object({
    title: z.string().default(''),
    date: z.string().default(''),
    category: z.string().default(''),
    image: z.string().default(''),
    aiHint: z.string().default(''),
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

    const sanitizedNewsItems = data.newsItems?.filter(item => item.title || item.category || item.date) ?? [];

    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            resourcesPageTitle: data.resourcesPageTitle,
            resourcesPageSubtitle: data.resourcesPageSubtitle,
            newsItems: sanitizedNewsItems,
        }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/resources');
    revalidatePath('/admin/pages/resources');
    return { message: 'Pengaturan Halaman Resources berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Resources Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
