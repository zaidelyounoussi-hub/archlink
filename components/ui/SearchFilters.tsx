"use client";
// components/ui/SearchFilters.tsx
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [specialty, setSpecialty] = useState(params.get("specialty") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [available, setAvailable] = useState(params.get("available") === "true");

  const apply = () => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (specialty) p.set("specialty", specialty);
    if (location) p.set("location", location);
    if (available) p.set("available", "true");
    startTransition(() => router.push(`/architects?${p.toString()}`));
  };

  const reset = () => {
    setQ(""); setSpecialty(""); setLocation(""); setAvailable(false);
    startTransition(() => router.push("/architects"));
  };

  const specialties = [
    "Residential", "Commercial", "Sustainable", "Interior",
    "Urban Planning", "Landscape", "Industrial", "Heritage"
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5 text-sm font-medium">
        <SlidersHorizontal size={16} className="text-[var(--terracotta)]" />
        Filter architects
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--stone)]" />
          <input
            className="input pl-9"
            placeholder="Search name or keyword"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
          />
        </div>

        <select
          className="input"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          <option value="">All specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm flex-1">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="accent-[var(--terracotta)]"
            />
            Available now
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={apply} className="btn-primary text-xs">
          Apply Filters
        </button>
        <button onClick={reset} className="btn-outline text-xs">
          Reset
        </button>
      </div>
    </div>
  );
}
