import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({
    url: url || "NOT SET",
    urlLength: url ? url.length : 0,
    keyLength: key ? key.length : 0,
    keyPrefix: key ? key.substring(0, 30) + "..." : "NOT SET",
  });
}
