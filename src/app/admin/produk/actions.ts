'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const ProductSchema = z.object({
  title: z.string().min(1, 'Judul tidak boleh kosong'),
  slug: z.string().min(1, 'Slug tidak boleh kosong').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'),
  subCategoryId: z.coerce.number().min(1, 'Sub Kategori harus dipilih'),
  description: z.string().min(1, 'Deskripsi singkat tidak boleh kosong'),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  features: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: 'Format JSON untuk fitur tidak valid' }),
  specifications: z.string().refine((val) => {
    if (!val || val.trim() === '') return true; // Optional field
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: 'Format JSON untuk spesifikasi tidak valid' }).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const UpdateProductSchema = ProductSchema.extend({
    id: z.string().transform(Number)
});


export async function createProduct(prevState: { message: string } | undefined, formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    subCategoryId: formData.get('subCategoryId'),
    description: formData.get('description'),
    longDescription: formData.get('longDescription'),
    image: formData.get('image'),
    features: formData.get('features'),
    specifications: formData.get('specifications'),
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = Object.values(error).flat()[0] || "Input tidak valid";
    return { message };
  }
  
  const { ...rest } = validatedFields.data;

  try {
    const existingSlug = await prisma.product.findUnique({ where: { slug: rest.slug } });
    if(existingSlug) {
      return { message: 'Slug sudah digunakan oleh produk lain.'}
    }

    await prisma.product.create({
      data: {
        ...rest,
      },
    });

    revalidatePath('/admin/produk');
    revalidatePath('/produk');
    revalidatePath(`/produk/${rest.slug}`);
    return { message: 'Produk berhasil dibuat.' };
  } catch (error) {
    console.error('Create product error:', error);
    return { message: 'Gagal membuat produk karena kesalahan server.' };
  }
}

export async function updateProduct(prevState: { message: string } | undefined, formData: FormData) {
    const validatedFields = UpdateProductSchema.safeParse({
        id: formData.get('id'),
        title: formData.get('title'),
        slug: formData.get('slug'),
        subCategoryId: formData.get('subCategoryId'),
        description: formData.get('description'),
        longDescription: formData.get('longDescription'),
        image: formData.get('image'),
        features: formData.get('features'),
        specifications: formData.get('specifications'),
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription'),
    });

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors;
        const message = Object.values(error).flat()[0] || "Input tidak valid";
        return { message };
    }

    const { id, ...rest } = validatedFields.data;

    try {
        const existingSlug = await prisma.product.findFirst({ where: { slug: rest.slug, id: { not: id } } });
        if(existingSlug) {
            return { message: 'Slug sudah digunakan oleh produk lain.'}
        }
        
        await prisma.product.update({
            where: { id },
            data: {
                ...rest,
            },
        });

        revalidatePath('/admin/produk');
        revalidatePath('/produk');
        revalidatePath(`/produk/${rest.slug}`);
        return { message: 'Produk berhasil diperbarui.' };
    } catch (error) {
        console.error('Update product error:', error);
        return { message: 'Gagal memperbarui produk.' };
    }
}

export async function deleteProduct(productId: number) {
  try {
    const product = await prisma.product.findUnique({ where: { id: productId }});
    if (product) {
        await prisma.product.delete({ where: { id: productId } });
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
