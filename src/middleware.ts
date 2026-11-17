import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Hostinger / HTTPS proxy altında Edge `getToken` ile Node `auth()`
 * farklı cookie adlarına bakabiliyor; sayfa korumasında bu çift yönlendirme
 * (`/admin` ↔ `/admin/giris?callbackUrl=/admin`) döngüsü yaratıyordu.
 *
 * Sayfa koruması: `app/admin/(protected)/layout.tsx` → getAdminSession()
 * Burada yalnızca `/api/admin` JWT kontrolü yapılır.
 */
async function readAdminToken(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const https = (process.env.AUTH_URL ?? "").startsWith("https://");
  const first = await getToken({
    req: request,
    secret,
    secureCookie: https,
  });
  if (first) return first;

  return getToken({
    req: request,
    secret,
    secureCookie: !https,
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const token = await readAdminToken(request);
  if (!token?.id || token.role !== "OWNER") {
    return NextResponse.json({ ok: false, error: "Oturum gerekli" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
