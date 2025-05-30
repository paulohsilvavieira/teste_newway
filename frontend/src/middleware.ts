import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  const isRegisterAdminPage = pathname === '/register-admin';

  const isPublicPage = isLoginPage || isRegisterPage || isRegisterAdminPage;

  if (pathname === '/' && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authToken && isPublicPage) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  if (!authToken && !isPublicPage && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico).*)'],
};
