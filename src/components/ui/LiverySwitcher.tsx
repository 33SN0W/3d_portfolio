"use client";

import { useState, useRef, useEffect } from "react";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { LIVERIES, type LiveryType } from "@/config/colors";

const LIVERY_KEYS = (Object.keys(LIVERIES) as LiveryType[]).sort((a, b) => {
  if (a === "ktm") return -1;
  if (b === "ktm") return 1;
  return LIVERIES[a].label.localeCompare(LIVERIES[b].label);
});

export default function LiverySwitcher() {
  const { livery, setLivery, playAudio } = usePortfolio();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change livery color theme"
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          textAlign: "left",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--orange)",
            boxShadow: "0 0 8px var(--orange-glow)",
            transition: "all 0.3s ease",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", letterSpacing: "0.08em", color: "#ffffff" }}>
            PRATEEK <span style={{ color: "var(--steel)" }}>{"// LIVERY TUNED"}</span>
          </span>
          <span style={{ fontSize: "9px", color: "var(--orange)", letterSpacing: "0.1em", fontWeight: "bold" }}>
            {LIVERIES[livery]?.label} ▾
          </span>
        </div>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Livery options"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            background: "rgba(8, 8, 9, 0.98)",
            border: "1px solid #222",
            listStyle: "none",
            margin: 0,
            padding: "4px 0",
            minWidth: "200px",
            zIndex: 10000,
          }}
        >
          {LIVERY_KEYS.map((key) => (
            <li key={key} role="option" aria-selected={livery === key}>
              <button
                type="button"
                onClick={() => {
                  setLivery(key);
                  playAudio("chirp");
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: livery === key ? "rgba(255, 40, 0, 0.08)" : "transparent",
                  border: "none",
                  color: livery === key ? "var(--orange)" : "var(--titanium)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  letterSpacing: "0.06em",
                }}
              >
                {LIVERIES[key].label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
