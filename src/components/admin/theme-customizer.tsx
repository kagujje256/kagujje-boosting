"use client";

import { useTheme, colorThemes, type ColorTheme } from "@/lib/theme-context";
import { Palette, Check } from "lucide-react";

const themeColors: { name: ColorTheme; label: string }[] = [
  { name: "gold", label: "Gold" },
  { name: "blue", label: "Blue" },
  { name: "green", label: "Green" },
  { name: "purple", label: "Purple" },
  { name: "orange", label: "Orange" },
  { name: "pink", label: "Pink" },
  { name: "cyan", label: "Cyan" },
];

export function ThemeCustomizer() {
  const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="text-[var(--accent)]" size={20} />
        <h2 className="text-lg font-semibold">Theme Settings</h2>
      </div>

      {/* Light/Dark Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Appearance</label>
        <div className="flex gap-2">
          <button
            onClick={() => theme === "light" && toggleTheme()}
            className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
              theme === "dark"
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
            }`}
          >
            🌙 Dark
          </button>
          <button
            onClick={() => theme === "dark" && toggleTheme()}
            className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
              theme === "light"
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
            }`}
          >
            ☀️ Light
          </button>
        </div>
      </div>

      {/* Color Theme */}
      <div>
        <label className="block text-sm font-medium mb-3">Accent Color</label>
        <div className="grid grid-cols-4 gap-2">
          {themeColors.map((color) => {
            const colors = colorThemes[color.name];
            const isSelected = colorTheme === color.name;
            
            return (
              <button
                key={color.name}
                onClick={() => setColorTheme(color.name)}
                className={`relative flex items-center justify-center rounded-lg border p-3 transition-all ${
                  isSelected
                    ? "border-2 border-[var(--accent)] scale-105"
                    : "border-[var(--border)] hover:border-[var(--accent)]/50"
                }`}
              >
                <div
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: colors.accent }}
                />
                {isSelected && (
                  <Check
                    size={14}
                    className="absolute -top-1 -right-1 text-[var(--accent)]"
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          Selected: {themeColors.find((c) => c.name === colorTheme)?.label}
        </p>
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
        <p className="text-sm text-[var(--text-secondary)] mb-2">Preview</p>
        <div className="flex gap-2">
          <button className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black">
            Primary Button
          </button>
          <button className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)]">
            Secondary
          </button>
        </div>
      </div>
    </div>
  );
}
