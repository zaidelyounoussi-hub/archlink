"use client";
import type { OnboardingData } from "@/app/onboarding/architect/page";

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; }
const LANGUAGES = ["English","Arabic","French","Spanish","Portuguese","German","Italian","Chinese (Mandarin)","Japanese","Korean","Russian","Turkish","Dutch","Hindi","Persian","Swahili","Polish","Greek"];
const TOOLS = ["AutoCAD","Revit","SketchUp","Rhino","ArchiCAD","3ds Max","V-Ray","Lumion","Blender","Enscape","Adobe Photoshop","Adobe Illustrator","InDesign","BIM 360","Navisworks","Grasshopper"];

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={"px-3 py-2 text-xs border transition-all " + (active ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white text-[var(--stone)] border-[var(--border)] hover:border-[var(--ink)]")}>{label}</button>;
}
function tog(arr: string[], item: string) { return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]; }

export function Step4Bio({ data, update }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Step 4 of 4</p>
        <h2 className="display text-5xl mb-3">About You</h2>
        <p className="text-[var(--stone)]">Your story, skills, and credentials. This is what makes clients choose you.</p>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Personal Statement / Bio *</label>
        <p className="text-xs text-[var(--stone)] mb-3">Write in first person. Describe your philosophy and approach. ({data.bio.length}/600)</p>
        <textarea className="input min-h-[160px] resize-none" maxLength={600} placeholder="I am an architect with a passion for sustainable design..." value={data.bio} onChange={(e) => update({ bio: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-1">Languages Spoken</label>
        <p className="text-xs text-[var(--stone)] mb-3">Selected: {data.languages.length}</p>
        <div className="flex flex-wrap gap-2">{LANGUAGES.map(l => <Toggle key={l} label={l} active={data.languages.includes(l)} onClick={() => update({ languages: tog(data.languages, l) })} />)}</div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-1">Software & Tools</label>
        <p className="text-xs text-[var(--stone)] mb-3">Selected: {data.tools.length}</p>
        <div className="flex flex-wrap gap-2">{TOOLS.map(t => <Toggle key={t} label={t} active={data.tools.includes(t)} onClick={() => update({ tools: tog(data.tools, t) })} />)}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Education</label>
          <textarea className="input min-h-[100px] resize-none" placeholder="e.g. M.Arch, Harvard GSD, 2015" value={data.education} onChange={(e) => update({ education: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Certifications & Awards</label>
          <textarea className="input min-h-[100px] resize-none" placeholder="e.g. LEED AP, AIA Member, RIBA Chartered" value={data.certification} onChange={(e) => update({ certification: e.target.value })} />
        </div>
      </div>
      <div className="card p-6 bg-[var(--ink)] border-0">
        <p className="text-xs tracking-widest uppercase text-[var(--terracotta)] mb-4">Profile Summary</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Location", value: data.city ? data.city + ", " + data.country : "Not set" },
            { label: "Specialty", value: data.specialty ? data.specialty.split(" ")[0] : "Not set" },
            { label: "Services", value: data.services.length > 0 ? data.services.length + " selected" : "Not set" },
            { label: "Projects", value: data.portfolio.filter(p => p.title).length > 0 ? data.portfolio.filter(p => p.title).length + " added" : "Not set" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xs text-[var(--stone)] mb-1">{s.label}</p>
              <p className="text-sm text-[var(--cream)] font-medium truncate">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}