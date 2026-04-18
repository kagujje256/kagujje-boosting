"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, ShoppingCart, AlertCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Service, Profile } from "@/lib/types";

export default function OrderPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
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

      const { data: service } = await supabase
        .from("services")
        .select("*, category:categories(name)")
        .eq("id", params.id)
        .single();
      setService(service as Service);

      setLoading(false);
    }
    load();
  }, [params.id, router, supabase]);

  const price = service ? (quantity * service.price_per_unit).toFixed(4) : "0";
  const isValidQuantity = service && quantity >= service.min_order && quantity <= service.max_order;
  const hasEnoughBalance = profile && parseFloat(price) <= profile.balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !profile || !isValidQuantity || !hasEnoughBalance) return;

    setSubmitting(true);
    try {
      const orderPrice = parseFloat(price);
      
      // Create order
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: profile.id,
        service_id: service.id,
        link,
        quantity,
        price: orderPrice,
        status: "pending",
      });

      if (orderError) throw orderError;

      // Deduct balance
      const { error: balanceError } = await supabase
        .from("profiles")
        .update({ balance: profile.balance - orderPrice })
        .eq("id", profile.id);

      if (balanceError) throw balanceError;

      // Create transaction
      await supabase.from("transactions").insert({
        user_id: profile.id,
        type: "order",
        amount: -orderPrice,
        balance_after: profile.balance - orderPrice,
        status: "completed",
      });

      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <Link href="/services" className="text-[var(--accent)]">← Back to Services</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 pt-24 pb-12">
        <div className="mx-auto max-w-2xl">
          <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
            <ArrowLeft size={16} />
            Back to Services
          </Link>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div className="mb-6">
              <span className="text-sm text-[var(--accent)]">{service.category?.name}</span>
              <h1 className="text-2xl font-bold">{service.name}</h1>
              {service.description && (
                <p className="mt-2 text-[var(--text-secondary)]">{service.description}</p>
              )}
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-4">
                <div className="text-sm text-[var(--text-secondary)]">Min Order</div>
                <div className="text-lg font-bold">{service.min_order.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-4">
                <div className="text-sm text-[var(--text-secondary)]">Max Order</div>
                <div className="text-lg font-bold">{service.max_order.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-4">
                <div className="text-sm text-[var(--text-secondary)]">Price/Unit</div>
                <div className="text-lg font-bold text-[var(--accent)]">${service.price_per_unit.toFixed(4)}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-3 px-4 focus:border-[var(--accent)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  min={service.min_order}
                  max={service.max_order}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-3 px-4 focus:border-[var(--accent)] focus:outline-none"
                  required
                />
                <input
                  type="range"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  min={service.min_order}
                  max={service.max_order}
                  className="w-full mt-2"
                />
              </div>

              <div className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Total Price</span>
                  <span className="text-2xl font-bold text-[var(--accent)]">${price}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-[var(--text-secondary)]">Your Balance</span>
                  <span className="font-semibold">${profile?.balance?.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              {!hasEnoughBalance && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                  <AlertCircle size={18} />
                  <span>Insufficient balance. Please add funds to continue.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isValidQuantity || !hasEnoughBalance || submitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-3 font-semibold text-black transition-all hover:opacity-90 disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {submitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
