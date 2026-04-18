import { NextRequest, NextResponse } from "next/server";

const MARZPAY_API_KEY = process.env.MARZPAY_API_KEY || "marz_ZQWqDW0AyDUhMCWy";
const MARZPAY_API_SECRET = process.env.MARZPAY_API_SECRET || "aU2UMh9mgb5kXcLYmXuECxBchht9cSIH";
const BASE_URL = "https://wallet.wearemarz.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const { amount, transactionId } = await request.json();

    // Create payment with MarzPay
    const response = await fetch(`${BASE_URL}/payments/create`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${MARZPAY_API_KEY}:${MARZPAY_API_SECRET}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "USD",
        reference: transactionId,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/add-funds?success=true`,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({
        paymentUrl: data.data.checkout_url,
        reference: data.data.reference,
      });
    } else {
      throw new Error(data.message || "Failed to create payment");
    }
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
