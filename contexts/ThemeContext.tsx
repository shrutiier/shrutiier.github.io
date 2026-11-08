"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const STORAGE_KEY = "theme";

/**
 * Runs inline in <head>, before the page paints, so a visitor who picked light mode
 * never sees a flash of the dark page first. Dark is the default; only an explicit
 * choice saved by the footer toggle switches it.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light")t="dark";var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);}catch(e){document.documentElement.classList.add("dark");}})();`;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The inline script has already set the class by the time this runs; start dark to
  // match the server render, then pick up whatever the script chose.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next: Theme = root.classList.contains("light") ? "dark" : "light";

    const swap = () => {
      root.classList.remove("light", "dark");
      root.classList.add(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private mode or blocked storage: the switch still works for this visit.
      }
      setTheme(next);
    };

    // Crossfade where the browser supports view transitions; switch instantly otherwise,
    // and for anyone who has asked for reduced motion.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof document.startViewTransition !== "function") swap();
    else document.startViewTransition(swap);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
