"use client";

import { useEffect, useState, useRef } from "react";
import { CONTACT, VALUE_PROPOSITION } from "@/config/site";
import {
  PROJECTS_DATA,
  POSTER_DATA,
  BLUEPRINT_ARCHIVE,
  SKILLS_DATA,
  TIMELINE_DATA,
  type PosterKey,
  type Project,
} from "@/content/portfolio";
import CopyEmailButton from "@/components/ui/CopyEmailButton";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SECTIONS = [
  { id: "paddock", name: "PADDOCK", code: "SEC-01" },
  { id: "garage", name: "GARAGE", code: "SEC-02" },
  { id: "build_log", name: "BUILD LOG", code: "SEC-03" },
  { id: "history", name: "RACE HISTORY", code: "SEC-04" },
  { id: "strategy", name: "RACE STRATEGY", code: "SEC-05" },
  { id: "radio", name: "PIT WALL", code: "SEC-06" },
];

export default function MobileLayout() {
  const [activeSection, setActiveSection] = useState("paddock");
  const lapTimeRef = useRef<HTMLDivElement>(null);
  const [focusedPoster, setFocusedPoster] = useState<PosterKey | null>(null);
  const [focusedProject, setFocusedProject] = useState<Project | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useFocusTrap(modalRef, !!(focusedPoster || focusedProject), () => {
    setFocusedPoster(null);
    setFocusedProject(null);
  });

  useEffect(() => {
    if (reducedMotion) return;
    const startTime = performance.now();
    let animId: number;
    const updateTimer = () => {
      const elapsed = performance.now() - startTime;
      const totalMs = Math.floor(elapsed);
      const mins = Math.floor(totalMs / 60000);
      const secs = Math.floor((totalMs % 60000) / 1000);
      const ms = totalMs % 1000;
      if (lapTimeRef.current) {
        lapTimeRef.current.innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
      }
      animId = requestAnimationFrame(updateTimer);
    };
    animId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  useEffect(() => {
    const observers = SECTIONS.map((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(sec.id);
          });
        },
        { threshold: 0.3, rootMargin: "-20% 0px -50% 0px" }
      );
      observer.observe(el);
      return { observer, el };
    });
    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  useEffect(() => {
    if (!focusedPoster && !focusedProject) return;
    let curr = 0;
    const interval = setInterval(() => {
      curr += 6;
      if (curr >= 100) {
        curr = 100;
        clearInterval(interval);
      }
      setAnimateProgress(curr);
    }, 16);
    return () => {
      clearInterval(interval);
      setAnimateProgress(0);
    };
  }, [focusedPoster, focusedProject]);

  const currentSecInfo = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#050505",
        color: "var(--warm-white)",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(5, 5, 5, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #1a1a1a",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
          fontFamily: "var(--font-mono)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff00", boxShadow: "0 0 6px #00ff00" }} />
          <span style={{ fontSize: "10px", color: "var(--steel)" }}>
            {currentSecInfo.code} {"//"} <span style={{ color: "var(--orange)" }}>{currentSecInfo.name}</span>
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: "var(--steel)", letterSpacing: "0.1em" }}>LAP TIME</div>
          <div ref={lapTimeRef} style={{ fontSize: "12px", color: "var(--orange)", fontWeight: "bold" }}>
            {reducedMotion ? "STATIC" : "00:00.000"}
          </div>
        </div>
      </header>

      <section
        id="paddock"
        style={{
          minHeight: "calc(100vh - 50px)",
          padding: "36px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderBottom: "1px solid #111",
        }}
      >
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px" }}>
          SECTOR 1 // PADDOCK
        </span>
        <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "4.2rem", lineHeight: "0.9", fontWeight: "normal", letterSpacing: "-0.02em" }}>
          PRATEEK
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--titanium)", marginTop: "16px", letterSpacing: "0.05em", lineHeight: "1.4" }}>
          Software Engineer // Systems & Data Architect
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--orange)", marginTop: "10px", lineHeight: 1.4 }}>
          {VALUE_PROPOSITION}
        </p>
        <div style={{ marginTop: "40px", padding: "16px", background: "#0a0a0c", border: "1px solid #222", borderRadius: "2px", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
          <div style={{ color: "var(--orange)", marginBottom: "8px" }}>[SYSTEM REPORT]</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "var(--steel)" }}>
            <div>INGESTION LINK: <span style={{ color: "#00ff00" }}>ACTIVE</span></div>
            <div>STRESS RATINGS: <span style={{ color: "var(--warm-white)" }}>NOMINAL (1000Hz)</span></div>
            <div>CHASSIS MODE: <span style={{ color: "var(--warm-white)" }}>2D_FALLBACK</span></div>
            <div>LOCATION: <span style={{ color: "var(--warm-white)" }}>NEW DELHI // IN</span></div>
          </div>
        </div>
      </section>

      <section id="garage" style={{ padding: "48px 20px", borderBottom: "1px solid #111" }}>
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 2 // GARAGE SETUP
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "20px" }}>
          CAR SETUP SHEET // TECH STACK
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {SKILLS_DATA.map((s, idx) => (
            <div key={idx}>
              <div style={{ fontSize: "10px", color: "var(--steel)", fontFamily: "var(--font-mono)", textTransform: "uppercase", marginBottom: "6px" }}>{s.cat}</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {s.items.map((item, itemIdx) => (
                  <span key={itemIdx} style={{ color: item.color, border: `1px solid ${item.color}33`, background: `${item.color}0b`, fontFamily: "var(--font-mono)", fontSize: "11px", padding: "4px 8px", borderRadius: "2px" }}>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #222", paddingTop: "12px", marginTop: "24px" }}>
          <p style={{ fontSize: "10px", color: "var(--steel)", fontFamily: "var(--font-mono)", lineHeight: "1.4" }}>
            [TIMING FEED LEGEND:<br />
            <span style={{ color: "#ffd500" }}>■ GOLD</span> = CORE SPEC // <span style={{ color: "#41ff72" }}>■ GREEN</span> = PROFICIENT // <span style={{ color: "#ffb36b" }}>■ ORANGE</span> = FAMILIAR]
          </p>
        </div>
      </section>

      <section id="build_log" style={{ padding: "48px 20px", borderBottom: "1px solid #111" }}>
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 3 // BUILD LOG
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "12px" }}>
          PROJECT DEPLOYMENTS
        </h2>
        <p style={{ color: "var(--steel)", fontSize: "12px", lineHeight: "1.5", marginBottom: "24px", fontFamily: "var(--font-display)" }}>
          Tap a project to view full specifications, tradeoffs, and repository links.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {PROJECTS_DATA.map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setFocusedProject(proj)}
              aria-label={`View details for ${proj.name}`}
              style={{
                background: "#0a0a0c",
                border: "1px solid #1a1a1a",
                borderRadius: "0px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: "var(--orange)", fontSize: "10px", letterSpacing: "0.05em" }}>{proj.tech}</span>
                <span style={{ color: "var(--steel)", fontSize: "10px" }}>[TAP TO SCAN ↗]</span>
              </div>
              <h3 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: "bold", margin: 0 }}>
                {proj.name.toUpperCase()}
              </h3>
              <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.4", fontFamily: "var(--font-display)", margin: 0 }}>
                {proj.desc}
              </p>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowArchive((v) => !v)}
          aria-expanded={showArchive}
          style={{
            marginTop: "24px",
            background: "transparent",
            border: "1px solid #333",
            color: "var(--titanium)",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            padding: "8px 12px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          {showArchive ? "[− HIDE BLUEPRINT ARCHIVE]" : "[+ BLUEPRINT ARCHIVE // RACING POSTERS]"}
        </button>

        {showArchive && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
            {BLUEPRINT_ARCHIVE.map((poster) => (
              <button
                key={poster.key}
                type="button"
                onClick={() => setFocusedPoster(poster.key)}
                aria-label={`View blueprint: ${poster.title}`}
                style={{
                  background: "#08080a",
                  border: "1px solid #141416",
                  padding: "12px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "9px" }}>{poster.code}</div>
                <div style={{ color: "#fff", fontFamily: "var(--font-mono)", fontSize: "11px", marginTop: "4px" }}>{poster.title.toUpperCase()}</div>
                <div style={{ color: "var(--steel)", fontSize: "10px", marginTop: "2px" }}>{poster.desc}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section id="history" style={{ padding: "48px 20px", borderBottom: "1px solid #111" }}>
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 4 // RACE HISTORY
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "20px" }}>
          RACE HISTORY // EXPERIENCE LOGS
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {TIMELINE_DATA.map((t, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px", borderBottom: idx < TIMELINE_DATA.length - 1 ? "1px solid #141416" : "none", paddingBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: "var(--orange)", fontSize: "11px", fontWeight: "bold" }}>{t.station}</span>
                <span style={{ color: "var(--steel)", fontSize: "10px" }}>{t.date}</span>
              </div>
              <h3 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "bold", margin: 0 }}>{t.location}</h3>
              <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "10px", marginTop: "2px", letterSpacing: "0.02em" }}>{t.role.toUpperCase()}</div>
              <p style={{ color: "var(--steel)", fontSize: "12px", lineHeight: "1.5", fontFamily: "var(--font-display)", marginTop: "4px" }}>{t.details}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="strategy" style={{ padding: "48px 20px", borderBottom: "1px solid #111" }}>
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 5 // RACE STRATEGY
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "20px" }}>
          DECISION MATRIX // LEADERSHIP
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontFamily: "var(--font-mono)", fontSize: "11px", lineHeight: "1.4" }}>
          <div style={{ borderBottom: "1px solid #141416", paddingBottom: "8px" }}>
            <div style={{ color: "var(--orange)", fontWeight: "bold" }}>[DECISION 01: SIMPLICITY]</div>
            <div style={{ color: "var(--steel)", marginTop: "2px" }}>Choosing lightweight structures over heavy abstractions to optimize runtime speed.</div>
          </div>
          <div style={{ borderBottom: "1px solid #141416", paddingBottom: "8px" }}>
            <div style={{ color: "var(--orange)", fontWeight: "bold" }}>[DECISION 02: OBSERVABILITY]</div>
            <div style={{ color: "var(--steel)", marginTop: "2px" }}>Telemetry pipelines built-in from start line, guaranteeing immediate system health feedback.</div>
          </div>
          <div style={{ background: "#0a0a0c", border: "1px solid #222", padding: "12px", borderRadius: "2px" }}>
            <div style={{ color: "#ffffff", fontWeight: "bold", marginBottom: "4px" }}>ENGINEER NOTES // PHILOSOPHY</div>
            <div style={{ color: "var(--steel)" }}>&quot;I build scalable big data pipelines, highly responsive modular UI screens, and robust cloud automation workflows.&quot;</div>
          </div>
        </div>
      </section>

      <section id="radio" style={{ padding: "48px 20px 80px 20px" }}>
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 6 // PIT WALL RADIO
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "20px" }}>
          TEAM-RADIO TRANSCRIPT
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "11px", marginBottom: "32px" }}>
          <div><span style={{ color: "var(--orange)" }}>[PIT WALL]:</span> <span style={{ color: "var(--titanium)" }}>&quot;Driver, box this lap. We need contact confirmation. Over.&quot;</span></div>
          <div><span style={{ color: "#ffffff" }}>[DRIVER]:</span> <span style={{ color: "var(--steel)" }}>&quot;Copy. Box confirmation received. Commencing ingestion links...&quot;</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
          <a href={`mailto:${CONTACT.email}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0c0d10", border: "1px solid #222", borderRadius: "2px", padding: "12px 16px", color: "#ffffff", textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            <span>EMAIL // {CONTACT.email}</span><span style={{ color: "var(--orange)" }}>↗</span>
          </a>
          <CopyEmailButton style={{ marginTop: 0, width: "100%", padding: "10px 16px" }} />
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0c0d10", border: "1px solid #222", borderRadius: "2px", padding: "12px 16px", color: "#ffffff", textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            <span>GITHUB // github.com/33SN0W</span><span style={{ color: "var(--orange)" }}>↗</span>
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0c0d10", border: "1px solid #222", borderRadius: "2px", padding: "12px 16px", color: "#ffffff", textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            <span>LINKEDIN // prateek-00a970228</span><span style={{ color: "var(--orange)" }}>↗</span>
          </a>
        </div>
        <a href={CONTACT.resume} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", borderBottom: "1px solid var(--orange)", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--orange)", textDecoration: "none", paddingBottom: "4px" }}>
          [DOWNLOAD RESUME SPEC SHEET ↗]
        </a>
      </section>

      {(focusedPoster || focusedProject) && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setFocusedPoster(null);
            setFocusedProject(null);
          }}
          style={{ position: "fixed", inset: 0, background: "rgba(5, 5, 5, 0.9)", backdropFilter: "blur(6px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "500px", background: "#0a0a0c", border: "1px solid var(--orange)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 0 25px rgba(255, 105, 0, 0.15)" }}
          >
            {focusedProject ? (
              <>
                <div style={{ borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                  <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em" }}>PROJECT SPECIFICATION REPORT</div>
                  <h2 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "14px", marginTop: "4px", fontWeight: "bold" }}>{focusedProject.name.toUpperCase()}</h2>
                  <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "11px", marginTop: "2px" }}>{focusedProject.tech}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--steel)", lineHeight: 1.45 }}>
                  <p>{focusedProject.desc}</p>
                  <p><strong style={{ color: "var(--orange)" }}>PROBLEM:</strong> {focusedProject.problem}</p>
                  <p><strong style={{ color: "var(--orange)" }}>CONSTRAINTS:</strong> {focusedProject.constraints}</p>
                  <p><strong style={{ color: "var(--orange)" }}>TRADEOFFS:</strong> {focusedProject.tradeoffs}</p>
                  <p><strong>ARCHITECTURE:</strong> {focusedProject.architecture}</p>
                  <p><strong>SCALE:</strong> {focusedProject.scale}</p>
                  <p><strong style={{ color: "#41ff72" }}>IMPACT:</strong> {focusedProject.impact}</p>
                </div>
                <div style={{ display: "flex", gap: "12px", borderTop: "1px dashed #222", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                  {focusedProject.github && <a href={focusedProject.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[GITHUB ↗]</a>}
                  {focusedProject.deck && <a href={focusedProject.deck} target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[DECK ↗]</a>}
                </div>
              </>
            ) : focusedPoster ? (
              <>
                <div style={{ borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                  <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em" }}>SPECIFICATION REPORT</div>
                  <h2 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "13px", marginTop: "4px", fontWeight: "bold" }}>{POSTER_DATA[focusedPoster].title}</h2>
                  <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "11px", marginTop: "2px" }}>{POSTER_DATA[focusedPoster].subtitle}</div>
                  <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "10px", marginTop: "6px" }}>
                    TELEMETRY SCANNING: {Math.round(animateProgress)}%
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {POSTER_DATA[focusedPoster].sections.map((sect, i) => (
                    <div key={i} style={{ borderBottom: i < POSTER_DATA[focusedPoster].sections.length - 1 ? "1px solid #141416" : "none", paddingBottom: "10px" }}>
                      <div style={{ color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>{sect.label}</div>
                      <p style={{ color: "var(--steel)", fontSize: "12px", lineHeight: "1.45", marginTop: "4px", fontFamily: "var(--font-mono)" }}>{sect.value}</p>
                    </div>
                  ))}
                </div>
                {focusedPoster === "ferrari" && (
                  <div style={{ display: "flex", gap: "12px", borderTop: "1px dashed #222", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                    <a href="https://github.com/33SN0W/champsim" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[GITHUB ↗]</a>
                  </div>
                )}
                {focusedPoster === "ktm" && (
                  <div style={{ display: "flex", gap: "12px", borderTop: "1px dashed #222", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                    <a href="https://github.com/33SN0W/nlp_project" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[GITHUB ↗]</a>
                  </div>
                )}
                {focusedPoster === "senna2" && (
                  <div style={{ display: "flex", gap: "12px", borderTop: "1px dashed #222", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                    <a href="https://github.com/33SN0W/ad_reccomd" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[GITHUB ↗]</a>
                  </div>
                )}
              </>
            ) : null}
            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #222", paddingTop: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  setFocusedPoster(null);
                  setFocusedProject(null);
                }}
                aria-label="Close details"
                style={{ background: "transparent", border: "1px solid var(--steel)", color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 12px", borderRadius: "2px", cursor: "pointer" }}
              >
                [CLOSE_SESSION]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
