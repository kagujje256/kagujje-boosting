"use client";

import Link from "next/link";
import { Zap, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)] text-black font-bold">
                <Zap size={20} />
              </div>
              <span className="font-['Playfair_Display'] text-xl font-bold">
                <span className="text-[var(--accent)]">KAGUJJE</span>
                <span className="text-sm text-[var(--text-secondary)] ml-1">Boost</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Uganda's #1 SMM Panel. Supercharge your social media growth with real engagement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link href="/services" className="hover:text-[var(--accent)]">Services</Link></li>
              <li><Link href="/api" className="hover:text-[var(--accent)]">API Documentation</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--accent)]">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--accent)]">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link href="/tickets" className="hover:text-[var(--accent)]">Open Ticket</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--accent)]">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--accent)]">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--accent)]" />
                support@kagujje.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[var(--accent)]" />
                Kampala, Uganda
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} KAGUJJE Boosting. All rights reserved.
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Built with ❤️ in Uganda
          </p>
        </div>
      </div>
    </footer>
  );
}
