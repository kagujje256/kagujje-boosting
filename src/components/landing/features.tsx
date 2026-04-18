"use client";

import { Zap, Shield, Clock, Headphones, CreditCard, Rocket } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Orders start processing within minutes. Fast and reliable service.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "No password required. Your account safety is our priority.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our team is always available to help you with any issues.",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Multiple payment methods including Mobile Money and cards.",
  },
  {
    icon: Rocket,
    title: "High Quality",
    description: "Real accounts with profile pictures and activity.",
  },
  {
    icon: Headphones,
    title: "API Access",
    description: "Integrate with our API for automated ordering.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Why Choose <span className="text-[var(--accent)]">KAGUJJE</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Trusted by thousands of content creators and businesses across Africa
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group animate-fade-in rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-all duration-300 hover:border-[var(--accent)]/50"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] transition-transform group-hover:scale-110">
                <feature.icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
