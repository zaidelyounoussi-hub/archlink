// app/architects/loading.tsx
export default function Loading() {
  return (
    <div className="pt-16">
      <div className="bg-[var(--ink)] py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-12 w-72 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="h-28 bg-white border border-[var(--border)] rounded animate-pulse mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-7 space-y-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--border)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--border)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--border)] rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[var(--border)] rounded" />
                <div className="h-3 bg-[var(--border)] rounded w-5/6" />
                <div className="h-3 bg-[var(--border)] rounded w-4/6" />
              </div>
              <div className="h-px bg-[var(--border)]" />
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-[var(--border)] rounded" />
                <div className="h-3 w-12 bg-[var(--border)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
