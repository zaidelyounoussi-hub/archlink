"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare, Star, Eye, Plus, Pencil, CheckCircle } from "lucide-react";
import { AvatarUpload } from "@/components/ui/AvatarUpload";

const SPECIALTIES = ["Residential Architecture","Commercial Architecture","Sustainable / Green Architecture","Interior Architecture","Landscape Architecture","Urban Planning & Design","Heritage & Conservation","Industrial Architecture","Hospitality & Retail","Healthcare Architecture","Educational Facilities","Religious Architecture"];
const SERVICES_LIST = ["Concept Design","Schematic Design","Design Development","Construction Documents","Permit & Planning Applications","3D Visualization & Rendering","Site Supervision","Interior Design","Feasibility Studies","Sustainability Consulting","Renovation & Restoration","Project Management","BIM Modeling"];
const PRICES = ["$20-$50/hr","$50-$80/hr","$80-$120/hr","$120-$180/hr","$180-$250/hr","$250+/hr","Project-based (flat fee)","To be discussed"];

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={"px-3 py-2 text-xs border transition-all text-left " + (active ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white text-[var(--stone)] border-[var(--border)] hover:border-[var(--ink)]")}>{label}</button>;
}
function tog(arr: string[], item: string) { return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]; }

export function ArchitectDashboard({ user }: { user: any }) {
  const router = useRouter();
  const profile = user.architectProfile;
  const avgRating = user.reviewsReceived.length ? user.reviewsReceived.reduce((s: number, r: any) => s + r.rating, 0) / user.reviewsReceived.length : null;
  const currentServices = (() => { try { return JSON.parse(profile?.services || "[]"); } catch { return profile?.services ? profile.services.split(",").map((s: string) => s.trim()) : []; } })();

  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
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
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const saveProfile = async () => {
    setSaving(true);
    await fetch("/api/architects/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, yearsExp: form.yearsExp ? parseInt(String(form.yearsExp)) : null, services: JSON.stringify(form.services) }),
    });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Unread Messages", value: user.receivedMessages.length, icon: <MessageSquare size={18} /> },
          { label: "Reviews", value: user.reviewsReceived.length, icon: <Star size={18} /> },
          { label: "Avg Rating", value: avgRating ? avgRating.toFixed(1) : "-", icon: <Star size={18} /> },
          { label: "Portfolio Items", value: profile?.portfolio?.length ?? 0, icon: <Eye size={18} /> },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-[var(--terracotta)] mb-3">{s.icon}</div>
            <p className="display text-4xl mb-1">{s.value}</p>
            <p className="text-xs text-[var(--stone)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/messages" className="btn-outline text-xs flex items-center gap-2"><MessageSquare size={14} /> Messages</Link>
        <Link href={"/architects/" + user.id} className="btn-outline text-xs flex items-center gap-2"><Eye size={14} /> View Profile</Link>
        <button onClick={() => setEditing(!editing)} className="btn-primary text-xs flex items-center gap-2"><Pencil size={14} /> {editing ? "Cancel" : "Edit Profile"}</button>
        {saved && <span className="flex items-center gap-1.5 text-sm text-[var(--sage)]"><CheckCircle size={15} /> Saved!</span>}
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[var(--border)]">
          <AvatarUpload currentImage={user.image} name={user.name} size="lg" />
          <div>
            <h2 className="display text-3xl">{user.name}</h2>
            <p className="text-sm text-[var(--stone)] mt-1">{profile?.specialty || "Architect"}</p>
            <p className="text-xs text-[var(--stone)] mt-0.5">{profile?.location || ""}</p>
          </div>
        </div>

        {!editing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            {[
              { label: "Experience", value: profile?.yearsExp ? profile.yearsExp + " years" : "Not set" },
              { label: "Price Range", value: profile?.priceRange || "Not set" },
              { label: "Availability", value: profile?.available ? "Available" : "Not available" },
              { label: "Phone", value: profile?.phone || "Not set" },
              { label: "Website", value: profile?.website || "Not set" },
              { label: "License", value: profile?.licenseNo || "Not set" },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs tracking-widest uppercase text-[var(--stone)] mb-1">{f.label}</p>
                <p className="truncate">{f.value}</p>
              </div>
            ))}
            {profile?.bio && (
              <div className="col-span-2 md:col-span-3 pt-4 border-t border-[var(--border)]">
                <p className="text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Bio</p>
                <p className="text-sm text-[var(--stone)] leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
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
              <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Specialty</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{SPECIALTIES.map(s => <Toggle key={s} label={s} active={form.specialty === s} onClick={() => setForm({ ...form, specialty: s })} />)}</div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Services</label>
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
            <div>
              <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Bio</label>
              <textarea className="input min-h-[120px] resize-none" placeholder="Tell clients about your work..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <button onClick={saveProfile} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        )}
      </div>

      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="display text-3xl">Portfolio</h2>
          <PortfolioAddForm onAdded={() => router.refresh()} />
        </div>
        {(!profile?.portfolio || profile.portfolio.length === 0) && <p className="text-sm text-[var(--stone)]">No portfolio items yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile?.portfolio?.map((item: any) => (
            <div key={item.id} className="border border-[var(--border)] p-4">
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover mb-3" />}
              <p className="font-medium text-sm">{item.title}</p>
              {item.year && <p className="text-xs text-[var(--stone)]">{item.year}</p>}
              {item.description && <p className="text-xs text-[var(--stone)] mt-1 line-clamp-2">{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioAddForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", year: "" });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    await fetch("/api/architects/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, year: form.year ? parseInt(form.year) : null }) });
    setSaving(false);
    setOpen(false);
    setForm({ title: "", description: "", imageUrl: "", year: "" });
    onAdded();
  };
  return (
    <>
      <button onClick={() => setOpen(!open)} className="btn-outline text-xs flex items-center gap-2"><Plus size={14} /> Add Item</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md p-8">
            <h3 className="display text-2xl mb-5">Add Portfolio Item</h3>
            <div className="space-y-4">
              {[{ label: "Title *", key: "title", placeholder: "Project name" }, { label: "Year", key: "year", placeholder: "2023", type: "number" }, { label: "Image URL", key: "imageUrl", placeholder: "https://..." }].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">{f.label}</label>
                  <input className="input" type={f.type ?? "text"} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Description</label>
                <textarea className="input min-h-[80px] resize-none" placeholder="Brief description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? "Saving..." : "Add Item"}</button>
              <button onClick={() => setOpen(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}