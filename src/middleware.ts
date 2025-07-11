
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // --- AUTHENTICATION DISABLED FOR TESTING ---
  // The original logic is commented out below.
  // This will allow all requests to /admin/* and /login to proceed without checking for a cookie.
  return NextResponse.next();


  /* --- ORIGINAL AUTHENTICATION LOGIC ---
  const sessionCookie = request.cookies.get('auth_session');
 
  const { pathname } = request.nextUrl;

  // If user is trying to access admin pages but is not logged in, redirect to login
  if (pathname.startsWith('/admin') && !sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/login' && sessionCookie) {
     const dashboardUrl = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
 
  return NextResponse.next()
  */
}
 
export const config = {
  matcher: ['/admin/:path*', '/login'],
}
