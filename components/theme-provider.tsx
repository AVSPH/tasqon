"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

const THEME_CLASSES = ["theme-mist", "theme-linen", "theme-dark"] as const;

export function ThemeProvider() {
  const theme = useAppStore((s) => s.preferences.theme);

  useEffect(() => {
    const root = document.documentElement;
    THEME_CLASSES.forEach((cls) => root.classList.remove(cls));
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return null;
}