"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Users, Search, DollarSign, TrendingUp, UserCog } from "lucide-react";
import type { Profile } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers((data as Profile[]) || []);
    setLoading(false);
  }

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-[var(--text-secondary)]">{users.length} total users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-blue-400" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Users</p>
              <p className="text-xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center gap-3">
            <DollarSign size={20} className="text-green-400" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Balance</p>
              <p className="text-xl font-bold">
                ${users.reduce((sum, u) => sum + (u.balance || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-[var(--accent)]" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Spent</p>
              <p className="text-xl font-bold">
                ${users.reduce((sum, u) => sum + (u.spent || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-2 pl-10 pr-4"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-4 py-3 text-left text-sm">User</th>
              <th className="px-4 py-3 text-left text-sm">Role</th>
              <th className="px-4 py-3 text-left text-sm">Balance</th>
              <th className="px-4 py-3 text-left text-sm">Spent</th>
              <th className="px-4 py-3 text-left text-sm">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold">
                      {(user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.username || "N/A"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${user.role === "admin" ? "badge-accent" : "badge-info"}`}>
                    {user.role || "user"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-400">
                  ${(user.balance || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                  ${(user.spent || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}