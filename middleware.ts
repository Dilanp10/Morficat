import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";

export const config = {
  matcher: [
    // todos los paths excepto assets estáticos
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-maskable.svg|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

export async function middleware(req: NextRequest) {
  // Respuesta base (puede ser modificada por Supabase para setear cookies de sesión)
  let response = NextResponse.next({ request: req });

  // Refrescar sesión Supabase + sincronizar cookies en cada request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  await supabase.auth.getUser();

  // Guard de /admin (usa su propia cookie HMAC, independiente del Supabase Auth)
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
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
  }

  return response;
}
