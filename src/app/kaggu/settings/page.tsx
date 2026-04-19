"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Save, Server, Percent, DollarSign, Eye, EyeOff } from "lucide-react";

interface Settings {
  profit_percentage: string;
  currency: string;
  provider: string;
  provider_api_url: string;
}

interface Provider {
  id: string;
  name: string;
  api_url: string;
  api_key: string;
  is_active: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    profit_percentage: "80",
    currency: "USD",
    provider: "mrgoviral",
    provider_api_url: "https://mrgoviral.com/api/v2",
  });
  const [provider, setProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    // Load settings
    const { data: settingsData } = await supabase
      .from("settings")
      .select("*");
    
    if (settingsData) {
      const settingsMap: Record<string, string> = {};
      settingsData.forEach((s: any) => {
        settingsMap[s.key] = s.value;
      });
      setSettings({
        profit_percentage: settingsMap.profit_percentage || "80",
        currency: settingsMap.currency || "USD",
        provider: settingsMap.provider || "mrgoviral",
        provider_api_url: settingsMap.provider_api_url || "https://mrgoviral.com/api/v2",
      });
    }

    // Load provider config
    const { data: providerData } = await supabase
      .from("provider_configs")
      .select("*")
      .eq("name", "mrgoviral")
      .single();
    
    if (providerData) {
      setProvider(providerData as Provider);
      setApiKey((providerData as Provider).api_key);
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    
    // Save general settings
    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from("settings")
        .upsert({ key, value }, { onConflict: "key" });
    }

    // Save provider API key
    if (provider) {
      await supabase
        .from("provider_configs")
        .update({ api_key: apiKey, is_active: true })
        .eq("id", provider.id);
    } else {
      await supabase
        .from("provider_configs")
        .insert({
          name: "mrgoviral",
          api_url: settings.provider_api_url,
          api_key: apiKey,
          is_active: true,
        });
    }

    toast.success("Settings saved!");
    setSaving(false);
  }

  async function testProviderConnection() {
    if (!apiKey) {
      toast.error("Please enter your API key first");
      return;
    }

    try {
      const response = await fetch("/api/admin/test-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_url: settings.provider_api_url,
          api_key: apiKey,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`✅ Connected! Balance: ${data.balance} ${data.currency}`);
      } else {
        toast.error(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      toast.error("Connection failed. Check your API key.");
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-2 border-[var(--accent)] border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--text-secondary)]">Configure your SMM panel settings</p>
      </div>

      {/* Provider Configuration */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Server size={24} className="text-[var(--accent)]" />
          <h2 className="text-lg font-semibold">Provider Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Provider Name</label>
            <Input
              value={settings.provider}
              onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
              placeholder="mrgoviral"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API URL</label>
            <Input
              value={settings.provider_api_url}
              onChange={(e) => setSettings({ ...settings, provider_api_url: e.target.value })}
              placeholder="https://mrgoviral.com/api/v2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your mrgoviral API key"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Get your API key from: <a href="https://mrgoviral.com" target="_blank" className="text-[var(--accent)] hover:underline">mrgoviral.com</a>
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={testProviderConnection}
            className="w-full"
          >
            Test Connection
          </Button>
        </div>
      </div>

      {/* Profit Settings */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Percent size={24} className="text-green-400" />
          <h2 className="text-lg font-semibold">Profit Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Default Profit Margin (%)</label>
            <Input
              type="number"
              value={settings.profit_percentage}
              onChange={(e) => setSettings({ ...settings, profit_percentage: e.target.value })}
              placeholder="80"
              min="0"
              max="500"
            />
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Example: 80% profit means if cost is $0.50, you sell at $0.90
            </p>
          </div>

          <div className="rounded-lg bg-[var(--bg-tertiary)] p-4">
            <p className="text-sm font-medium mb-2">Profit Calculator</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Cost Price</p>
                <p className="text-lg">$0.50</p>
              </div>
              <div className="text-2xl">→</div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Sell Price</p>
                <p className="text-lg text-green-400">
                  ${(0.50 * (1 + parseInt(settings.profit_percentage) / 100)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Profit</p>
                <p className="text-lg text-[var(--accent)]">
                  ${(0.50 * parseInt(settings.profit_percentage) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign size={24} className="text-blue-400" />
          <h2 className="text-lg font-semibold">Currency Settings</h2>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Default Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2.5"
          >
            <option value="USD">USD ($)</option>
            <option value="UGX">UGX (USh)</option>
            <option value="KES">KES (KSh)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} loading={saving} size="lg">
          <Save size={18} className="mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
