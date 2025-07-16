
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const toSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-'); 
};


const SolutionSchema = z.object({
  icon: z.string().min(1, 'Ikon harus dipilih'),
  title: z.string().min(1, 'Judul tidak boleh kosong'),
  slug: z.string().min(1, 'Slug tidak boleh kosong').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  image: z.string().optional(),
  aiHint: z.string().optional(),
  keyPoints: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed as string[];
      }
      throw new Error();
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk Poin Kunci tidak valid' });
      return z.NEVER;
    }
  }),
  parentId: z.string().transform(val => (val === 'none' || !val) ? null : Number(val)).nullable(),
});

const UpdateSolutionSchema = SolutionSchema.extend({
    id: z.coerce.number()
});


export async function createSolution(prevState: { message: string, success?: boolean } | undefined, formData: FormData) {
  const validatedFields = SolutionSchema.safeParse({
    icon: formData.get('icon'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    image: formData.get('image'),
    aiHint: formData.get('aiHint'),
    keyPoints: formData.get('keyPoints'),
    parentId: formData.get('parentId'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = Object.values(error).flat()[0] || "Input tidak valid";
    return { message, success: false };
  }
  
  const { ...data } = validatedFields.data;

  try {
    const existingSlug = await prisma.solution.findUnique({ where: { slug: data.slug } });
    if(existingSlug) {
      return { message: 'URL (slug) sudah digunakan oleh solusi lain.', success: false }
    }

    await prisma.solution.create({ data: { ...data, keyPoints: data.keyPoints as any } });

  } catch (error) {
    console.error('Create solution error:', error);
    return { message: 'Gagal membuat solusi karena kesalahan server.', success: false };
  }
  
  revalidatePath('/admin/pages/solusi');
  revalidatePath('/solusi');
  revalidatePath(`/solusi/${data.slug}`);
  redirect('/admin/pages/solusi');
}

export async function updateSolution(prevState: { message: string, success?: boolean } | undefined, formData: FormData) {
    const validatedFields = UpdateSolutionSchema.safeParse({
        id: formData.get('id'),
        icon: formData.get('icon'),
        title: formData.get('title'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        image: formData.get('image'),
        aiHint: formData.get('aiHint'),
        keyPoints: formData.get('keyPoints'),
        parentId: formData.get('parentId'),
    });

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors;
        const message = Object.values(error).flat()[0] || "Input tidak valid";
        return { message, success: false };
    }

    const { id, ...data } = validatedFields.data;

    try {
        const existingSlug = await prisma.solution.findFirst({ where: { slug: data.slug, id: { not: id } } });
        if(existingSlug) {
             return { message: 'URL (slug) sudah digunakan oleh solusi lain.', success: false }
        }
        
        await prisma.solution.update({
            where: { id },
            data: { ...data, keyPoints: data.keyPoints as any },
        });

    } catch (error) {
        console.error('Update solution error:', error);
        return { message: 'Gagal memperbarui solusi.', success: false };
    }

    revalidatePath('/admin/pages/solusi');
    revalidatePath('/solusi');
    revalidatePath(`/solusi/${data.slug}`);
    revalidatePath('/');
    redirect('/admin/pages/solusi');
}


export async function deleteSolution(solutionId: number) {
  try {
    const solution = await prisma.solution.findUnique({ where: { id: solutionId }});
    if (solution) {
        await prisma.solution.delete({ where: { id: solutionId } });
        revalidatePath('/admin/pages/solusi');
        revalidatePath('/solusi');
        revalidatePath(`/solusi/${solution.slug}`);
        revalidatePath('/');
        return { message: 'Solusi berhasil dihapus.' };
    }
    return { message: 'Solusi tidak ditemukan.' };
  } catch (error) {
    console.error('Delete solution error:', error);
    return { message: 'Gagal menghapus solusi.' };
  }
}
