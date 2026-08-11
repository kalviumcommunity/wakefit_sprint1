import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'wakefit-super-secret-key-2026-sprint1' });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminRoute = pathname.startsWith('/admin');
  const isProtectedCustomerRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/wishlist') ||
    pathname.startsWith('/returns') ||
    pathname.startsWith('/schedule-return') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/support');

  if (isAuthPage) {
    if (token) {
      if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (!token && (isAdminRoute || isProtectedCustomerRoute)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAdminRoute && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/orders/:path*',
    '/cart/:path*',
    '/wishlist/:path*',
    '/returns/:path*',
    '/schedule-return/:path*',
    '/profile/:path*',
    '/support/:path*',
    '/admin/:path*',
  ],
};
