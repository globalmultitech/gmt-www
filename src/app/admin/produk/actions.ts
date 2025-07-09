'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const ProductSchema = z.object({
  title: z.string().min(1, 'Judul tidak boleh kosong'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  image: z.string().url('URL gambar tidak valid'),
  features: z.string().min(1, 'Fitur tidak boleh kosong'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const UpdateProductSchema = ProductSchema.extend({
    id: z.string().transform(Number)
});


export async function createProduct(prevState: { message: string } | undefined, formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    image: formData.get('image'),
    features: formData.get('features'),
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = Object.values(error).flat()[0] || "Input tidak valid";
    return { message };
  }
  
  const { title, description, image, features, metaTitle, metaDescription } = validatedFields.data;
  const featuresArray = features.split('\n').filter(f => f.trim() !== '');

  try {
    await prisma.product.create({
      data: {
        title,
        description,
        image,
        features: featuresArray,
        metaTitle,
        metaDescription
      },
    });

    revalidatePath('/admin/produk');
    revalidatePath('/produk'); // Revalidate public page
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
        description: formData.get('description'),
        image: formData.get('image'),
        features: formData.get('features'),
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription'),
    });

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors;
        const message = Object.values(error).flat()[0] || "Input tidak valid";
        return { message };
    }

    const { id, title, description, image, features, metaTitle, metaDescription } = validatedFields.data;
    const featuresArray = features.split('\n').filter(f => f.trim() !== '');

    try {
        await prisma.product.update({
            where: { id },
            data: {
                title,
                description,
                image,
                features: featuresArray,
                metaTitle,
                metaDescription,
            },
        });

        revalidatePath('/admin/produk');
        revalidatePath('/produk'); // Revalidate public page
        return { message: 'Produk berhasil diperbarui.' };
    } catch (error) {
        console.error('Update product error:', error);
        return { message: 'Gagal memperbarui produk.' };
    }
}

export async function deleteProduct(productId: number) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath('/admin/produk');
    revalidatePath('/produk'); // Revalidate public page
    return { message: 'Produk berhasil dihapus.' };
  } catch (error) {
    console.error('Delete product error:', error);
    return { message: 'Gagal menghapus produk.' };
  }
}
