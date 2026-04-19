"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { ShoppingCart, Search, Filter, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    let query = supabase.from("orders").select("*, profiles(username), services(name)").order("created_at", { ascending: false });
    
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    const { data } = await query;
    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    (order as any).profiles?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    pending: "badge-warning",
    processing: "badge-info",
    in_progress: "badge-info",
    completed: "badge-success",
    partial: "badge-warning",
    cancelled: "badge-danger",
    refunded: "badge-danger",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-[var(--text-secondary)]">{orders.length} total orders</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--bg-tertiary)]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-2 pl-10 pr-4"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="partial">Partial</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-4 py-3 text-left text-sm">Order ID</th>
              <th className="px-4 py-3 text-left text-sm">User</th>
              <th className="px-4 py-3 text-left text-sm">Service</th>
              <th className="px-4 py-3 text-left text-sm">Quantity</th>
              <th className="px-4 py-3 text-left text-sm">Price</th>
              <th className="px-4 py-3 text-left text-sm">Status</th>
              <th className="px-4 py-3 text-left text-sm">Date</th>
              <th className="px-4 py-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: any) => (
              <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
                <td className="px-4 py-3 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-sm">{order.profiles?.username || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{order.services?.name || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{order.quantity.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">${order.price}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${statusColors[order.status] || "badge-info"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/kaggu/orders/${order.id}`}
                    className="text-[var(--accent)] hover:underline"
                  >
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}