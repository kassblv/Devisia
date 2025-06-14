import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/auth/login') || 
    request.nextUrl.pathname.startsWith('/auth/register');

  // Si l'utilisateur est sur une page d'authentification mais qu'il est déjà connecté
  if (isAuthPage && token) {
    // Rediriger vers le tableau de bord
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Sinon, continuer normalement
  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: ['/auth/login', '/auth/register'],
};
