import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "config");
    return NextResponse.redirect(url);
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifyAdminToken(token, secret);

  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
