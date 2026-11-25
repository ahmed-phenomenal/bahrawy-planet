"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLang } from "@/components/LangProvider/LangProvider";
import "./Reveal.css";

type Props = {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number; // in milliseconds
  className?: string;
};

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { dir } = useLang();

  // In Arabic (right-to-left) the sides are swapped
  const side =
    dir === "rtl"
      ? direction === "left"
        ? "right"
        : direction === "right"
        ? "left"
        : direction
      : direction;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Toggle in both directions so the animation replays every time
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("visible", entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      <div
        className={`reveal-inner reveal-${side}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
}