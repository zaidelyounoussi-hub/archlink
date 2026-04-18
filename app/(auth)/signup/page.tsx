"use client";

// app/(auth)/signup/page.tsx
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = params.get("role") === "architect" ? "ARCHITECT" : "CLIENT";

  const [role, setRole] = useState<"CLIENT" | "ARCHITECT">(defaultRole as any);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    // Sign in after register
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    router.push(role === "ARCHITECT" ? "/onboarding/architect" : "/dashboard/client");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--ink)] p-16 flex-col justify-between">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="ArchLink" style={{ width: 36, height: 36, objectFit: "contain", filter: "none" }} />
          <span className="display text-3xl text-[var(--cream)]">ArchLink</span>
        </Link>
        <div>
          <h2 className="display text-6xl text-[var(--cream)] leading-tight mb-6">
            Join the premier architecture marketplace.
          </h2>
          <p className="text-[var(--stone)] leading-relaxed">
            Whether you're seeking exceptional design talent or looking to grow your practice,
            ArchLink connects the right people.
          </p>
        </div>
        <p className="text-[var(--stone)] text-sm">ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© 2025 ArchLink</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-[var(--cream)]">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src="/logo.png" alt="ArchLink" style={{ width: 34, height: 34, objectFit: "contain" }} />
              <span className="display text-3xl text-[var(--ink)]">ArchLink</span>
            </Link>
          </div>

          <h1 className="display text-5xl mb-2">Create account</h1>
          <p className="text-[var(--stone)] text-sm mb-10">
            Already have one?{" "}
            <Link href="/login" className="text-[var(--terracotta)] hover:underline">Sign in</Link>
          </p>

          {/* Role toggle */}
          <div className="flex mb-8 border border-[var(--border)]">
            {(["CLIENT", "ARCHITECT"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 text-xs tracking-[0.1em] uppercase transition-all ${
                  role === r
                    ? "bg-[var(--ink)] text-[var(--cream)]"
                    : "bg-white text-[var(--stone)] hover:bg-[var(--cream)]"
                }`}
              >
                {r === "CLIENT" ? "I'm a Client" : "I'm an Architect"}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/feed" })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[var(--border)] bg-white hover:bg-[var(--cream)] transition-colors text-sm mb-6"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--stone)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Full Name</label>
              <input
                className="input"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--stone)]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center mt-6"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-[var(--stone)] mt-8 text-center">
            By signing up, you agree to our{" "}
            <Link href="#" className="underline">Terms</Link> and{" "}
            <Link href="#" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
