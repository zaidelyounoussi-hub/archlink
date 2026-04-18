"use client";
// components/ui/ReviewForm.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "./StarRating";

export function ReviewForm({ subjectId }: { subjectId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, rating, comment }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Failed to submit review.");
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="card p-6">
      <h3 className="display text-2xl mb-5">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-3">Your Rating</label>
          <StarRating rating={rating} onChange={setRating} size={24} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[var(--stone)] mb-2">Comment (optional)</label>
          <textarea
            className="input min-h-[100px] resize-none"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
