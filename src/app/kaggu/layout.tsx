"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Suspense fallback={<div className="w-64 bg-[var(--bg-secondary)]" />}>
          <AdminSidebar />
        </Suspense>
        <main className="flex-1 pl-64">
          <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}