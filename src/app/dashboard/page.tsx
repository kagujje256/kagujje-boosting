"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import type { Profile, Order } from "@/lib/types";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TrendingUp, Clock, CheckCircle, XCircle, DollarSign, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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

      const { data: orders } = await supabase
        .from("orders")
        .select("*, service:services(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setOrders(orders as Order[]);

      setLoading(false);
    }
    load();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  const stats = [
    { icon: TrendingUp, label: "Total Orders", value: orders.length },
    { icon: Clock, label: "Pending", value: orders.filter(o => o.status === "pending").length },
    { icon: CheckCircle, label: "Completed", value: orders.filter(o => o.status === "completed").length },
    { icon: DollarSign, label: "Balance", value: `$${profile?.balance?.toFixed(2) || "0.00"}` },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 pt-24 pb-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.username || profile?.full_name || "User"}
            </h1>
            <p className="text-[var(--text-secondary)]">
              Manage your orders and account
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon size={20} className="text-[var(--accent)]" />
                  <span className="text-sm text-[var(--text-secondary)]">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/services"
              className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-black hover:opacity-90"
            >
              <Plus size={18} />
              New Order
            </Link>
            <Link
              href="/add-funds"
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 font-medium hover:border-[var(--accent)]"
            >
              Add Funds
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 font-medium hover:border-[var(--accent)]"
            >
              View All Orders
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                <p>No orders yet</p>
                <Link href="/services" className="mt-2 inline-block text-[var(--accent)]">
                  Place your first order →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-4"
                  >
                    <div>
                      <div className="font-medium">
                        {order.service?.name || "Service"}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {order.quantity.toLocaleString()} units • ${order.price.toFixed(4)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium status-${order.status}`}>
                        {order.status}
                      </span>
                      <div className="mt-1 text-xs text-[var(--text-secondary)]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
