'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const SolutionSchema = z.object({
    icon: z.string().optional().default(''),
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    image: z.string().optional().default(''),
    aiHint: z.string().optional().default(''),
    keyPoints: z.array(z.string()).optional().default([]),
});

const SolusiPageSettingsSchema = z.object({
  solutionsPageTitle: z.string().optional(),
  solutionsPageSubtitle: z.string().optional(),
  solutions: z.array(SolutionSchema).optional(),
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
            
            const detailMatch = field.match(/^(keyPoints)\[(\d+)\]$/);
            if (detailMatch) {
                const arrayField = detailMatch[1];
                if (!items[index][arrayField]) {
                    items[index][arrayField] = [];
                }
                const detailIndex = parseInt(detailMatch[2], 10);
                items[index][arrayField][detailIndex] = value;
            } else {
                items[index][field] = value;
            }
        }
    }
    
    return Object.values(items).map(item => {
        if (Array.isArray(item.keyPoints)) {
            item.keyPoints = item.keyPoints.filter(point => typeof point === 'string' && point.trim() !== '');
        }
        return item;
    }).filter(item => {
        if (!item || typeof item !== 'object') return false;
        return Object.values(item).some(value => {
            if (typeof value === 'string') return value.trim() !== '';
            if (Array.isArray(value)) return value.length > 0;
            return false;
        });
    });
}


export async function updateSolusiPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const dataToValidate = {
        solutionsPageTitle: formData.get('solutionsPageTitle'),
        solutionsPageSubtitle: formData.get('solutionsPageSubtitle'),
        solutions: getAsArrayOfObjects(formData, 'solutions'),
    };

    const validatedFields = SolusiPageSettingsSchema.safeParse(dataToValidate);

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
            solutionsPageTitle: data.solutionsPageTitle,
            solutionsPageSubtitle: data.solutionsPageSubtitle,
            solutions: data.solutions,
        }
    });

    revalidatePath('/', 'layout');
    return { message: 'Pengaturan Halaman Solusi berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Solusi Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
