"use client";

import { useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HINTS = [
  "Click wall posters to scan project blueprints",
  "Open the laptop on the workbench for project specs",
  "Inspect bike parts in the garage for skill telemetry",
];

export default function InteractionHints({ visible }: { visible: boolean }) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("hints-dismissed") === "1";
    }
    return false;
  });
  const reducedMotion = useReducedMotion();

  if (!visible || dismissed || reducedMotion) return null;

  const dismiss = () => {
    sessionStorage.setItem("hints-dismissed", "1");
    setDismissed(true);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "48px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9998,
        background: "rgba(8, 8, 9, 0.95)",
        border: "1px solid rgba(255, 40, 0, 0.35)",
        padding: "14px 20px",
        maxWidth: "min(520px, 92vw)",
        fontFamily: "var(--font-mono)",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color: "var(--orange)",
          letterSpacing: "0.12em",
          marginBottom: "8px",
          textTransform: "uppercase",
        }}
      >
        Interactive Garage {"//"} Scan Targets
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "4px", margin: 0, padding: 0 }}>
        {HINTS.map((hint) => (
          <li key={hint} style={{ fontSize: "11px", color: "var(--titanium)", lineHeight: 1.4 }}>
            · {hint}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss interaction hints"
        style={{
          marginTop: "10px",
          background: "transparent",
          border: "1px solid var(--steel)",
          color: "var(--titanium)",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          padding: "4px 10px",
          cursor: "pointer",
        }}
      >
        [GOT IT]
      </button>
    </div>
  );
}
