'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';

const CreateUserSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Kata sandi harus minimal 6 karakter'),
});

const UpdateUserSchema = z.object({
  id: z.string().transform(Number),
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  email: z.string().email('Email tidak valid'),
  password: z.string().optional(),
});


export async function createUser(prevState: { message: string } | undefined, formData: FormData) {
  const validatedFields = CreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = error.password?.[0] || error.email?.[0] || error.name?.[0] || "Input tidak valid";
    return { message };
  }
  
  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { message: 'Email sudah digunakan.' };
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    revalidatePath('/admin/users');
    return { message: 'User berhasil dibuat.' };
  } catch (error) {
    console.error('Create user error:', error);
    return { message: 'Gagal membuat user karena kesalahan server.' };
  }
}

export async function updateUser(prevState: { message: string } | undefined, formData: FormData) {
    const validatedFields = UpdateUserSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { message: 'Input tidak valid.' };
    }

    const { id, name, email, password } = validatedFields.data;

    try {
        const userToUpdate = await prisma.user.findUnique({ where: { id } });
        if (!userToUpdate) {
            return { message: 'User tidak ditemukan.' };
        }

        const existingUserWithEmail = await prisma.user.findUnique({ where: { email } });
        if (existingUserWithEmail && existingUserWithEmail.id !== id) {
            return { message: 'Email sudah digunakan oleh user lain.' };
        }

        const dataToUpdate: { name: string; email: string; password?: string } = { name, email };

        if (password && password.length > 0) {
            if (password.length < 6) {
                return { message: 'Kata sandi baru harus minimal 6 karakter.' };
            }
            const salt = await bcryptjs.genSalt(10);
            dataToUpdate.password = await bcryptjs.hash(password, salt);
        }

        await prisma.user.update({
            where: { id },
            data: dataToUpdate,
        });

        revalidatePath('/admin/users');
        return { message: 'User berhasil diperbarui.' };
    } catch (error) {
        console.error('Update user error:', error);
        return { message: 'Gagal memperbarui user.' };
    }
}

export async function deleteUser(userId: number) {
  try {
    // Prevent deleting the very first admin user
    if (userId === 1) {
        return { message: 'Gagal menghapus: User admin utama tidak dapat dihapus.'}
    }
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath('/admin/users');
    return { message: 'User berhasil dihapus.' };
  } catch (error) {
    console.error('Delete user error:', error);
    return { message: 'Gagal menghapus user.' };
  }
}
