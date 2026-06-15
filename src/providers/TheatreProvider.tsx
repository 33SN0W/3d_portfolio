"use client";

/**
 * Theatre.js Provider
 *
 * Theatre.js is a visual sequencer for tuning camera choreography.
 * It exists in dev mode only. It never ships to production.
 *
 * The shot list requires iterative tuning of dolly speed, pan rate,
 * pause duration, focus rack timing. Theatre.js makes this possible
 * without code changes.
 */

import { useEffect, ReactNode } from "react";
import { initTheatre } from "@/systems/animation";

interface TheatreProviderProps {
  children: ReactNode;
}

export default function TheatreProvider({ children }: TheatreProviderProps) {
  useEffect(() => {
    initTheatre();
  }, []);

  return <>{children}</>;
}
