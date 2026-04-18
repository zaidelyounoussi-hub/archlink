"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { CheckCircle } from "lucide-react";

export function ClientEditForm({ user }: { user: any }) {
  const router = useRouter();
  const profile = user.clientProfile;
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    projectType: profile?.projectType ?? "",
    budget: profile?.budget ?? "",
  });

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
    setTimeout(() => { setSaved(false); router.push("/dashboard/client"); }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="display text-2xl mb-6">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <AvatarUpload currentImage={user.image} name={user.name} size="lg" />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-[var(--stone)]">Client</p>
            <p className="text-xs text-[var(--stone)] mt-1">Click the photo to upload a new one</p>
          </div>
        </div>
      </div>

      <div className="card p-8 space-y-5">
        <h2 className="display text-2xl">Your Details</h2>
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
            <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">About You & Your Project</label>
            <textarea className="input min-h-[140px] resize-none" placeholder="Describe yourself and what you are looking for in an architect..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
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