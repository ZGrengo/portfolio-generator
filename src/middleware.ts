import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Don't handle auth routes here - let the route handler handle them
  // Auth routes are handled by /api/auth/[auth0]/route.ts

  // Check for protected routes
  const protectedPaths = [
    '/dashboard',
    '/api/portfolio',
    '/create-portfolio',
    '/edit-portfolio'
  ];

  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute) {
    // Get the session
    const session = await auth0.getSession(request);
    
    // If there's no session, redirect to login
    if (!session) {
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Don't match auth routes - they're handled by route handlers
    '/dashboard/:path*',
    '/api/portfolio/:path*',
    '/create-portfolio',
    '/edit-portfolio/:path*'
  ]
}; 