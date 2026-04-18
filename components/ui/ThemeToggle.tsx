"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("archlink-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("archlink-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("archlink-theme", "light");
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: "50%",
        background: dark ? "#3A2E28" : "#EDE0CC",
        border: "1px solid var(--border)",
        cursor: "pointer", transition: "all 0.3s",
        color: dark ? "#EDE0CC" : "#210706",
      }}
    >
      {dark ? <Sun size={15} color="#C0413E" /> : <Moon size={15} />}
    </button>
  );
}
