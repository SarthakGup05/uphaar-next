import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth"; // Your auth helper
import { cookies } from "next/headers";

// 1. Define Routes
const protectedRoutes = ["/admin"];
const publicRoutes = ["/admin/login", "/shop", "/"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isLoginPage = path === "/admin/login";

  // 2. Check Session
  const cookie = (await cookies()).get("session")?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  // 3. Logic: Protect Admin Routes
  if (isProtectedRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 4. Logic: Redirect logged-in users away from Login page
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// 5. Config: Run on everything EXCEPT static files and images
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};