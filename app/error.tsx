"use client";
// app/error.tsx
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-4">Error</p>
      <h1 className="display text-6xl mb-6">Something went wrong.</h1>
      <p className="text-[var(--stone)] mb-10 max-w-sm text-sm">{error.message}</p>
      <div className="flex gap-4">
        <button onClick={reset} className="btn-primary">Try Again</button>
        <Link href="/" className="btn-outline">Go Home</Link>
      </div>
    </div>
  );
}
