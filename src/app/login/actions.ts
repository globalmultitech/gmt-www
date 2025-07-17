
'use server';

import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import bcryptjs from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

if (!process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET environment variable is not set');
}
const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET);

async function createSession(userId: number) {
  const payload = { userId, iat: Math.floor(Date.now() / 1000) };
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secretKey);
  
  cookies().set('auth_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });
}

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

    if (!user || !user.password) {
      return { message: 'Email atau kata sandi salah.' };
    }
    
    if (user.password.length < 10) {
      console.error('Invalid password hash in database for user:', email);
      return { message: 'Konfigurasi akun bermasalah. Hubungi administrator.' };
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return { message: 'Email atau kata sandi salah.' };
    }
    
    // If credentials are valid, create the session
    await createSession(user.id);
    
  } catch (error) {
    console.error('Login error:', error);
    return { message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.' };
  }

  // Redirect to dashboard on success, must be outside try/catch
  redirect('/admin/dashboard');
}

export async function logout() {
  cookies().delete('auth_session');
  redirect('/login');
}
