"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/components/LangProvider/LangProvider";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { t } = useLang();
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={t.theme.toggle}
      title={theme === "dark" ? t.theme.toLight : t.theme.toDark}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}