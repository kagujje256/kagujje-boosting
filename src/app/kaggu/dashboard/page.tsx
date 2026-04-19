"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, Zap } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-green-400" },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-[var(--accent)]" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Activity, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--text-secondary)]">Welcome to KAGUJJE Boost Admin Panel</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
          <Zap size={16} />
          <span className="text-sm font-medium">Admin Mode</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--accent)]/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <card.icon size={24} className={card.color} />
            </div>
            <p className="mt-4 text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/kaggu/analytics"
            className="flex items-center gap-3 rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-black transition-all hover:opacity-90"
          >
            <TrendingUp size={18} />
            View Analytics
          </Link>
          <Link
            href="/kaggu/services"
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3 transition-all hover:border-[var(--accent)]"
          >
            View Services
          </Link>
          <Link
            href="/kaggu/orders"
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3 transition-all hover:border-[var(--accent)]"
          >
            View Orders
          </Link>
          <Link
            href="/kaggu/users"
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3 transition-all hover:border-[var(--accent)]"
          >
            View Users
          </Link>
        </div>
      </div>
    </div>
  );
}