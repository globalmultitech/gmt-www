
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const SolutionSchema = z.object({
    icon: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
    image: z.string().default(''),
    aiHint: z.string().default(''),
    keyPoints: z.array(z.string()).default([]),
});

const SolusiPageSettingsSchema = z.object({
  solutionsPageTitle: z.string().optional(),
  solutionsPageSubtitle: z.string().optional(),
  solutions: z.array(SolutionSchema).optional(),
});


export async function updateSolusiPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const jsonString = formData.get('solusiData') as string;
    if (!jsonString) {
      return { message: 'Data formulir tidak ditemukan.' };
    }
    const dataToValidate = JSON.parse(jsonString);

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
    
    const sanitizedSolutions = data.solutions?.filter(solution => {
        return solution.title || solution.description || (solution.keyPoints && solution.keyPoints.some(p => p.trim() !== ''));
    }).map(solution => ({
        ...solution,
        keyPoints: solution.keyPoints.filter(p => p.trim() !== '')
    })) ?? [];

    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            solutionsPageTitle: data.solutionsPageTitle,
            solutionsPageSubtitle: data.solutionsPageSubtitle,
            solutions: sanitizedSolutions,
        }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/solusi');
    revalidatePath('/admin/pages/solusi');
    return { message: 'Pengaturan Halaman Solusi berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Solusi Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
