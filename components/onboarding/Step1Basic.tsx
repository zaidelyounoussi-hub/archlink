"use client";
import type { OnboardingData } from "@/app/onboarding/architect/page";

const COUNTRIES = ["Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada","Chile","China","Colombia","Croatia","Denmark","Egypt","Finland","France","Germany","Ghana","Greece","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya","South Korea","Lebanon","Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","Spain","Sweden","Switzerland","Thailand","Tunisia","Turkey","Ukraine","United Arab Emirates","United Kingdom","United States","Venezuela","Vietnam"].sort();

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; }

export function Step1Basic({ data, update }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Step 1 of 4</p>
        <h2 className="display text-5xl mb-3">Basic Information</h2>
        <p className="text-[var(--stone)] leading-relaxed">Tell clients who you are and where you are based.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">City *</label>
          <input className="input" placeholder="e.g. Barcelona" value={data.city} onChange={(e) => update({ city: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Country *</label>
          <select className="input" value={data.country} onChange={(e) => update({ country: e.target.value })}>
            <option value="">Select country...</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Phone Number</label>
          <input className="input" placeholder="+1 234 567 8900" value={data.phone} onChange={(e) => update({ phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Website</label>
          <input className="input" placeholder="https://yourportfolio.com" value={data.website} onChange={(e) => update({ website: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Years of Experience *</label>
          <input className="input" type="number" min="0" max="60" placeholder="e.g. 8" value={data.yearsExp} onChange={(e) => update({ yearsExp: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">License / Registration No.</label>
          <input className="input" placeholder="e.g. RA-12345" value={data.licenseNo} onChange={(e) => update({ licenseNo: e.target.value })} />
        </div>
      </div>
      <div className="border-l-2 border-[var(--terracotta)] pl-5 py-1">
        <p className="text-sm text-[var(--stone)]"><span className="text-[var(--ink)] font-medium">Tip:</span> Profiles with a verified license number receive 3x more client inquiries.</p>
      </div>
    </div>
  );
}