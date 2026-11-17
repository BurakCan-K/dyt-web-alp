import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/** Hostinger proxy arkasında http→https redirect döngüsünü önler */
function absoluteUrl(path: string, request: NextRequest) {
  const base =
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (base) {
    return new URL(path, `${base}/`);
  }
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.nextUrl.host;
  return new URL(path, `${proto}://${host}`);
}

/**
 * Admin rotalarını server kenarında korur.
 * Yazma işlemleri ayrıca requireAdmin() ile korunmalıdır.
 */
export async function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);

  if (pathname === "/admin/giris") {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    if (token?.id && token.role === "OWNER") {
      return NextResponse.redirect(absoluteUrl("/admin", request));
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
      const login = absoluteUrl("/admin/giris", request);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
