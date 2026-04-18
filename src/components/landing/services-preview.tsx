"use client";

import Link from "next/link";
import type { Service, Category } from "@/lib/types";
import { ArrowRight, TrendingUp, Users, Heart, Eye, ThumbsUp, Music } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  instagram: TrendingUp,
  tiktok: Music,
  youtube: Eye,
  twitter: Heart,
  facebook: Users,
  telegram: ArrowRight,
  spotify: Music,
};

interface Props {
  services: Service[];
  categories: Category[];
}

export function ServicesPreview({ services, categories }: Props) {
  return (
    <section id="services" className="bg-[var(--bg-secondary)] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Popular <span className="text-[var(--accent)]">Services</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            High-quality social media services at unbeatable prices
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || TrendingUp;
            return (
              <button
                key={cat.id}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-2 text-sm font-medium transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Icon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="group animate-fade-in rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-lg hover:shadow-[var(--accent)]/5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
                  {service.category?.name || "Service"}
                </span>
                {service.is_featured && (
                  <span className="text-xs text-[var(--accent)]">★ Featured</span>
                )}
              </div>

              <h3 className="mb-2 font-semibold transition-colors group-hover:text-[var(--accent)]">
                {service.name}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-[var(--text-secondary)]">
                {service.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-[var(--accent)]">
                    ${service.price_per_unit.toFixed(4)}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">/unit</span>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">
                  {service.min_order.toLocaleString()} - {service.max_order.toLocaleString()}
                </span>
              </div>

              <Link
                href={`/order/${service.id}`}
                className="mt-4 block w-full rounded-lg bg-[var(--accent)] py-2 text-center font-medium text-black opacity-0 transition-all group-hover:opacity-100"
              >
                Order Now
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
          >
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
