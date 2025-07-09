'use server';

import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function login(prevState: { message: string } | undefined, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !email.includes('@')) {
    return { message: 'Harap masukkan email dan kata sandi yang valid.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: 'Email atau kata sandi salah.' };
    }

    // It's possible the user exists but the password was not correctly seeded.
    // A valid bcrypt hash is required for comparison.
    if (!user.password || user.password.length < 10) {
      console.error('Invalid password hash in database for user:', email);
      return { message: 'Konfigurasi akun bermasalah. Hubungi administrator.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { message: 'Email atau kata sandi salah.' };
    }

    // In a real application, you would create a secure session or JWT here.
    redirect('/admin/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    return { message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.' };
  }
}
