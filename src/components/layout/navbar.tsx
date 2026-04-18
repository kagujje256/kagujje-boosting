"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, User, LogIn } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile } = useSupabase();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/#features", label: "Features" },
    { href: "/api", label: "API" },
  ];

  return (
    <nav className="glass fixed top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)] text-black font-bold">
            <Zap size={20} />
          </div>
          <span className="font-['Playfair_Display'] text-xl font-bold">
            <span className="text-[var(--accent)]">KAGUJJE</span>
            <span className="text-sm text-[var(--text-secondary)] ml-1">Boost</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--accent)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link href="/orders" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
                Orders
              </Link>
              <Link href="/add-funds" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
                ${profile?.balance?.toFixed(2) || "0.00"}
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
                <User size={16} />
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
                <LogIn size={16} />
                Sign In
              </Link>
              <Link href="/auth?signup=true" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-[var(--text-secondary)] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-[var(--border)] p-4">
            {user ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block w-full rounded-lg bg-[var(--accent)] px-4 py-3 text-center font-semibold text-black">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth" onClick={() => setOpen(false)} className="block w-full rounded-lg bg-[var(--accent)] px-4 py-3 text-center font-semibold text-black">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
