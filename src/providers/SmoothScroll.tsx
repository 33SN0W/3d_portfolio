"use client";

/**
 * Smooth Scroll Provider — Lenis
 *
 * The camera moves the way a thoughtful person moves through a space they respect.
 * Slowly. With pauses. Without urgency.
 *
 * Lenis provides the inertia model. Native scroll is instantaneous.
 * This provider gives scroll the weight of physical movement.
 */

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      // Duration of the scroll deceleration — long enough to feel like mass
      duration: 1.8,
      // Easing that settles like weight, not a bounce
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Smooth scroll on both wheel and touch
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
