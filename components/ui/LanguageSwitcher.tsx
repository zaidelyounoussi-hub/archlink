"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "https://flagcdn.com/w20/gb.png" },
  { code: "fr", label: "Francais", flag: "https://flagcdn.com/w20/fr.png" },
  { code: "ar", label: "Arabic", flag: "https://flagcdn.com/w20/ma.png" },
  { code: "es", label: "Espanol", flag: "https://flagcdn.com/w20/es.png" },
  { code: "de", label: "Deutsch", flag: "https://flagcdn.com/w20/de.png" },
];

export function LanguageSwitcher({ dark }: { dark?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("archlink-lang") || "en";
    const idx = LANGUAGES.findIndex(l => l.code === saved);
    if (idx >= 0) setCurrent(idx);

    if (!document.getElementById("gt-element")) {
      const el = document.createElement("div");
      el.id = "gt-element";
      el.style.display = "none";
      document.body.appendChild(el);
    }

    if (!document.getElementById("gt-script")) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: "en",
          autoDisplay: false,
        }, "gt-element");
      };
      const script = document.createElement("script");
      script.id = "gt-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    if (saved !== "en") {
      const apply = () => {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (select) {
          select.value = saved;
          select.dispatchEvent(new Event("change"));
        } else {
          setTimeout(apply, 500);
        }
      };
      setTimeout(apply, 1500);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) return null;

  const lang = LANGUAGES[current];
  const borderColor = dark ? "rgba(241,230,210,0.25)" : "#DDD0BC";
  const textColor = dark ? "rgba(241,230,210,0.7)" : "#7A6A6A";

  const select = (idx: number) => {
    const code = LANGUAGES[idx].code;
    setCurrent(idx);
    localStorage.setItem("archlink-lang", code);
    setOpen(false);

    const gtSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (gtSelect) {
      gtSelect.value = code;
      gtSelect.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "transparent", border: "1px solid " + borderColor,
          padding: "5px 8px", cursor: "pointer",
          color: textColor,
        }}
      >
        <img src={lang.flag} alt={lang.label} style={{ width: 22, height: 15, objectFit: "cover", borderRadius: 2 }} />
        <ChevronDown size={11} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: dark ? "#210706" : "white",
          border: "1px solid " + borderColor,
          boxShadow: "0 8px 24px rgba(33,7,6,0.15)",
          zIndex: 300,
          padding: "6px",
          display: "flex", flexDirection: "column", gap: 4,
          minWidth: "unset",
        }}>
          {LANGUAGES.map((l, i) => (
            <button
              key={l.code}
              onClick={() => select(i)}
              title={l.label}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "5px 7px",
                background: current === i ? "rgba(137,29,26,0.12)" : "transparent",
                border: current === i ? "1px solid rgba(137,29,26,0.35)" : "1px solid transparent",
                borderRadius: 3,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <img
                src={l.flag}
                alt={l.label}
                style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 2 }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
