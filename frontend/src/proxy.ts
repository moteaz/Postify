import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // Public routes that should redirect to dashboard if authenticated
  const isAuthRoute = pathname === '/auth' || pathname.startsWith('/auth?');

  // If accessing protected route without token, redirect to landing
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If accessing auth page with valid token, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
};
