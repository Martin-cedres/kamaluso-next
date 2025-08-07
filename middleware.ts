import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Rutas públicas sin protección
  const publicPaths = ["/login", "/api", "/_next", "/favicon.ico", "/"];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Proteger solo ruta /admin y sus subrutas
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret });

    if (!token || token.role !== "admin") {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};