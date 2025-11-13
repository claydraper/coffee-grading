import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                    req.nextUrl.pathname.startsWith('/register');
  const isPublicRoute = ['/'].includes(req.nextUrl.pathname);
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/cuppings');

  // Allow API auth routes and public routes
  if (isApiAuthRoute || isPublicRoute) {
    return NextResponse.next();
  }

  // Handle API routes
  if (isApiRoute) {
    if (!isLoggedIn) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Handle auth pages
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, req.nextUrl.origin)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
