"use client";

import { useEffect, useState } from "react";
import { Settings, Globe, DollarSign, Percent, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    site_name: "KAGUJJE Boost",
    site_tagline: "Uganda's #1 SMM Panel",
    default_currency: "USD",
    profit_margin_default: 20,
    min_deposit_usd: 5,
    referral_bonus_percent: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success) {
        setSettings(json.settings);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    const json = await res.json();
    if (json.success) {
      toast.success("Settings saved!");
    } else {
      toast.error(json.error || "Failed to save");
    }
    setSaving(false);
  }

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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings size={24} className="text-[var(--accent)]" />
            Site Settings
          </h1>
          <p className="text-[var(--text-secondary)]">Configure your SMM panel</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="mb-4 text-lg font-semibold">General</h2>
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            />
            <Input
              label="Site Tagline"
              value={settings.site_tagline}
              onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
            />
          </div>
        </div>

        {/* Currency & Pricing */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <DollarSign size={18} />
            Currency & Pricing
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-[var(--text-secondary)]">Default Currency</label>
              <select
                value={settings.default_currency}
                onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2.5"
              >
                <option value="USD">USD - US Dollar ($)</option>
                <option value="UGX">UGX - Ugandan Shilling (USh)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="KES">KES - Kenyan Shilling (KSh)</option>
              </select>
            </div>
            <Input
              label="Default Profit Margin (%)"
              type="number"
              value={settings.profit_margin_default}
              onChange={(e) => setSettings({ ...settings, profit_margin_default: parseInt(e.target.value) })}
            />
            <Input
              label="Minimum Deposit (USD)"
              type="number"
              value={settings.min_deposit_usd}
              onChange={(e) => setSettings({ ...settings, min_deposit_usd: parseInt(e.target.value) })}
            />
          </div>
        </div>

        {/* Referrals */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Referrals</h2>
          <div className="space-y-4">
            <Input
              label="Referral Bonus (%)"
              type="number"
              value={settings.referral_bonus_percent}
              onChange={(e) => setSettings({ ...settings, referral_bonus_percent: parseInt(e.target.value) })}
            />
            <p className="text-xs text-[var(--text-secondary)]">
              Percentage of referred user's first deposit given as bonus
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} size="lg">
          <Save size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
