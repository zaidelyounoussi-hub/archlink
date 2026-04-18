"use client";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  rating: number;
  readonly?: boolean;
  size?: number;
  onChange?: (r: number) => void;
}

export function StarRating({ rating, readonly = false, size = 16, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(i)}
          className={readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}
        >
          <Star
            size={size}
            className={i <= rating ? "star-filled fill-current" : "star-empty fill-current"}
          />
        </button>
      ))}
    </div>
  );
}