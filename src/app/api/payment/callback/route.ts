import { NextRequest, NextResponse } from "next/server";

// Simple callback handler - can be enhanced with proper verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the callback for now
    console.log("Payment callback received:", body);
    
    // In production, verify the payment with MarzPay API
    // and update the user's balance accordingly
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: "Failed to process callback" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // For redirect from payment page
  const { searchParams } = new URL(request.url);
  const success = searchParams.get("success");
  
  if (success === "true") {
    return NextResponse.redirect(new URL("/dashboard?message=Payment successful", request.url));
  }
  
  return NextResponse.redirect(new URL("/add-funds?error=Payment failed", request.url));
}
