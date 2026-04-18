"use client";
import type { OnboardingData } from "@/app/onboarding/architect/page";
import { Plus, Trash2 } from "lucide-react";

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; }
const EMPTY_P = { title: "", type: "", location: "", year: "", description: "", imageUrl: "" };
const TYPES = ["Residential House","Apartment / Condo","Villa","Office Building","Retail / Shop","Restaurant / Cafe","Hotel / Resort","School / University","Hospital / Clinic","Cultural Center","Religious Building","Industrial Facility","Landscape / Park","Urban Redevelopment","Renovation / Restoration","Mixed-Use"];

export function Step3Portfolio({ data, update }: Props) {
  const portfolio = data.portfolio.length > 0 ? data.portfolio : [{ ...EMPTY_P }];
  const set = (p: typeof portfolio) => update({ portfolio: p });
  const add = () => { if (portfolio.length < 6) set([...portfolio, { ...EMPTY_P }]); };
  const remove = (i: number) => set(portfolio.filter((_, idx) => idx !== i));
  const upd = (i: number, patch: Partial<typeof EMPTY_P>) => set(portfolio.map((p, idx) => idx === i ? { ...p, ...patch } : p));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Step 3 of 4</p>
        <h2 className="display text-5xl mb-3">Your Portfolio</h2>
        <p className="text-[var(--stone)]">Showcase up to 6 of your best projects.</p>
      </div>
      <div className="space-y-6">
        {portfolio.map((project, i) => (
          <div key={i} className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium">Project {i + 1}</span>
              {portfolio.length > 1 && <button type="button" onClick={() => remove(i)} className="text-[var(--stone)] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Project Name *</label>
                <input className="input" placeholder="e.g. The Olive House" value={project.title} onChange={(e) => upd(i, { title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs tracking-widests uppercase text-[var(--stone)] mb-2">Project Type *</label>
                <select className="input" value={project.type} onChange={(e) => upd(i, { type: e.target.value })}>
                  <option value="">Select type...</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Location</label>
                <input className="input" placeholder="e.g. Madrid, Spain" value={project.location} onChange={(e) => upd(i, { location: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Year Completed</label>
                <input className="input" type="number" min="1950" max="2026" placeholder="e.g. 2022" value={project.year} onChange={(e) => upd(i, { year: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Photo URL</label>
                <input className="input" placeholder="https://..." value={project.imageUrl} onChange={(e) => upd(i, { imageUrl: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Description</label>
                <textarea className="input min-h-[90px] resize-none" placeholder="Describe this project briefly..." value={project.description} onChange={(e) => upd(i, { description: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {portfolio.length < 6 && (
        <button type="button" onClick={add} className="w-full py-4 border-2 border-dashed border-[var(--border)] hover:border-[var(--terracotta)] text-[var(--stone)] hover:text-[var(--terracotta)] transition-all flex items-center justify-center gap-2 text-sm">
          <Plus size={16} /> Add Another Project ({portfolio.length}/6)
        </button>
      )}
    </div>
  );
}