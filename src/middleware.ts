import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Simple auth check - redirect to auth if no session
  const hasSession = request.cookies.get('sb-access-token');
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect dashboard route
  if (request.nextUrl.pathname === "/dashboard") {
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard",
    "/orders",
    "/add-funds",
  ],
};
