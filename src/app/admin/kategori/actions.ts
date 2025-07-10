'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getCategoriesWithSubcategories() {
  return prisma.productCategory.findMany({
    include: {
      subCategories: {
        orderBy: {
          name: 'asc'
        }
      },
    },
    orderBy: {
      name: 'asc'
    }
  });
}

// Category Actions
const CategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori tidak boleh kosong'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export async function createCategory(prevState: { message: string } | undefined, formData: FormData) {
  const validatedFields = CategorySchema.safeParse({ 
    name: formData.get('name'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
  });
  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = Object.values(error).flat()[0] || "Input tidak valid";
    return { message };
  }

  try {
    const existingName = await prisma.productCategory.findUnique({ where: { name: validatedFields.data.name } });
    if(existingName) {
      return { message: 'Nama kategori sudah digunakan.'}
    }

    await prisma.productCategory.create({ data: validatedFields.data });
    revalidatePath('/admin/kategori');
    revalidatePath('/produk');
    revalidatePath('/produk/kategori', 'layout');
    return { message: 'Kategori berhasil dibuat.' };
  } catch (e) {
    return { message: 'Gagal membuat kategori.' };
  }
}

export async function updateCategory(prevState: { message: string } | undefined, formData: FormData) {
  const id = Number(formData.get('id'));
  const validatedFields = CategorySchema.safeParse({ 
    name: formData.get('name'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
  });
  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = Object.values(error).flat()[0] || "Input tidak valid";
    return { message };
  }
  
  try {
    const existingName = await prisma.productCategory.findFirst({ where: { name: validatedFields.data.name, id: { not: id } } });
    if(existingName) {
      return { message: 'Nama kategori sudah digunakan.'}
    }

    await prisma.productCategory.update({ where: { id }, data: validatedFields.data });
    revalidatePath('/admin/kategori');
    revalidatePath('/produk');
    revalidatePath('/produk/kategori', 'layout');
    return { message: 'Kategori berhasil diperbarui.' };
  } catch (e) {
    return { message: 'Gagal memperbarui kategori.' };
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.productCategory.delete({ where: { id } });
    revalidatePath('/admin/kategori');
    revalidatePath('/produk');
    revalidatePath('/produk/kategori', 'layout');
    return { message: 'Kategori berhasil dihapus.' };
  } catch (e) {
    return { message: 'Gagal menghapus kategori. Pastikan tidak ada sub-kategori di dalamnya.' };
  }
}


// SubCategory Actions
const SubCategorySchema = z.object({
  name: z.string().min(1, 'Nama sub-kategori tidak boleh kosong'),
  categoryId: z.coerce.number(),
});

export async function createSubCategory(prevState: { message: string } | undefined, formData: FormData) {
  const validatedFields = SubCategorySchema.safeParse({
    name: formData.get('name'),
    categoryId: formData.get('categoryId')
  });

  if (!validatedFields.success) return { message: 'Input tidak valid.' };
  
  try {
    await prisma.productSubCategory.create({ data: validatedFields.data });
    revalidatePath('/admin/kategori');
    revalidatePath('/admin/produk');
    return { message: 'Sub-kategori berhasil dibuat.' };
  } catch (e) {
    return { message: 'Gagal membuat sub-kategori.' };
  }
}

export async function updateSubCategory(prevState: { message: string } | undefined, formData: FormData) {
  const id = Number(formData.get('id'));
  const validatedFields = SubCategorySchema.omit({ categoryId: true }).safeParse({ name: formData.get('name') });
  if (!validatedFields.success) return { message: 'Input tidak valid.' };

  try {
    await prisma.productSubCategory.update({ where: { id }, data: { name: validatedFields.data.name } });
    revalidatePath('/admin/kategori');
    revalidatePath('/admin/produk');
    return { message: 'Sub-kategori berhasil diperbarui.' };
  } catch (e) {
    return { message: 'Gagal memperbarui sub-kategori.' };
  }
}

export async function deleteSubCategory(id: number) {
  try {
    await prisma.productSubCategory.delete({ where: { id } });
    revalidatePath('/admin/kategori');
    revalidatePath('/admin/produk');
    return { message: 'Sub-kategori berhasil dihapus.' };
  } catch (e) {
    return { message: 'Gagal menghapus sub-kategori. Pastikan tidak ada produk yang menggunakan sub-kategori ini.' };
  }
}
