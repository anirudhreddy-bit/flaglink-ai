import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const PROTECTED = ["/scan", "/results", "/history", "/settings", "/account", "/scanner"];

async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const token = await getToken({ req: request });

  if (!token) {
    // Not logged in — redirect to sign-in, preserving intended destination
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export { proxy };
export default proxy;

export const config = {
  matcher: [
    "/scan/:path*",
    "/results/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/account/:path*",
    "/scanner/:path*",
  ],
};
