"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MessageSquare, Search, Pencil, CheckCircle } from "lucide-react";
import { AvatarUpload } from "@/components/ui/AvatarUpload";

export function ClientDashboard({ user }: { user: any }) {
  const router = useRouter();
  const profile = user.clientProfile;
  const [editing, setEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    projectType: profile?.projectType ?? "",
    budget: profile?.budget ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const save = async () => {
    setSaving(true);
    await fetch("/api/clients/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <div className="card p-5">
          <div className="text-[var(--terracotta)] mb-3"><MessageSquare size={18} /></div>
          <p className="display text-4xl mb-1">{user.receivedMessages.length}</p>
          <p className="text-xs text-[var(--stone)]">Unread Messages</p>
        </div>
        <div className="card p-5">
          <div className="text-[var(--terracotta)] mb-3"><Search size={18} /></div>
          <p className="display text-4xl mb-1">∞</p>
          <p className="text-xs text-[var(--stone)]">Architects Available</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/architects" className="btn-primary text-xs flex items-center gap-2"><Search size={14} /> Browse Architects</Link>
        <Link href="/messages" className="btn-outline text-xs flex items-center gap-2"><MessageSquare size={14} /> Messages</Link>
        <button onClick={() => setEditing(!editing)} className="btn-outline text-xs flex items-center gap-2"><Pencil size={14} /> {editing ? "Cancel" : "Edit Profile"}</button>
        {saved && <span className="flex items-center gap-1.5 text-sm text-[var(--sage)]"><CheckCircle size={15} /> Saved!</span>}
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[var(--border)]">
          <AvatarUpload currentImage={user.image} name={user.name} size="lg" />
          <div>
            <h2 className="display text-3xl">{user.name}</h2>
            <p className="text-sm text-[var(--stone)] mt-1">Client</p>
          </div>
        </div>

        {!editing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            {[
              { label: "Location", value: profile?.location || "Not set" },
              { label: "Project Type", value: profile?.projectType || "Not set" },
              { label: "Budget", value: profile?.budget || "Not set" },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs tracking-widest uppercase text-[var(--stone)] mb-1">{f.label}</p>
                <p>{f.value}</p>
              </div>
            ))}
            {profile?.bio && (
              <div className="col-span-2 md:col-span-3 pt-4 border-t border-[var(--border)]">
                <p className="text-xs tracking-widest uppercase text-[var(--stone)] mb-2">About</p>
                <p className="text-sm text-[var(--stone)] leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Location", key: "location", placeholder: "City, Country" },
                { label: "Project Type", key: "projectType", placeholder: "e.g. Residential renovation" },
                { label: "Budget", key: "budget", placeholder: "e.g. $50,000-$100,000" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">{f.label}</label>
                  <input className="input" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">About you</label>
                <textarea className="input min-h-[100px] resize-none" placeholder="Describe yourself and what you are looking for..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>
            <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        )}
      </div>

      <div className="card p-8 bg-[var(--ink)] border-0">
        <h2 className="display text-4xl text-[var(--cream)] mb-3">Ready to build something?</h2>
        <p className="text-[var(--stone)] text-sm mb-6">Browse our curated network of verified architects.</p>
        <Link href="/architects" className="btn-primary">Find an Architect</Link>
      </div>
    </div>
  );
}