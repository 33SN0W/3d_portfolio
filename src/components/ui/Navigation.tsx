"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSection, subscribe, scrollToSection, SECTIONS, type SectionKey } from "@/systems/scroll";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { LIVERIES } from "@/config/colors";

const SECTION_KEYS = Object.keys(SECTIONS) as SectionKey[];

export default function Navigation() {
  const { activeSection, livery, isMuted, setIsMuted, playAudio } = usePortfolio();
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [lapCount, setLapCount] = useState(1);
  const lapTimeRef = useRef<HTMLSpanElement>(null);
  const [deltaInfo, setDeltaInfo] = useState<{ text: string; isGreen: boolean } | null>(null);

  const lastSectionRef = useRef(activeSection);

  const update = useCallback(() => {
    setActiveSecIdx(getSection());
  }, []);

  useEffect(() => {
    update();
    return subscribe(update);
  }, [update]);

  // 1. Sector/Split Delta Trigger logic (flashes green/red delta on sector scroll boundary crosses)
  useEffect(() => {
    if (activeSection !== lastSectionRef.current) {
      const randomDelta = -0.350 + Math.random() * 0.600; // between -0.350s (green) and +0.250s (red)
      const isGreen = randomDelta < 0;
      const formattedDelta = (isGreen ? "▲ " : "▼ +") + randomDelta.toFixed(3) + "s";

      setDeltaInfo({ text: formattedDelta, isGreen });

      const timer = setTimeout(() => {
        setDeltaInfo(null);
      }, 1500);

      lastSectionRef.current = activeSection;
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  // 2. Continuous Real-Time Stopwatch (ticks forward continuously, rolling over at 1:45.320)
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const updateTimer = () => {
      const elapsedMs = performance.now() - startTime;
      const lapMs = 105320; // Rollover lap limit: 1 minute 45.320 seconds
      const currentLapTimeMs = elapsedMs % lapMs;
      const currentLapNum = Math.floor(elapsedMs / lapMs) + 1;

      setLapCount(currentLapNum);

      const mins = Math.floor(currentLapTimeMs / 60000);
      const secs = Math.floor((currentLapTimeMs % 60000) / 1000);
      const ms = Math.floor(currentLapTimeMs % 1000);

      if (lapTimeRef.current) {
        lapTimeRef.current.innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
      }
      animId = requestAnimationFrame(updateTimer);
    };

    animId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "56px",
        background: "rgba(5, 5, 5, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1b1b1d",
        zIndex: 9999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem",
        fontFamily: "var(--font-mono)",
      }}
      aria-label="Primary timing navigation"
    >
      {/* Left Branding / Dynamic Livery Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            PRATEEK <span style={{ color: "var(--steel)" }}>// LIVERY TUNED</span>
          </span>
          <span style={{ fontSize: "7px", color: "var(--orange)", letterSpacing: "0.1em", fontWeight: "bold" }}>
            {LIVERIES[livery]?.label}
          </span>
        </div>
      </div>

      {/* Center Sectors Navbar - Bigger Sector Bar */}
      <div style={{ display: "flex", gap: "2px", height: "100%" }}>
        {SECTION_KEYS.map((key, i) => {
          const section = SECTIONS[key];
          const isActive = activeSecIdx === i;
          const sectorCode = `SEC-0${i + 1}`;

          return (
            <button
              key={key}
              onClick={() => scrollToSection(key)}
              style={{
                background: "transparent",
                border: "none",
                color: isActive ? "var(--orange)" : "var(--titanium)",
                fontSize: "11px",
                fontWeight: isActive ? "bold" : "normal",
                padding: "0 16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                transition: "all 0.2s ease",
                borderBottom: isActive ? "2px solid var(--orange)" : "2px solid transparent",
                height: "100%",
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--orange)";
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--titanium)";
              }}
            >
              <span style={{ fontSize: "7px", color: "var(--steel)", letterSpacing: "0.05em" }}>{sectorCode}</span>
              <span style={{ fontSize: "10px", letterSpacing: "0.05em" }}>{section.label.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Lap Timer */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", textAlign: "right" }}>
        
        {/* Audio Speaker Mute Toggle */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            // Play physical chirp feedback immediately if unmuting
            if (isMuted) {
              try {
                // Procedural audio plays directly
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                gain.gain.setValueAtTime(0.012, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.08);
              } catch(e){}
            }
          }}
          style={{
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "2px",
            color: isMuted ? "var(--steel)" : "var(--orange)",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            padding: "4px 8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
            borderColor: isMuted ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 40, 0, 0.3)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = isMuted ? "rgba(255, 255, 255, 0.3)" : "var(--orange)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = isMuted ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 40, 0, 0.3)";
            e.currentTarget.style.color = isMuted ? "var(--steel)" : "var(--orange)";
          }}
        >
          <span>{isMuted ? "COMMS OFF ✖" : "COMMS ON 📻"}</span>
        </button>

        {/* Stopwatch Realtime Display */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {deltaInfo && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: deltaInfo.isGreen ? "#00ff00" : "#ff3333",
                animation: "pulse 0.4s infinite alternate",
                fontFamily: "var(--font-mono)",
                textShadow: deltaInfo.isGreen ? "0 0 8px rgba(0, 255, 0, 0.4)" : "0 0 8px rgba(255, 51, 51, 0.4)",
              }}
            >
              {deltaInfo.text}
            </span>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "8px", color: "var(--steel)", letterSpacing: "0.1em" }}>LAP {lapCount} // ACTIVE</span>
            <span ref={lapTimeRef} style={{ fontSize: "13px", color: "var(--orange)", fontWeight: "bold", textShadow: "0 0 6px var(--orange-glow)" }}>
              00:00.000
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

