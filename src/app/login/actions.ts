
'use server';

import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';

export async function login(prevState: { message: string } | undefined, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let errorMessage = '';

  if (!email || !password || !email.includes('@')) {
    errorMessage = 'Harap masukkan email dan kata sandi yang valid.';
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        errorMessage = 'Email atau kata sandi salah.';
      } else if (!user.password || user.password.length < 10) {
        console.error('Invalid password hash in database for user:', email);
        errorMessage = 'Konfigurasi akun bermasalah. Hubungi administrator.';
      } else {
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
          errorMessage = 'Email atau kata sandi salah.';
        } else {
          // If credentials are valid, set the cookie
          const sessionData = { userId: user.id, name: user.name, email: user.email };
          await cookies().set('auth_session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'lax',
          });
          // Redirect to dashboard on success, must be outside try/catch
          return redirect('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
    }
  }

  // Redirect back to login with an error message if any error occurred
  const loginUrl = new URL('/login', 'http://localhost'); // Base URL is required but not used
  loginUrl.searchParams.set('error', errorMessage);
  return redirect(loginUrl.pathname + loginUrl.search);
}

export async function logout() {
  cookies().delete('auth_session');
  redirect('/login');
}
