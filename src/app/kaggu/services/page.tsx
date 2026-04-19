"use client";

import { useEffect, useState } from "react";
import { Search, Package, DollarSign, Percent, Eye, EyeOff, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import type { Service, Category } from "@/lib/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/kaggu/services");
      const json = await res.json();
      if (json.success) {
        setServices(json.services);
        setCategories(json.categories);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function updateService(service: Service, updates: Partial<Service>) {
    setSaving(service.id);
    const res = await fetch("/api/kaggu/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: service.id, ...updates })
    });
    const json = await res.json();
    if (json.success) {
      setServices(services.map(s => s.id === service.id ? { ...s, ...updates } : s));
      toast.success("Service updated");
    } else {
      toast.error(json.error || "Failed to update");
    }
    setSaving(null);
  }

  async function syncFromProvider() {
    toast.loading("Syncing services from providers...");
    const res = await fetch("/api/kaggu/providers/sync", { method: "POST" });
    const json = await res.json();
    toast.dismiss();
    if (json.success) {
      toast.success(`Synced: ${json.added} added, ${json.updated} updated`);
      setServices(json.services || services);
    } else {
      toast.error(json.error || "Sync failed");
    }
  }

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || s.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-[var(--text-secondary)]">{services.length} services available</p>
        </div>
        <Button onClick={syncFromProvider}>
          <RefreshCw size={16} className="mr-2" />
          Sync from Providers
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-2 pl-10 pr-4"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full">
          <thead className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Min/Max</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Price/1k</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Cost/1k</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Profit %</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Currency</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredServices.map((service) => (
              <tr key={service.id} className="hover:bg-[var(--bg-secondary)]">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{service.description}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {service.min_order} - {service.max_order}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.0001"
                    value={service.price_per_unit * 1000}
                    onChange={(e) => updateService(service, { price_per_unit: parseFloat(e.target.value) / 1000 })}
                    className="w-24 rounded border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm"
                    disabled={saving === service.id}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.0001"
                    value={(service.cost_price || 0) * 1000}
                    onChange={(e) => updateService(service, { cost_price: parseFloat(e.target.value) / 1000 })}
                    className="w-24 rounded border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm"
                    disabled={saving === service.id}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={service.profit_percent || 20}
                      onChange={(e) => updateService(service, { profit_percent: parseFloat(e.target.value) })}
                      className="w-16 rounded border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm"
                      disabled={saving === service.id}
                    />
                    <span className="text-[var(--text-secondary)]">%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={service.currency || 'USD'}
                    onChange={(e) => updateService(service, { currency: e.target.value })}
                    className="rounded border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm"
                    disabled={saving === service.id}
                  >
                    <option value="USD">USD</option>
                    <option value="UGX">UGX</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="KES">KES</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => updateService(service, { is_active: !service.is_active })}
                    className={`rounded-full px-2 py-1 text-xs ${service.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
                  >
                    {service.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => updateService(service, { is_active: !service.is_active })}>
                    {service.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
