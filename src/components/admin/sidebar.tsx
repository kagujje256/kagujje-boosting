"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Package, ShoppingCart, Wallet, Ticket, 
  Settings, LogOut, ExternalLink, Server, Globe, Users, TrendingUp, Palette
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const navItems = [
  { href: "/kaggu/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kaggu/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/kaggu/providers", label: "Providers", icon: Server },
  { href: "/kaggu/services", label: "Services", icon: Package },
  { href: "/kaggu/orders", label: "Orders", icon: ShoppingCart },
  { href: "/kaggu/users", label: "Users", icon: Users },
  { href: "/kaggu/appearance", label: "Appearance", icon: Palette },
  { href: "/kaggu/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, colorTheme, toggleTheme, setColorTheme, glassyMode, toggleGlassyMode } = useTheme();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Logged out");
    router.push("/auth");
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-5">
        <span className="font-['Playfair_Display'] text-xl font-bold text-[var(--accent)]">
          KAGUJJE
        </span>
        <span className="rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme Quick Settings */}
      <div className="border-t border-[var(--border)] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">Theme</span>
          <button
            onClick={toggleTheme}
            className="rounded-full p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">Glassy Mode</span>
          <button
            onClick={toggleGlassyMode}
            className={`rounded-full p-1.5 transition-all ${
              glassyMode 
                ? "bg-[var(--accent)] text-black" 
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            ✨
          </button>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {["gold", "blue", "green", "purple", "orange", "pink", "cyan"].map((color) => (
            <button
              key={color}
              onClick={() => setColorTheme(color as any)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                colorTheme === color ? "border-white scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: getColorValue(color) }}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1 border-t border-[var(--border)] p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          <ExternalLink size={18} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-400/10"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    gold: "#c9a84c",
    blue: "#3b82f6",
    green: "#22c55e",
    purple: "#a855f7",
    orange: "#f97316",
    pink: "#ec4899",
    cyan: "#06b6d4",
  };
  return colors[color] || "#c9a84c";
}