"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, RefreshCw, Trash2, Edit, Check, X, 
  Server, DollarSign, Activity, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Provider {
  id: string;
  name: string;
  slug: string;
  api_url: string;
  api_key: string;
  currency: string;
  balance: number;
  is_active: boolean;
  is_default: boolean;
  priority: number;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: "",
    slug: "",
    api_url: "",
    api_key: "",
    is_default: false,
  });
  const router = useRouter();

  async function loadProviders() {
    setLoading(true);
    try {
      const res = await fetch("/api/kaggu/providers");
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (error) {
      toast.error("Failed to load providers");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProviders();
  }, []);

  async function testConnection(providerId: string) {
    setTesting(providerId);
    try {
      const res = await fetch(`/api/kaggu/providers/sync?providerId=${providerId}`);
      const data = await res.json();
      
      if (data.status === 'connected') {
        toast.success(`✅ Connected! Balance: $${data.balance} | ${data.servicesCount} services`);
      } else {
        toast.error(`❌ ${data.error}`);
      }
    } catch (error) {
      toast.error("Connection test failed");
    }
    setTesting(null);
  }

  async function syncServices(providerId: string) {
    setSyncing(providerId);
    try {
      const res = await fetch("/api/kaggu/providers/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Synced! Added: ${data.stats.added}, Updated: ${data.stats.updated}`);
        router.refresh();
      } else {
        toast.error(data.error || "Sync failed");
      }
    } catch (error) {
      toast.error("Sync failed");
    }
    setSyncing(null);
  }

  async function addProvider(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/kaggu/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProvider),
      });
      const data = await res.json();
      
      if (data.provider) {
        toast.success("Provider added!");
        setShowAddForm(false);
        setNewProvider({ name: "", slug: "", api_url: "", api_key: "", is_default: false });
        loadProviders();
      } else {
        toast.error(data.error || "Failed to add provider");
      }
    } catch (error) {
      toast.error("Failed to add provider");
    }
  }

  async function toggleActive(provider: Provider) {
    try {
      await fetch("/api/kaggu/providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: provider.id, is_active: !provider.is_active }),
      });
      toast.success(provider.is_active ? "Disabled" : "Enabled");
      loadProviders();
    } catch (error) {
      toast.error("Failed to update");
    }
  }

  async function deleteProvider(id: string) {
    if (!confirm("Delete this provider? Associated services will remain.")) return;
    
    try {
      await fetch("/api/kaggu/providers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      toast.success("Provider deleted");
      loadProviders();
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Providers</h1>
          <p className="text-[var(--text-secondary)]">Manage your SMM service providers</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} className="mr-2" /> Add Provider
        </Button>
      </div>

      {/* Add Provider Form */}
      {showAddForm && (
        <div className="mb-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-secondary)] p-6">
          <h3 className="mb-4 text-lg font-semibold">Add New Provider</h3>
          <form onSubmit={addProvider} className="grid gap-4 md:grid-cols-2">
            <Input
              label="Provider Name"
              placeholder="e.g., MrGoViral"
              value={newProvider.name}
              onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
              required
            />
            <Input
              label="Slug"
              placeholder="e.g., mrgoviral"
              value={newProvider.slug}
              onChange={(e) => setNewProvider({ ...newProvider, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              required
            />
            <Input
              label="API URL"
              placeholder="https://example.com/api/v2"
              value={newProvider.api_url}
              onChange={(e) => setNewProvider({ ...newProvider, api_url: e.target.value })}
              required
            />
            <Input
              label="API Key"
              placeholder="your-api-key"
              value={newProvider.api_key}
              onChange={(e) => setNewProvider({ ...newProvider, api_key: e.target.value })}
              required
            />
            <div className="md:col-span-2 flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProvider.is_default}
                  onChange={(e) => setNewProvider({ ...newProvider, is_default: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm">Set as default provider</span>
              </label>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Provider</Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Providers List */}
      {providers.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center">
          <Server size={48} className="mx-auto mb-4 text-[var(--text-secondary)]/40" />
          <p className="text-[var(--text-secondary)]">No providers added yet. Add your first SMM provider.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className={`rounded-xl border bg-[var(--bg-secondary)] p-5 transition-all ${
                provider.is_active ? 'border-[var(--border)]' : 'border-red-500/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    {provider.is_default && (
                      <span className="rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-xs text-[var(--accent)]">
                        Default
                      </span>
                    )}
                    {!provider.is_active && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                        Disabled
                      </span>
                    )}
                  </div>
                  
                  <div className="grid gap-2 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <Server size={14} />
                      <span className="truncate">{provider.api_url}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <DollarSign size={14} />
                        Balance: <span className="text-[var(--accent)] font-medium">${provider.balance.toFixed(2)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity size={14} />
                        {provider.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => testConnection(provider.id)}
                    loading={testing === provider.id}
                  >
                    Test
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => syncServices(provider.id)}
                    loading={syncing === provider.id}
                  >
                    <RefreshCw size={14} className="mr-1" /> Sync
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(provider)}
                  >
                    {provider.is_active ? <X size={16} /> : <Check size={16} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-400/10"
                    onClick={() => deleteProvider(provider.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <AlertCircle size={18} className="text-[var(--accent)]" />
          How to Add a Provider
        </h3>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p>1. <strong>Get API credentials</strong> from your SMM provider (usually found in your account settings)</p>
          <p>2. <strong>Click "Add Provider"</strong> and enter the API URL and Key</p>
          <p>3. <strong>Test connection</strong> to verify credentials work</p>
          <p>4. <strong>Click "Sync"</strong> to import all services from the provider</p>
          <p>5. <strong>Set prices</strong> - Services will have provider rates, adjust your markup</p>
        </div>
      </div>
    </div>
  );
}
