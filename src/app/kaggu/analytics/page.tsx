"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  summary: {
    totalOrders: number;
    totalRevenue: string;
    totalCost: string;
    totalProfit: string;
    profitMargin: string;
  };
  chart: Array<{
    date: string;
    orders: number;
    revenue: number;
    cost: number;
    profit: number;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    currency: string;
    description: string;
    created_at: string;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const res = await fetch(`/api/kaggu/analytics?start=${startDate}&end=${endDate}&currency=${currency}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, [period, currency]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  const { summary, chart, transactions } = data || { summary: { totalOrders: 0, totalRevenue: '0', totalCost: '0', totalProfit: '0', profitMargin: '0' }, chart: [], transactions: [] };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Profits</h1>
          <p className="text-[var(--text-secondary)]">Track your revenue and profit over time</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2 text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2 text-sm"
          >
            <option value="USD">USD ($)</option>
            <option value="UGX">UGX (USh)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="KES">KES (KSh)</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Total Orders</span>
            <ShoppingCart size={20} className="text-blue-400" />
          </div>
          <p className="mt-2 text-3xl font-bold">{summary.totalOrders}</p>
        </div>
        
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Total Revenue</span>
            <DollarSign size={20} className="text-green-400" />
          </div>
          <p className="mt-2 text-3xl font-bold">{currency === 'USD' ? '$' : ''}{summary.totalRevenue}</p>
        </div>
        
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Total Cost</span>
            <TrendingDown size={20} className="text-red-400" />
          </div>
          <p className="mt-2 text-3xl font-bold">{currency === 'USD' ? '$' : ''}{summary.totalCost}</p>
        </div>
        
        <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--accent)]">Total Profit</span>
            <TrendingUp size={20} className="text-[var(--accent)]" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[var(--accent)]">{currency === 'USD' ? '$' : ''}{summary.totalProfit}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{summary.profitMargin}% margin</p>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Profit Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="profit" fill="var(--accent)" name="Profit" />
              <Bar dataKey="revenue" fill="#22c55e" name="Revenue" fillOpacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.slice(0, 10).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3">
              <div className="flex items-center gap-3">
                {tx.type === 'deposit' ? (
                  <ArrowDownRight size={20} className="text-green-400" />
                ) : (
                  <ArrowUpRight size={20} className="text-red-400" />
                )}
                <div>
                  <p className="font-medium">{tx.description || tx.type}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className={`font-semibold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amount >= 0 ? '+' : ''}{tx.amount} {tx.currency}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
