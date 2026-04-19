"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Search, Filter, ShoppingCart, Zap } from "lucide-react";
import type { Service, Category } from "@/lib/types";

function ServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const [servicesRes, categoriesRes] = await Promise.all([
        supabase.from("services").select("*, category:categories(*)").eq("is_visible", true).order("is_featured", { ascending: false }),
        supabase.from("categories").select("*").eq("is_visible", true).order("display_order"),
      ]);
      
      setServices((servicesRes.data as Service[]) || []);
      setCategories((categoriesRes.data as Category[]) || []);
      setLoading(false);
      
      const cat = searchParams.get("category");
      if (cat) setSelectedCategory(cat);
    }
    loadData();
  }, []);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || s.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Choose from hundreds of social media marketing services. All prices in UGX.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-3 pl-10 pr-4 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-3 pl-10 pr-8 focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === "all"
                  ? "bg-[var(--accent)] text-black"
                  : "border border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-[var(--accent)] text-black"
                    : "border border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart size={48} className="mx-auto mb-4 text-[var(--text-secondary)]/30" />
              <p className="text-[var(--text-secondary)]">No services found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 transition-all hover:border-[var(--accent)]/50"
                >
                  {service.is_featured && (
                    <div className="flex items-center gap-1 text-[var(--accent)] text-xs font-medium mb-2">
                      <Zap size={12} />
                      FEATURED
                    </div>
                  )}
                  
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  
                  {service.category && (
                    <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                      {service.category.name}
                    </span>
                  )}
                  
                  <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[var(--accent)]">
                        UGX {service.price_per_unit.toLocaleString()}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">/unit</span>
                    </div>
                    
                    <div className="text-xs text-[var(--text-secondary)]">
                      Min: {service.min_order} | Max: {service.max_order}
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 rounded-lg bg-[var(--accent)] py-2 text-sm font-medium text-black hover:opacity-90 transition-opacity">
                    Order Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-32">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
    </div>}>
      <ServicesContent />
    </Suspense>
  );
}
