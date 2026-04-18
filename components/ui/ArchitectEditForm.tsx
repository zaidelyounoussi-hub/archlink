"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { CheckCircle } from "lucide-react";

const SPECIALTIES = ["Residential Architecture","Commercial Architecture","Sustainable / Green Architecture","Interior Architecture","Landscape Architecture","Urban Planning & Design","Heritage & Conservation","Industrial Architecture","Hospitality & Retail","Healthcare Architecture","Educational Facilities","Religious Architecture"];
const SERVICES_LIST = ["Concept Design","Schematic Design","Design Development","Construction Documents","Permit & Planning Applications","3D Visualization & Rendering","Site Supervision","Interior Design","Feasibility Studies","Sustainability Consulting","Renovation & Restoration","Project Management","BIM Modeling"];
const PRICES = ["$20-$50/hr","$50-$80/hr","$80-$120/hr","$120-$180/hr","$180-$250/hr","$250+/hr","Project-based (flat fee)","To be discussed"];

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={"px-3 py-2 text-xs border transition-all text-left " + (active ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white text-[var(--stone)] border-[var(--border)] hover:border-[var(--ink)]")}>{label}</button>;
}
function tog(arr: string[], item: string) { return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]; }

export function ArchitectEditForm({ user }: { user: any }) {
  const router = useRouter();
  const profile = user.architectProfile;
  const currentServices = (() => { try { return JSON.parse(profile?.services || "[]"); } catch { return []; } })();

  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    bio: profile?.bio ?? "",
    specialty: profile?.specialty ?? "",
    location: profile?.location ?? "",
    yearsExp: profile?.yearsExp ?? "",
    website: profile?.website ?? "",
    phone: profile?.phone ?? "",
    licenseNo: profile?.licenseNo ?? "",
    priceRange: profile?.priceRange ?? "",
    services: currentServices as string[],
    available: profile?.available ?? true,
    education: profile?.education ?? "",
    certification: profile?.certification ?? "",
  });

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const save = async () => {
    setSaving(true);
    await fetch("/api/architects/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, yearsExp: form.yearsExp ? parseInt(String(form.yearsExp)) : null, services: JSON.stringify(form.services) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push("/dashboard/architect"); }, 1500);
  };

  return (
    <div className="space-y-10">
      <div className="card p-8">
        <h2 className="display text-2xl mb-6">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <AvatarUpload currentImage={user.image} name={user.name} size="lg" />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-[var(--stone)]">{profile?.specialty || "Architect"}</p>
            <p className="text-xs text-[var(--stone)] mt-1">Click the photo to upload a new one</p>
          </div>
        </div>
      </div>

      <div className="card p-8 space-y-6">
        <h2 className="display text-2xl">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Location", key: "location", placeholder: "City, Country" },
            { label: "Years of Experience", key: "yearsExp", placeholder: "e.g. 8", type: "number" },
            { label: "Website", key: "website", placeholder: "https://..." },
            { label: "Phone", key: "phone", placeholder: "+1 234 567 8900" },
            { label: "License No.", key: "licenseNo", placeholder: "RA-12345" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">{f.label}</label>
              <input className="input" type={f.type ?? "text"} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Bio</label>
          <textarea className="input min-h-[140px] resize-none" placeholder="Tell clients about your work, philosophy, and experience..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
      </div>

      <div className="card p-8 space-y-6">
        <h2 className="display text-2xl">Specialty & Services</h2>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Primary Specialty</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{SPECIALTIES.map(s => <Toggle key={s} label={s} active={form.specialty === s} onClick={() => setForm({ ...form, specialty: s })} />)}</div>
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Services Offered</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{SERVICES_LIST.map(s => <Toggle key={s} label={s} active={form.services.includes(s)} onClick={() => setForm({ ...form, services: tog(form.services, s) })} />)}</div>
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Price Range</label>
          <div className="flex flex-wrap gap-2">{PRICES.map(p => <Toggle key={p} label={p} active={form.priceRange === p} onClick={() => setForm({ ...form, priceRange: p })} />)}</div>
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Availability</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setForm({ ...form, available: true })} className={"flex-1 py-3 px-4 border text-sm text-left " + (form.available ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white border-[var(--border)]")}>Available for new projects</button>
            <button type="button" onClick={() => setForm({ ...form, available: false })} className={"flex-1 py-3 px-4 border text-sm text-left " + (!form.available ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white border-[var(--border)]")}>Not available right now</button>
          </div>
        </div>
      </div>

      <div className="card p-8 space-y-5">
        <h2 className="display text-2xl">Credentials</h2>
        <div>
          <label className="block text-xs tracking-widests uppercase text-[var(--stone)] mb-2">Education</label>
          <textarea className="input min-h-[100px] resize-none" placeholder="e.g. M.Arch, Harvard GSD, 2015" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Certifications & Awards</label>
          <textarea className="input min-h-[100px] resize-none" placeholder="e.g. LEED AP, AIA Member, RIBA Chartered" value={form.certification} onChange={(e) => setForm({ ...form, certification: e.target.value })} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-primary px-10">
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && <span className="flex items-center gap-1.5 text-sm text-[var(--sage)]"><CheckCircle size={15} /> Saved! Redirecting...</span>}
        <button onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}