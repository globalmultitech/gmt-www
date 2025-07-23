

'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const FeatureSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
});

const SpecificationSchema = z.object({
  headers: z.array(z.string()).default([]),
  rows: z.array(z.array(z.string())).default([]),
});


const ProductSchema = z.object({
  title: z.string().min(1, 'Judul tidak boleh kosong'),
  slug: z.string().min(1, 'Slug tidak boleh kosong').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'),
  subCategoryId: z.coerce.number().min(1, 'Sub Kategori harus dipilih'),
  description: z.string().min(1, 'Deskripsi singkat tidak boleh kosong'),
  longDescription: z.string().optional(),
  images: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed as string[];
      }
      throw new Error();
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk gambar tidak valid' });
      return z.NEVER;
    }
  }),
  features: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      const result = z.array(FeatureSchema).safeParse(parsed);
      if (result.success) {
        return result.data;
      }
      throw new Error();
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk fitur tidak valid' });
      return z.NEVER;
    }
  }),
  technicalSpecifications: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      const result = SpecificationSchema.safeParse(parsed);
       if (result.success) {
        return result.data;
      }
      throw new Error();
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk spesifikasi teknis tidak valid' });
      return z.NEVER;
    }
  }),
  generalSpecifications: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      const result = SpecificationSchema.safeParse(parsed);
       if (result.success) {
        return result.data;
      }
      throw new Error();
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk spesifikasi umum tidak valid' });
      return z.NEVER;
    }
  }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tokopediaUrl: z.string().optional(),
  shopeeUrl: z.string().optional(),
});

const UpdateProductSchema = ProductSchema.extend({
    id: z.string().transform(Number)
});


export async function createProduct(prevState: { message: string, success?: boolean } | undefined, formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    subCategoryId: formData.get('subCategoryId'),
    description: formData.get('description'),
    longDescription: formData.get('longDescription'),
    images: formData.get('images'),
    features: formData.get('features'),
    technicalSpecifications: formData.get('technicalSpecifications'),
    generalSpecifications: formData.get('generalSpecifications'),
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    tokopediaUrl: formData.get('tokopediaUrl'),
    shopeeUrl: formData.get('shopeeUrl'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = Object.values(error).flat()[0] || "Input tidak valid";
    return { message, success: false };
  }
  
  const { ...rest } = validatedFields.data;

  try {
    const existingSlug = await prisma.product.findUnique({ where: { slug: rest.slug } });
    if(existingSlug) {
      return { message: 'Slug sudah digunakan oleh produk lain.', success: false }
    }

    await prisma.product.create({
      data: {
        ...rest,
        // Prisma expects a JsonValue for Json fields
        technicalSpecifications: rest.technicalSpecifications as any,
        generalSpecifications: rest.generalSpecifications as any,
      },
    });

  } catch (error) {
    console.error('Create product error:', error);
    return { message: 'Gagal membuat produk karena kesalahan server.', success: false };
  }
  
  revalidatePath('/');
  revalidatePath('/admin/produk');
  revalidatePath('/produk');
  revalidatePath(`/produk/${rest.slug}`);
  redirect('/admin/produk');
}

export async function updateProduct(prevState: { message: string, success?: boolean } | undefined, formData: FormData) {
    const validatedFields = UpdateProductSchema.safeParse({
        id: formData.get('id'),
        title: formData.get('title'),
        slug: formData.get('slug'),
        subCategoryId: formData.get('subCategoryId'),
        description: formData.get('description'),
        longDescription: formData.get('longDescription'),
        images: formData.get('images'),
        features: formData.get('features'),
        technicalSpecifications: formData.get('technicalSpecifications'),
        generalSpecifications: formData.get('generalSpecifications'),
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription'),
        tokopediaUrl: formData.get('tokopediaUrl'),
        shopeeUrl: formData.get('shopeeUrl'),
    });

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors;
        const message = Object.values(error).flat()[0] || "Input tidak valid";
        return { message, success: false };
    }

    const { id, ...rest } = validatedFields.data;

    try {
        const existingSlug = await prisma.product.findFirst({ where: { slug: rest.slug, id: { not: id } } });
        if(existingSlug) {
            return { message: 'Slug sudah digunakan oleh produk lain.', success: false }
        }
        
        await prisma.product.update({
            where: { id },
            data: {
                ...rest,
                technicalSpecifications: rest.technicalSpecifications as any,
                generalSpecifications: rest.generalSpecifications as any,
            },
        });

    } catch (error) {
        console.error('Update product error:', error);
        return { message: 'Gagal memperbarui produk.', success: false };
    }

    revalidatePath('/');
    revalidatePath('/admin/produk');
    revalidatePath('/produk');
    revalidatePath(`/produk/${rest.slug}`);
    redirect('/admin/produk');
}

export async function deleteProduct(productId: number) {
  try {
    const product = await prisma.product.findUnique({ 
        where: { id: productId },
        select: { slug: true } // Only select the slug
    });
    if (product) {
        await prisma.product.delete({ where: { id: productId } });
        revalidatePath('/');
        revalidatePath('/admin/produk');
        revalidatePath('/produk');
        revalidatePath(`/produk/${product.slug}`);
        return { message: 'Produk berhasil dihapus.' };
    }
    return { message: 'Produk tidak ditemukan.' };
  } catch (error) {
    console.error('Delete product error:', error);
    return { message: 'Gagal menghapus produk.' };
  }
}
