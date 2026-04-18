"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Step1Basic } from "@/components/onboarding/Step1Basic";
import { Step2Specialty } from "@/components/onboarding/Step2Specialty";
import { Step3Portfolio } from "@/components/onboarding/Step3Portfolio";
import { Step4Bio } from "@/components/onboarding/Step4Bio";
import { CheckCircle } from "lucide-react";

export interface OnboardingData {
  phone: string; city: string; country: string; website: string; licenseNo: string; yearsExp: string;
  specialty: string; styles: string[]; services: string[]; priceRange: string; available: boolean;
  portfolio: { title: string; type: string; location: string; year: string; description: string; imageUrl: string }[];
  bio: string; languages: string[]; tools: string[]; education: string; certification: string;
}

const EMPTY: OnboardingData = {
  phone: "", city: "", country: "", website: "", licenseNo: "", yearsExp: "",
  specialty: "", styles: [], services: [], priceRange: "", available: true,
  portfolio: [],
  bio: "", languages: [], tools: [], education: "", certification: "",
};

const STEPS = ["Basic Info", "Specialty", "Portfolio", "About You"];

export default function ArchitectOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (patch: Partial<OnboardingData>) => setData((d) => ({ ...d, ...patch }));

  const handleSubmit = async () => {
    setSubmitting(true);
    await fetch("/api/architects/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: data.phone,
        location: data.city + ", " + data.country,
        website: data.website,
        licenseNo: data.licenseNo,
        yearsExp: data.yearsExp ? parseInt(data.yearsExp) : null,
        specialty: data.specialty,
        services: JSON.stringify(data.services),
        priceRange: data.priceRange,
        available: data.available,
        bio: data.bio,
      }),
    });
    for (const item of data.portfolio) {
      if (item.title) {
        await fetch("/api/architects/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: item.title, description: item.type + " - " + item.location + "\n" + item.description, imageUrl: item.imageUrl, year: item.year ? parseInt(item.year) : null }),
        });
      }
    }
    setSubmitting(false);
    setDone(true);
    setTimeout(() => router.push("/dashboard/architect"), 2000);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={64} className="text-[var(--terracotta)] mx-auto mb-6" />
          <h1 className="display text-6xl text-[var(--cream)] mb-4">You are all set!</h1>
          <p className="text-[var(--stone)]">Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <div className="bg-[var(--ink)] px-6 lg:px-12 py-5 flex items-center justify-between">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/logo.png" alt="ArchLink" style={{ width: 32, height: 32, objectFit: "contain", filter: "none" }} />
          <span className="display text-2xl text-[var(--cream)]">ArchLink</span>
        </div>
        <span className="text-sm text-[var(--stone)]">Step {step + 1} of {STEPS.length}</span>
      </div>
      <div className="h-1 bg-white/10 relative">
        <div className="h-full bg-[var(--terracotta)] transition-all duration-500" style={{ width: ((step + 1) / STEPS.length * 100) + "%" }} />
      </div>
      <div className="bg-[var(--ink)] px-6 lg:px-12 pb-8 pt-6">
        <div className="max-w-3xl mx-auto flex gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-2">
              <div className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all " + (i < step ? "bg-[var(--terracotta)] text-white" : i === step ? "bg-white text-[var(--ink)]" : "bg-white/10 text-[var(--stone)]")}>
                {i < step ? "v" : i + 1}
              </div>
              <span className={"text-[10px] tracking-widest uppercase hidden md:block " + (i === step ? "text-[var(--cream)]" : "text-[var(--stone)]")}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {step === 0 && <Step1Basic data={data} update={update} />}
        {step === 1 && <Step2Specialty data={data} update={update} />}
        {step === 2 && <Step3Portfolio data={data} update={update} />}
        {step === 3 && <Step4Bio data={data} update={update} />}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-[var(--border)]">
          <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-outline disabled:opacity-30">Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} className="btn-primary">Continue</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : "Complete Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}