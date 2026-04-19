import { NextResponse, type NextRequest } from "next/server";

// No middleware - auth is handled by page components
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Only run on kaggu routes
export const config = {
  matcher: ["/kaggu/:path*"],
};