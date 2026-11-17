import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Admin rotalarını server kenarında korur.
 * Yazma işlemleri ayrıca requireAdmin() ile korunmalıdır.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/giris") {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    if (token?.id && token.role === "OWNER") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    if (!token?.id || token.role !== "OWNER") {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ ok: false, error: "Oturum gerekli" }, { status: 401 });
      }
      const login = new URL("/admin/giris", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
