"use client";

import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, Users, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const platforms = [
  { name: "Instagram", icon: "📷", color: "#E1306C" },
  { name: "TikTok", icon: "🎵", color: "#00f2ea" },
  { name: "YouTube", icon: "▶️", color: "#FF0000" },
  { name: "Twitter", icon: "🐦", color: "#1DA1F2" },
  { name: "Facebook", icon: "👤", color: "#4267B2" },
  { name: "Telegram", icon: "✈️", color: "#0088cc" },
  { name: "Spotify", icon: "🎧", color: "#1DB954" },
];

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--accent)]/5 blur-[150px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(201, 168, 76, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201, 168, 76, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[var(--accent)]/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 mx-auto max-w-5xl text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 mb-8 animate-fade-in">
          <Zap size={16} className="text-[var(--accent)]" />
          <span className="text-sm font-medium text-[var(--accent)]">Uganda's #1 SMM Panel</span>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          <span className="block text-white">Supercharge Your</span>
          <span className="gradient-text">Social Media Growth</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--text-secondary)] md:text-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Get real followers, views, likes and engagement for Instagram, TikTok, YouTube and more. 
          Fast delivery, affordable prices, 24/7 support.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/auth?signup=true"
            className="group flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[var(--accent)]/20"
          >
            Start Boosting
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/services"
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-8 py-4 text-lg font-semibold transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            View Services
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {[
            { icon: Users, value: "10K+", label: "Happy Clients" },
            { icon: TrendingUp, value: "1M+", label: "Orders Completed" },
            { icon: Heart, value: "99%", label: "Satisfaction Rate" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon size={24} className="mx-auto mb-2 text-[var(--accent)]" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Platform Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm transition-all hover:border-[var(--accent)]/50"
            >
              <span>{platform.icon}</span>
              <span className="text-[var(--text-secondary)]">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[var(--text-secondary)]/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
