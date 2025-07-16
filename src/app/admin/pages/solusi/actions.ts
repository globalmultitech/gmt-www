
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import type { Solution } from '@prisma/client';

const toSlug = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-'); 
};


// Schema for a single solution item from the client
const SolutionSchema = z.object({
    id: z.number(), // Use a temporary ID from the client for existing items
    icon: z.string().default(''),
    title: z.string().default(''),
    slug: z.string().default(''),
    description: z.string().default(''),
    image: z.string().nullable().default(''),
    aiHint: z.string().nullable().default(''),
    keyPoints: z.array(z.string()).default([]),
});

// Schema for the entire solutions form payload
const SolutionsFormSchema = z.array(SolutionSchema);

// This action updates ALL solutions based on the form state.
export async function updateSolutions(prevState: { message: string } | undefined, formData: FormData) {
    try {
        const jsonString = formData.get('solutionsData') as string;
        if (!jsonString) return { message: 'Data formulir tidak ditemukan.' };
        
        const dataToValidate = JSON.parse(jsonString);
        const validatedFields = SolutionsFormSchema.safeParse(dataToValidate);

        if (!validatedFields.success) {
            console.error('Validation Error:', JSON.stringify(validatedFields.error.flatten(), null, 2));
            return { message: "Input tidak valid. Silakan periksa kembali." };
        }

        const solutionsFromClient = validatedFields.data;

        // Get all current solution IDs from the database
        const solutionsInDb = await prisma.solution.findMany({ select: { id: true } });
        const dbSolutionIds = new Set(solutionsInDb.map(s => s.id));

        const clientSolutionIds = new Set(solutionsFromClient.map(s => s.id).filter(id => id < Date.now()));

        // --- Synchronization Logic ---
        const operations = [];

        // 1. Delete solutions that are in DB but not in client form
        const idsToDelete = [...dbSolutionIds].filter(id => !clientSolutionIds.has(id));
        if (idsToDelete.length > 0) {
            operations.push(prisma.solution.deleteMany({ where: { id: { in: idsToDelete } } }));
        }

        for (const solution of solutionsFromClient) {
             const finalSlug = solution.slug || toSlug(solution.title);

            const existingSlugItem = await prisma.solution.findFirst({ 
                where: { 
                    slug: finalSlug, 
                    id: { not: dbSolutionIds.has(solution.id) ? solution.id : 0 }
                }
            });

            if (existingSlugItem) {
                return { message: `Gagal menyimpan: URL (slug) "${finalSlug}" sudah digunakan oleh solusi lain.` };
            }

            const sanitizedData = {
                icon: solution.icon,
                title: solution.title,
                slug: finalSlug,
                description: solution.description,
                image: solution.image,
                aiHint: solution.aiHint,
                keyPoints: solution.keyPoints.filter(p => p.trim() !== '')
            };

            // Filter out completely empty items before upserting
            if (!solution.title && !solution.description && sanitizedData.keyPoints.length === 0) {
                continue;
            }

            // 2. Update existing solutions (ID is in DB)
            if (dbSolutionIds.has(solution.id)) {
                operations.push(prisma.solution.update({
                    where: { id: solution.id },
                    data: sanitizedData
                }));
            } 
            // 3. Create new solutions (ID is temporary, e.g., timestamp)
            else {
                operations.push(prisma.solution.create({ data: sanitizedData }));
            }
        }
        
        await prisma.$transaction(operations);

        revalidatePath('/', 'layout');
        revalidatePath('/solusi');
        revalidatePath('/solusi/[slug]', 'page');
        revalidatePath('/admin/pages/solusi');
        return { message: 'Daftar solusi berhasil diperbarui.' };

    } catch (error) {
        console.error('Update Solutions error:', error);
        return { message: 'Gagal memperbarui daftar solusi karena kesalahan server.' };
    }
}


const SolusiPageSettingsSchema = z.object({
  solutionsPageTitle: z.string().optional(),
  solutionsPageSubtitle: z.string().optional(),
});

// This action ONLY updates the page title and subtitle.
export async function updateSolusiPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const jsonString = formData.get('solusiData') as string;
    if (!jsonString) return { message: 'Data formulir tidak ditemukan.' };
    
    const dataToValidate = JSON.parse(jsonString);
    const validatedFields = SolusiPageSettingsSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
      console.error('Validation Error:', validatedFields.error);
      return { message: "Input tidak valid." };
    }

    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            solutionsPageTitle: validatedFields.data.solutionsPageTitle,
            solutionsPageSubtitle: validatedFields.data.solutionsPageSubtitle,
        }
    });

    revalidatePath('/solusi');
    revalidatePath('/admin/pages/solusi');
    return { message: 'Pengaturan header halaman berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Solusi Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
