"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Switches between the dark and light themes. Drawn like the music note in the
 * last-played line: a small lucide glyph in the soft accent, lifting to the full
 * accent on hover. It shows the theme you'd switch to.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "light" ? "dark" : "light";
  const Icon = next === "light" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="rounded-lg px-1.5 py-1 text-accent-muted transition-colors hover:text-accent"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
