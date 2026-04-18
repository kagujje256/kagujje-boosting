"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Search, Filter } from "lucide-react";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("*, service:services(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      setOrders(data as Order[]);
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.service?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.link.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || order.status === status;
    return matchesSearch && matchesStatus;
  });

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
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-[var(--text-secondary)]">
              Track and manage your orders
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pl-12 pr-4 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="partial">Partial</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-[var(--text-secondary)]">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-sm text-[var(--text-secondary)]">
                      <th className="px-6 py-4 font-medium">ID</th>
                      <th className="px-6 py-4 font-medium">Service</th>
                      <th className="px-6 py-4 font-medium">Link</th>
                      <th className="px-6 py-4 font-medium">Quantity</th>
                      <th className="px-6 py-4 font-medium">Price</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-tertiary)]">
                        <td className="px-6 py-4 text-sm font-mono">
                          {order.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{order.service?.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--accent)] hover:underline line-clamp-1"
                          >
                            {order.link}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {order.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ${order.price.toFixed(4)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
