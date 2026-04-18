"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type ColorTheme = "gold" | "blue" | "green" | "purple" | "orange" | "pink" | "cyan";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (color: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorThemes: Record<ColorTheme, { accent: string; accentHover: string }> = {
  gold: { accent: "#c9a84c", accentHover: "#d4b85c" },
  blue: { accent: "#3b82f6", accentHover: "#60a5fa" },
  green: { accent: "#22c55e", accentHover: "#4ade80" },
  purple: { accent: "#a855f7", accentHover: "#c084fc" },
  orange: { accent: "#f97316", accentHover: "#fb923c" },
  pink: { accent: "#ec4899", accentHover: "#f472b6" },
  cyan: { accent: "#06b6d4", accentHover: "#22d3ee" },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("gold");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedColor = localStorage.getItem("colorTheme") as ColorTheme | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setColorThemeState(savedColor);
  }, []);

  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Apply color theme
    const colors = colorThemes[colorTheme];
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-hover", colors.accentHover);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorTheme", colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const setColorTheme = (color: ColorTheme) => {
    setColorThemeState(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, toggleTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export { colorThemes };
export type { ColorTheme };
