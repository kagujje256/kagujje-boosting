"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  Wallet, TrendingUp, ShoppingCart, CreditCard, 
  Plus, ArrowUpRight, ArrowDownRight, History,
  DollarSign, Clock
} from "lucide-react";
import type { Profile, Order, Transaction } from "@/lib/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositing, setDepositing] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      
      const [profileRes, ordersRes, transactionsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("orders").select("*, service:services(name)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      
      setProfile(profileRes.data as Profile);
      setOrders((ordersRes.data as Order[]) || []);
      setTransactions((transactionsRes.data as Transaction[]) || []);
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!depositAmount || parseInt(depositAmount) < 5000) {
      alert("Minimum deposit is UGX 5,000");
      return;
    }
    
    setDepositing(true);
    
    // TODO: Integrate with MarzPay payment gateway
    // For now, create a pending transaction
    const { error } = await supabase.from("transactions").insert({
      user_id: profile?.id,
      type: "deposit",
      amount: parseInt(depositAmount),
      currency: "UGX",
      description: "Deposit via Mobile Money",
      status: "pending",
      payment_method: "momo",
    });
    
    if (error) {
      alert("Error creating deposit request");
    } else {
      alert("Deposit request created! Please send payment to: +256 700 000 000\nReference: Your phone number");
      setShowDeposit(false);
      setDepositAmount("");
      // Refresh transactions
      const { data } = await supabase.from("transactions").select("*").eq("user_id", profile?.id).order("created_at", { ascending: false });
      setTransactions((data as Transaction[]) || []);
    }
    
    setDepositing(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {profile?.username || profile?.full_name || "User"}</h1>
              <p className="text-[var(--text-secondary)]">Manage your orders and balance</p>
            </div>
            <button
              onClick={() => setShowDeposit(true)}
              className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-black hover:opacity-90"
            >
              <Plus size={18} />
              Add Funds
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">Balance</span>
                <Wallet size={20} className="text-[var(--accent)]" />
              </div>
              <p className="text-2xl font-bold">UGX {(profile?.balance || 0).toLocaleString()}</p>
            </div>
            
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">Total Spent</span>
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold">UGX {(profile?.spent || 0).toLocaleString()}</p>
            </div>
            
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">Orders</span>
                <ShoppingCart size={20} className="text-blue-400" />
              </div>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            
            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--accent)]">Discount</span>
                <DollarSign size={20} className="text-[var(--accent)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--accent)]">{profile?.discount_percentage || 0}%</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => router.push("/services")}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 hover:border-[var(--accent)]"
            >
              <ShoppingCart size={16} />
              New Order
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 hover:border-[var(--accent)]"
            >
              <History size={16} />
              Order History
            </button>
          </div>

          {/* Recent Orders */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            
            {orders.length === 0 ? (
              <p className="text-center text-[var(--text-secondary)] py-8">No orders yet. Place your first order!</p>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
                    <div>
                      <p className="font-medium">{order.service?.name || "Service"}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{order.quantity} units • {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">UGX {order.price.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        order.status === "completed" ? "bg-green-500/10 text-green-400" :
                        order.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-blue-500/10 text-blue-400"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            
            {transactions.length === 0 ? (
              <p className="text-center text-[var(--text-secondary)] py-8">No transactions yet. Add funds to get started!</p>
            ) : (
              <div className="space-y-3">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      {tx.type === "deposit" ? (
                        <ArrowDownRight size={20} className="text-green-400" />
                      ) : (
                        <ArrowUpRight size={20} className="text-red-400" />
                      )}
                      <div>
                        <p className="font-medium">{tx.description || tx.type}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${tx.amount >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {tx.amount >= 0 ? "+" : ""}UGX {tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold mb-4">Add Funds</h2>
            
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (UGX)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="5000"
                  min="5000"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-3 px-4 focus:border-[var(--accent)] focus:outline-none"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">Minimum: UGX 5,000</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[5000, 10000, 50000, 100000, 500000, 1000000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDepositAmount(amount.toString())}
                    className="rounded-lg border border-[var(--border)] py-2 text-sm hover:border-[var(--accent)]"
                  >
                    UGX {amount.toLocaleString()}
                  </button>
                ))}
              </div>
              
              <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Payment Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-[var(--text-secondary)]">
                  <li>Send via MTN Mobile Money</li>
                  <li>Number: +256 700 000 000</li>
                  <li>Reference: Your phone number</li>
                  <li>Balance updates after confirmation</li>
                </ol>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeposit(false)}
                  className="flex-1 rounded-lg border border-[var(--border)] py-3 hover:bg-[var(--bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={depositing}
                  className="flex-1 rounded-lg bg-[var(--accent)] py-3 font-semibold text-black hover:opacity-90 disabled:opacity-50"
                >
                  {depositing ? "Processing..." : "Request Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </main>
  );
}
