'use server';

import { redirect } from 'next/navigation';

// This is a simplified login for demonstration purposes.
// In a real-world application, use a robust authentication library like NextAuth.js or Clerk.
export async function login(prevState: { message: string } | undefined, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Basic validation
  if (!email || !password || !email.includes('@')) {
      return { message: 'Harap masukkan email dan kata sandi yang valid.' };
  }

  // Hardcoded credentials for demonstration.
  // NEVER do this in a production environment.
  if (email === 'admin@gmt.co.id' && password === 'password123') {
    // In a real application, you would create a secure session or JWT here.
    redirect('/admin/dashboard');
  }

  return { message: 'Email atau kata sandi salah.' };
}
