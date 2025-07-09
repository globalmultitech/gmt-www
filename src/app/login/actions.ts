
'use server';

import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

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

    if (!user.password || user.password.length < 10) {
      console.error('Invalid password hash in database for user:', email);
      return { message: 'Konfigurasi akun bermasalah. Hubungi administrator.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { message: 'Email atau kata sandi salah.' };
    }
    
    // If credentials are valid, set the cookie
    const sessionData = { userId: user.id, name: user.name, email: user.email };
    cookies().set('auth_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

  } catch (error) {
    console.error('Login error:', error);
    return { message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.' };
  }

  // Redirect must be called outside of the try...catch block
  redirect('/admin/dashboard');
}

export async function logout() {
  cookies().delete('auth_session');
  redirect('/login');
}
