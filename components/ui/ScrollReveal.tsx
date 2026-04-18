"use client";
import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  type?: "up" | "left" | "right" | "scale";
}

export function ScrollReveal({ children, className = "", delay = 0, type = "up" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealClass = type === "left" ? "reveal-left" : type === "right" ? "reveal-right" : type === "scale" ? "reveal-scale" : "reveal";

    el.classList.add(revealClass);
    if (delay) el.style.transitionDelay = delay + "ms";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [type, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}