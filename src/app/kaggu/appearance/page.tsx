"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Sun, Moon, Sparkles, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const colorOptions = [
  { id: "gold", name: "Gold", color: "#c9a84c", description: "Elegant and luxurious" },
  { id: "blue", name: "Blue", color: "#3b82f6", description: "Professional and trustworthy" },
  { id: "green", name: "Green", color: "#22c55e", description: "Fresh and natural" },
  { id: "purple", name: "Purple", color: "#a855f7", description: "Creative and innovative" },
  { id: "orange", name: "Orange", color: "#f97316", description: "Energetic and vibrant" },
  { id: "pink", name: "Pink", color: "#ec4899", description: "Playful and modern" },
  { id: "cyan", name: "Cyan", color: "#06b6d4", description: "Clean and tech-forward" },
];

export default function AppearancePage() {
  const { theme, colorTheme, glassyMode, toggleTheme, setColorTheme, toggleGlassyMode } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Appearance</h1>
        <p className="text-[var(--text-secondary)]">Customize the look and feel of your website</p>
      </div>

      {/* Theme Mode */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Theme Mode</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => theme !== "dark" && toggleTheme()}
            className={`flex items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all ${
              theme === "dark"
                ? "border-[var(--accent)] bg-[var(--accent)]/10"
                : "border-[var(--border)] hover:border-[var(--accent)]/50"
            }`}
          >
            <Moon size={24} className={theme === "dark" ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"} />
            <div className="text-left">
              <p className="font-semibold">Dark Mode</p>
              <p className="text-sm text-[var(--text-secondary)]">Classic dark theme</p>
            </div>
            {theme === "dark" && <Check size={20} className="ml-auto text-[var(--accent)]" />}
          </button>

          <button
            onClick={() => theme !== "light" && toggleTheme()}
            className={`flex items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all ${
              theme === "light"
                ? "border-[var(--accent)] bg-[var(--accent)]/10"
                : "border-[var(--border)] hover:border-[var(--accent)]/50"
            }`}
          >
            <Sun size={24} className={theme === "light" ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"} />
            <div className="text-left">
              <p className="font-semibold">Light Mode</p>
              <p className="text-sm text-[var(--text-secondary)]">Bright and clean</p>
            </div>
            {theme === "light" && <Check size={20} className="ml-auto text-[var(--accent)]" />}
          </button>
        </div>
      </div>

      {/* Glassy Mode */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent)]/10">
              <Sparkles size={24} className="text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Glassy Mode</h2>
              <p className="text-[var(--text-secondary)]">Add beautiful glassmorphism effects like Zo Computer</p>
            </div>
          </div>
          <button
            onClick={toggleGlassyMode}
            className={`relative h-8 w-14 rounded-full transition-colors ${
              glassyMode ? "bg-[var(--accent)]" : "bg-[var(--bg-tertiary)]"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                glassyMode ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
        
        {glassyMode && (
          <div className="mt-4 rounded-lg bg-[var(--accent)]/10 p-4">
            <p className="text-sm text-[var(--accent)]">
              ✨ Glassy mode is active! Your site now has beautiful frosted glass effects with blur and transparency.
            </p>
          </div>
        )}
      </div>

      {/* Color Theme */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette size={20} className="text-[var(--accent)]" />
          <h2 className="text-lg font-semibold">Accent Color</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colorOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setColorTheme(option.id as any)}
              className={`relative flex flex-col items-center rounded-xl border-2 p-4 transition-all hover:scale-105 ${
                colorTheme === option.id
                  ? "border-[var(--accent)] shadow-lg"
                  : "border-[var(--border)] hover:border-[var(--accent)]/50"
              }`}
            >
              <div
                className="h-12 w-12 rounded-full shadow-lg"
                style={{ backgroundColor: option.color }}
              />
              <p className="mt-2 font-semibold">{option.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{option.description}</p>
              {colorTheme === option.id && (
                <div className="absolute top-2 right-2">
                  <Check size={16} className="text-[var(--accent)]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Preview</h2>
        <div className={`rounded-xl p-6 ${glassyMode ? "glass-card" : "bg-[var(--bg-tertiary)]"}`}>
          <h3 className="text-xl font-bold mb-2">Your Website Title</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            This is how your website will look with the current settings.
          </p>
          <div className="flex gap-3">
            <button className="rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold text-black">
              Primary Button
            </button>
            <button className="rounded-lg border border-[var(--border)] px-4 py-2">
              Secondary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}