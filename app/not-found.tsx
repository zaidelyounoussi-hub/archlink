// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-4">404</p>
      <h1 className="display text-8xl mb-6">Not Found</h1>
      <p className="text-[var(--stone)] mb-10 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
