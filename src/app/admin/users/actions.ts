'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const UserSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Kata sandi harus minimal 6 karakter'),
});

export async function createUser(prevState: { message: string } | undefined, formData: FormData) {
  const validatedFields = UserSchema.safeParse({
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
