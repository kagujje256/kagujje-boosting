"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/features", label: "Features" },
    { href: "/api-docs", label: "API" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)] text-black font-bold">
            <Zap size={24} />
          </div>
          <span className="text-xl font-bold">KAGUJJE<span className="text-[var(--accent)]">Boost</span></span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="glass-button rounded-full p-2 text-[var(--text-secondary)] transition-all hover:text-[var(--accent)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link
            href="/auth"
            className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Sign In
          </Link>
          <Link
            href="/auth?signup=true"
            className="glass-button rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black transition-all hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
