"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DollarSign, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import type { Profile } from "@/lib/types";

const amounts = [5, 10, 25, 50, 100, 250];

export default function AddFundsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profile as Profile);

      setLoading(false);
    }
    load();
  }, [router, supabase]);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const handlePayment = async () => {
    if (finalAmount < 5) {
      toast.error("Minimum deposit is $5");
      return;
    }

    setProcessing(true);

    try {
      // Create a pending transaction
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .insert({
          user_id: profile!.id,
          type: "deposit",
          amount: finalAmount,
          status: "pending",
          payment_method: "marzpay",
        })
        .select()
        .single();

      if (txError) throw txError;

      // Initialize MarzPay payment
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          transactionId: transaction.id,
        }),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        // Redirect to payment page
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (error) {
      toast.error("Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 pt-24 pb-12">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Add Funds</h1>
            <p className="text-[var(--text-secondary)]">
              Current balance: <span className="font-semibold text-[var(--accent)]">${profile?.balance?.toFixed(2)}</span>
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            {/* Preset Amounts */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Amount</label>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setAmount(amt); setCustomAmount(""); }}
                    className={`rounded-lg border py-3 text-center font-medium transition-all ${
                      amount === amt && !customAmount
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--accent)]"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Or Enter Custom Amount</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  min={5}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-3 pl-10 pr-4 focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--text-secondary)]">Amount</span>
                <span className="font-semibold">${finalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--text-secondary)]">Fee</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="border-t border-[var(--border)] my-2" />
              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold text-[var(--accent)]">${finalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Payment Method</label>
              <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 p-4">
                <div className="flex items-center gap-3">
                  <CreditCard size={24} className="text-[var(--accent)]" />
                  <div>
                    <div className="font-medium">MarzPay</div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Cards, Mobile Money, Bank Transfer
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={finalAmount < 5 || processing}
              className="w-full rounded-lg bg-[var(--accent)] py-3 font-semibold text-black transition-all hover:opacity-90 disabled:opacity-50"
            >
              {processing ? "Processing..." : `Pay $${finalAmount.toFixed(2)}`}
            </button>

            <p className="mt-4 text-center text-xs text-[var(--text-secondary)]">
              By proceeding, you agree to our payment terms. Funds are added instantly after successful payment.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
