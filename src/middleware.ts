
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';
 
async function verifySession(token: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return payload;
  } catch (err) {
    console.error("Session verification failed:", err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  // Check for the developer mode switch
  if (process.env.DISABLE_AUTH_MIDDLEWARE === 'true') {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('auth_session');
  const sessionToken = sessionCookie?.value;
 
  const { pathname } = request.nextUrl;
  
  const session = await verifySession(sessionToken || '');

  // If user is trying to access admin pages but is not logged in, redirect to login
  if (pathname.startsWith('/admin') && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/login' && session) {
     const dashboardUrl = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/:path*', '/login'],
}
