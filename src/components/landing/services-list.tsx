"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service, Category } from "@/lib/types";
import { Search, ChevronDown } from "lucide-react";

interface Props {
  services: Service[];
  categories: Category[];
}

export function ServicesList({ services, categories }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || service.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Group services by category
  const servicesByCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = filteredServices.filter(s => s.category_id === cat.id);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-4 font-semibold">Categories</h3>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pl-12 pr-4 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile Categories */}
        <div className="mb-6 lg:hidden">
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] py-3 px-4"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Services by Category */}
        {categories.map((cat) => {
          const catServices = servicesByCategory[cat.id] || [];
          if (catServices.length === 0) return null;

          return (
            <div key={cat.id} className="mb-8">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 mb-4"
              >
                <span className="font-semibold">{cat.name}</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {catServices.length} services
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${openCategories.includes(cat.id) ? 'rotate-180' : ''}`}
                />
              </button>

              {(openCategories.includes(cat.id) || selectedCategory) && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-left text-sm text-[var(--text-secondary)]">
                        <th className="pb-3 font-medium">Service</th>
                        <th className="pb-3 font-medium">Price / 1K</th>
                        <th className="pb-3 font-medium">Min - Max</th>
                        <th className="pb-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {catServices.map((service) => (
                        <tr
                          key={service.id}
                          className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-secondary)]"
                        >
                          <td className="py-4">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              {service.description && (
                                <div className="mt-1 line-clamp-1 text-sm text-[var(--text-secondary)]">
                                  {service.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="font-semibold text-[var(--accent)]">
                              ${(service.price_per_unit * 1000).toFixed(4)}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-[var(--text-secondary)]">
                            {service.min_order.toLocaleString()} - {service.max_order.toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <Link
                              href={`/order/${service.id}`}
                              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:opacity-90"
                            >
                              Order
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {filteredServices.length === 0 && (
          <div className="py-12 text-center text-[var(--text-secondary)]">
            No services found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
