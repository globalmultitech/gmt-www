
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


const ServiceSchema = z.object({
  icon: z.string().min(1, 'Ikon harus dipilih'),
  title: z.string().min(1, 'Judul tidak boleh kosong'),
  slug: z.string().min(1, 'Slug tidak boleh kosong').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'),
  description: z.string().min(1, 'Deskripsi singkat tidak boleh kosong'),
  longDescription: z.string().optional(),
  imageUrl: z.string().optional(),
  details: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed as string[];
      }
      throw new Error();
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk Poin Detail tidak valid' });
      return z.NEVER;
    }
  }),
  benefits: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed as string[];
      }
      throw new Error();
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk Manfaat tidak valid' });
      return z.NEVER;
    }
  }),
});

const UpdateServiceSchema = ServiceSchema.extend({
    id: z.coerce.number()
});


export async function createProfessionalService(prevState: { message: string, success?: boolean } | undefined, formData: FormData) {
  const validatedFields = ServiceSchema.safeParse({
    icon: formData.get('icon'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    longDescription: formData.get('longDescription'),
    imageUrl: formData.get('imageUrl'),
    details: formData.get('details'),
    benefits: formData.get('benefits'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = Object.values(error).flat()[0] || "Input tidak valid";
    return { message, success: false };
  }
  
  const { ...data } = validatedFields.data;

  try {
    const existingSlug = await prisma.professionalService.findUnique({ where: { slug: data.slug } });
    if(existingSlug) {
      return { message: 'URL (slug) sudah digunakan oleh layanan lain.', success: false }
    }

    await prisma.professionalService.create({ data });

  } catch (error) {
    console.error('Create service error:', error);
    return { message: 'Gagal membuat layanan karena kesalahan server.', success: false };
  }
  
  revalidatePath('/admin/pages/layanan');
  revalidatePath('/layanan');
  revalidatePath(`/layanan/${data.slug}`);
  redirect('/admin/pages/layanan');
}

export async function updateProfessionalService(prevState: { message: string, success?: boolean } | undefined, formData: FormData) {
    const validatedFields = UpdateServiceSchema.safeParse({
        id: formData.get('id'),
        icon: formData.get('icon'),
        title: formData.get('title'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        longDescription: formData.get('longDescription'),
        imageUrl: formData.get('imageUrl'),
        details: formData.get('details'),
        benefits: formData.get('benefits'),
    });

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors;
        const message = Object.values(error).flat()[0] || "Input tidak valid";
        return { message, success: false };
    }

    const { id, ...data } = validatedFields.data;

    try {
        const existingSlug = await prisma.professionalService.findFirst({ where: { slug: data.slug, id: { not: id } } });
        if(existingSlug) {
             return { message: 'URL (slug) sudah digunakan oleh layanan lain.', success: false }
        }
        
        await prisma.professionalService.update({
            where: { id },
            data,
        });

    } catch (error) {
        console.error('Update service error:', error);
        return { message: 'Gagal memperbarui layanan.', success: false };
    }

    revalidatePath('/admin/pages/layanan');
    revalidatePath('/layanan');
    revalidatePath(`/layanan/${data.slug}`);
    redirect('/admin/pages/layanan');
}


export async function deleteProfessionalService(serviceId: number) {
  try {
    const service = await prisma.professionalService.findUnique({ where: { id: serviceId }});
    if (service) {
        await prisma.professionalService.delete({ where: { id: serviceId } });
        revalidatePath('/admin/pages/layanan');
        revalidatePath('/layanan');
        revalidatePath(`/layanan/${service.slug}`);
        return { message: 'Layanan berhasil dihapus.' };
    }
    return { message: 'Layanan tidak ditemukan.' };
  } catch (error) {
    console.error('Delete service error:', error);
    return { message: 'Gagal menghapus layanan.' };
  }
}
