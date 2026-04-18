"use client";
import type { OnboardingData } from "@/app/onboarding/architect/page";

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; }

const SPECIALTIES = ["Residential Architecture","Commercial Architecture","Sustainable / Green Architecture","Interior Architecture","Landscape Architecture","Urban Planning & Design","Heritage & Conservation","Industrial Architecture","Hospitality & Retail","Healthcare Architecture","Educational Facilities","Religious Architecture"];
const STYLES = ["Minimalist","Modern","Contemporary","Classical","Brutalist","Organic","Art Deco","Scandinavian","Mediterranean","Industrial","Biophilic","Futuristic"];
const SERVICES = ["Concept Design","Schematic Design","Design Development","Construction Documents","Permit & Planning Applications","3D Visualization & Rendering","Site Supervision","Interior Design","Feasibility Studies","Sustainability Consulting","Renovation & Restoration","Project Management","BIM Modeling"];
const PRICES = ["$20-$50/hr","$50-$80/hr","$80-$120/hr","$120-$180/hr","$180-$250/hr","$250+/hr","Project-based (flat fee)","To be discussed"];

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={"px-3 py-2 text-xs border transition-all text-left " + (active ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white text-[var(--stone)] border-[var(--border)] hover:border-[var(--ink)]")}>{label}</button>;
}
function tog(arr: string[], item: string) { return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]; }

export function Step2Specialty({ data, update }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Step 2 of 4</p>
        <h2 className="display text-5xl mb-3">Your Specialty</h2>
        <p className="text-[var(--stone)]">Help clients find you by selecting your focus, styles, and services.</p>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Primary Specialty *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{SPECIALTIES.map(s => <Toggle key={s} label={s} active={data.specialty === s} onClick={() => update({ specialty: s })} />)}</div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-1">Design Styles <span className="normal-case">(select all that apply)</span></label>
        <p className="text-xs text-[var(--stone)] mb-3">Selected: {data.styles.length}</p>
        <div className="flex flex-wrap gap-2">{STYLES.map(s => <Toggle key={s} label={s} active={data.styles.includes(s)} onClick={() => update({ styles: tog(data.styles, s) })} />)}</div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-1">Services Offered * <span className="normal-case">(select all that apply)</span></label>
        <p className="text-xs text-[var(--stone)] mb-3">Selected: {data.services.length}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{SERVICES.map(s => <Toggle key={s} label={s} active={data.services.includes(s)} onClick={() => update({ services: tog(data.services, s) })} />)}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Price Range *</label>
          <div className="space-y-2">{PRICES.map(p => <Toggle key={p} label={p} active={data.priceRange === p} onClick={() => update({ priceRange: p })} />)}</div>
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Availability</label>
          <div className="space-y-3">
            <button type="button" onClick={() => update({ available: true })} className={"w-full px-4 py-4 border text-left transition-all " + (data.available ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white border-[var(--border)]")}>
              <p className="text-sm font-medium">Available for new projects</p>
              <p className={"text-xs mt-1 " + (data.available ? "text-white/60" : "text-[var(--stone)]")}>Clients can contact you immediately</p>
            </button>
            <button type="button" onClick={() => update({ available: false })} className={"w-full px-4 py-4 border text-left transition-all " + (!data.available ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white border-[var(--border)]")}>
              <p className="text-sm font-medium">Not available right now</p>
              <p className={"text-xs mt-1 " + (!data.available ? "text-white/60" : "text-[var(--stone)]")}>Profile visible but marked unavailable</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}