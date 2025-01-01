import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  console.log('Middleware - Estado de sesión:', {
    path: request.nextUrl.pathname,
    hasSession: !!session
  });

  const isAuthPage = request.nextUrl.pathname === '/login';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Si no hay sesión y está intentando acceder al dashboard
  if (!session && isDashboardPage) {
    console.log('Middleware - Redirigiendo a login por falta de sesión');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay sesión y está intentando acceder a la página de login
  if (session && isAuthPage) {
    console.log('Middleware - Redirigiendo a dashboard por sesión existente');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};

