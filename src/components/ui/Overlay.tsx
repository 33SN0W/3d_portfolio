"use client";

/**
 * Overlay — Typography & HUD floating over the 3D space
 *
 * Designed as factory technical plaques/specification sheets:
 * - Sharp corners (0px border-radius)
 * - Subtle matte backings with corner-rivet plus markers (+)
 * - Warm color language mapped to active livery
 */

import { useEffect, useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { getProgress, subscribe, type SectionKey, SECTIONS } from "@/systems/scroll";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { LIVERIES } from "@/config/colors";
import { CONTACT, VALUE_PROPOSITION } from "@/config/site";
import { PROJECTS_DATA, POSTER_DATA, SKILLS_DATA, type PosterKey } from "@/content/portfolio";
import CopyEmailButton from "@/components/ui/CopyEmailButton";
import { useFocusTrap } from "@/hooks/useFocusTrap";

/** Computes section-local progress (0-1) for a given section */
function useSectionVisibility(sectionKey: SectionKey): boolean {
  const { activeBikePart } = usePortfolio();
  const [visible, setVisible] = useState(() => {
    const p = getProgress();
    const section = SECTIONS[sectionKey];
    if (!section) return false;
    const fadeIn = section.start;
    const fadeOut = section.end;
    return p >= fadeIn - 0.02 && p <= fadeOut + 0.02;
  });

  const update = useCallback(() => {
    const p = getProgress();
    const section = SECTIONS[sectionKey];
    if (!section) return;

    // Fade in slightly before the section starts, fade out slightly after
    const fadeIn = section.start;
    const fadeOut = section.end;
    const isVisible = p >= fadeIn - 0.02 && p <= fadeOut + 0.02;

    setVisible(isVisible);
  }, [sectionKey]);

  useEffect(() => {
    return subscribe(update);
  }, [update]);

  return activeBikePart ? false : visible;
}

// PROJECTS CONFIG imported from @/content/portfolio

// ─── PADDOCK (DRIVER PROFILE) SECTION ──────────────────
function PaddockSection() {
  const visible = useSectionVisibility("PADDOCK");
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAppeared(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!appeared) return null;

  return (
    <div
      className={`section-content tech-panel ${visible ? "visible" : "hidden"}`}
      style={{
        bottom: "16vh",
        left: "6vw",
        transform: `translateY(${(1 - (visible ? 1 : 0)) * 20}px)`,
        maxWidth: "460px",
      }}
    >
      <div className="tech-panel-screws" />
      <div className="panel-header">
        <div className="panel-title">SPECIFICATION SHEET // SECTOR 1</div>
        <h1 className="panel-main-heading">PRATEEK</h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--orange)",
            marginTop: "8px",
            letterSpacing: "0.04em",
            lineHeight: 1.4,
          }}
        >
          {VALUE_PROPOSITION}
        </p>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "10px", lineHeight: "1.4" }}>
        <div>
          <span style={{ color: "var(--steel)" }}>EDUCATION:</span>
          <span style={{ color: "#ffffff", marginLeft: "12px" }}>MBA Core, IIM Mumbai (2026-28) // B.Tech CSE, IIIT Guwahati (2021-25)</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>CORE STACK:</span>
          <span style={{ color: "var(--orange)", marginLeft: "12px" }}>C++ // Python // SQL // PySpark // Azure Synapse // TensorFlow</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>SCALE INDEX:</span>
          <span style={{ color: "#ffffff", marginLeft: "12px" }}>200M+ telemetry rows/day // 75% ETL runtime cut // DP-600 & DP-700</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>DIAGNOSTIC:</span>
          <span style={{ color: "#41ff72", marginLeft: "12px" }}>[SYSTEM METRICS OPERATIONAL // CELL NOMINAL]</span>
        </div>
      </div>

      <p className="type-mono" style={{ color: "var(--orange)", fontSize: "10px", marginTop: "20px", opacity: 0.8, letterSpacing: "0.1em" }}>
        [CLICK POSTERS · OPEN LAPTOP · INSPECT BIKE]
      </p>
    </div>
  );
}

// ─── GARAGE (CAR SETUP / SKILLS) SECTION ──────────────
function GarageSection() {
  const visible = useSectionVisibility("GARAGE");

  const skills = SKILLS_DATA;

  return (
    <div
      className={`section-content tech-panel ${visible ? "visible" : "hidden"}`}
      style={{
        top: "14vh",
        right: "6vw",
        maxWidth: "450px",
        textAlign: "right",
      }}
    >
      <div className="tech-panel-screws" />
      <div className="panel-header">
        <div className="panel-title">SECTOR 2 // GARAGE SETUP</div>
        <h2 className="panel-main-heading">CAR SETUP SHEET</h2>
        <div className="panel-subtitle">TECHNICAL SKILLS INVENTORY</div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
        {skills.map((s, idx) => (
          <div key={idx}>
            <div style={{ fontSize: "9px", color: "var(--steel)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
              {s.cat}
            </div>
            <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", flexWrap: "wrap", marginTop: "4px" }}>
              {s.items.map((item, itemIdx) => (
                <span
                  key={itemIdx}
                  style={{
                    color: item.color,
                    border: `1px solid ${item.color}22`,
                    background: `rgba(8, 8, 9, 0.6)`,
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    padding: "2px 6px",
                    borderRadius: "0px",
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #1c1c1f", paddingTop: "8px", marginTop: "14px" }}>
        <p style={{ fontSize: "9px", color: "var(--steel)", fontFamily: "var(--font-mono)" }}>
          [TIMING FEED LEGEND: <span style={{ color: "#ffd500" }}>■ GOLD</span> = CORE SPEC // <span style={{ color: "#41ff72" }}>■ GREEN</span> = PROFICIENT // <span style={{ color: "#ffb36b" }}>■ ORANGE</span> = FAMILIAR]
        </p>
      </div>
    </div>
  );
}

// ─── BUILD LOG (PROJECT DEPLOYMENTS) SECTION ───────────
function BuildLogSection() {
  const visible = useSectionVisibility("BUILD_LOG");
  const { setFocusedProjectIndex, activeProjectIndex, setActiveProjectIndex, playAudio } = usePortfolio();

  return (
    <div
      className={`section-content tech-panel ${visible ? "visible" : "hidden"}`}
      style={{
        top: "14vh",
        left: "6vw",
        maxWidth: "520px",
      }}
    >
      <div className="tech-panel-screws" />
      <div className="panel-header">
        <div className="panel-title">BUILD LOG // SECTOR 3</div>
        <h2 className="panel-main-heading">PROJECT DEPLOYMENTS</h2>
        <div className="panel-subtitle">TECHNICAL SPECIFICATIONS & TRADEOFFS</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {PROJECTS_DATA.map((proj, idx) => {
          const isSelected = activeProjectIndex === idx;

          return (
            <div
              key={idx}
              style={{
                borderLeft: isSelected ? "3px solid var(--orange)" : "3px solid #1c1c1f",
                padding: "16px 18px",
                background: isSelected ? "rgba(255, 40, 0, 0.02)" : "transparent",
                borderBottom: "1px solid #151518",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onClick={() => {
                setActiveProjectIndex(idx);
                playAudio('chirp');
              }}
              onMouseOver={(e) => {
                if (!isSelected) e.currentTarget.style.borderLeftColor = "rgba(255, 40, 0, 0.4)";
              }}
              onMouseOut={(e) => {
                if (!isSelected) e.currentTarget.style.borderLeftColor = "#1c1c1f";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: "bold", color: isSelected ? "#ffffff" : "var(--titanium)" }}>
                  {proj.name}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "9.5px", color: "var(--steel)" }}>
                  {proj.tech}
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "var(--steel)", lineHeight: "1.4", marginTop: "6px" }}>
                {proj.desc}
              </p>
              
              {isSelected && (
                <div style={{ marginTop: "12px", borderTop: "1px dashed #222", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "9.5px", color: "var(--steel)", display: "flex", flexDirection: "column", gap: "5px" }}>
                  <div><span style={{ color: "var(--orange)" }}>CONSTRAINTS:</span> {proj.constraints}</div>
                  <div><span style={{ color: "var(--orange)" }}>TRADEOFFS:</span> {proj.tradeoffs}</div>
                  <div><span style={{ color: "#ffffff" }}>ARCHITECTURE:</span> {proj.architecture}</div>
                  
                  {/* Direct links in details */}
                  <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: "var(--orange)", textDecoration: "none", borderBottom: "1px solid rgba(255, 40, 0, 0.3)" }}
                      >
                        [GITHUB ↗]
                      </a>
                    )}
                    {proj.deck && (
                      <a
                        href={proj.deck}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: "var(--orange)", textDecoration: "none", borderBottom: "1px solid rgba(255, 40, 0, 0.3)" }}
                      >
                        [PRESENTATION DECK ↗]
                      </a>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", borderTop: "1px solid #1a1a1d", paddingTop: "8px" }}>
                    <span style={{ color: "#41ff72" }}>SCALE: {proj.scale}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedProjectIndex(idx);
                        playAudio('sweep');
                      }}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--orange)",
                        color: "var(--orange)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        padding: "3px 10px",
                        cursor: "pointer",
                        borderRadius: "0px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "var(--orange)";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--orange)";
                      }}
                    >
                      [SCAN SPEC ↗]
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RACE HISTORY (EXPERIENCE LOGS) SECTION ────────────
function RaceHistorySection() {
  const visible = useSectionVisibility("RACE_HISTORY");

  return (
    <div
      className={`section-content tech-panel ${visible ? "visible" : "hidden"}`}
      style={{
        top: "14vh",
        right: "6vw",
        maxWidth: "480px",
        textAlign: "right",
      }}
    >
      <div className="tech-panel-screws" />
      <div className="panel-header">
        <div className="panel-title">DRIVER LOGS // SECTOR 4</div>
        <h2 className="panel-main-heading">RACE HISTORY</h2>
        <div className="panel-subtitle">CAREER SUMMARY & INGESTION METRICS</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "4px" }}>
        {/* IIM Mumbai Strategy Stop */}
        <div style={{ borderRight: "2px solid var(--orange)", paddingRight: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "bold", flexDirection: "row-reverse" }}>
            <span style={{ color: "#ffffff" }}>IIM MUMBAI // STRATEGY CORE</span>
            <span style={{ color: "var(--steel)" }}>2026 - 2028</span>
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8.5px", marginTop: "2px" }}>
            PROGRAM: MBA CORE // SYSTEMS & STRATEGY
          </div>
          <div style={{ fontSize: "9.5px", color: "var(--steel)", fontFamily: "var(--font-mono)", marginTop: "4px", lineHeight: "1.4" }}>
            Incoming candidate focusing on operations strategy, supply chain management, data-driven forecasting, and operations research.
          </div>
        </div>

        {/* MAQ Software Telemetry Log */}
        <div style={{ borderRight: "2px solid var(--steel)", paddingRight: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "bold", flexDirection: "row-reverse" }}>
            <span style={{ color: "#ffffff" }}>MAQ SOFTWARE // PIT STOP 01</span>
            <span style={{ color: "var(--steel)" }}>2025 - 2026</span>
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8.5px", marginTop: "2px" }}>
            ROLE: SOFTWARE ENGINEER 1 (PROMOTED FROM ASSOCIATE SE)
          </div>
          
          <div style={{ background: "#09090b", border: "1px solid #151518", padding: "8px", borderRadius: "0px", marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--steel)", display: "flex", flexDirection: "column", gap: "3px", textAlign: "right" }}>
            <div>200M+ VM telemetry rows/day <span style={{ color: "#fff" }}>:DATA VOLUME</span></div>
            <div>Fabric, Synapse, PySpark & KQL <span style={{ color: "#fff" }}>:ARCHITECTURE</span></div>
            <div>Ingestion frameworks & ETL workflows <span style={{ color: "#fff" }}>:OWNERSHIP</span></div>
            <div>75% workflow runtime reduction // 70% incident drop <span style={{ color: "#41ff72" }}>:IMPACT</span></div>
          </div>
        </div>

        {/* IIIT Guwahati Academic Log */}
        <div style={{ borderRight: "2px solid var(--steel)", paddingRight: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "bold", flexDirection: "row-reverse" }}>
            <span style={{ color: "#ffffff" }}>IIIT GUWAHATI // DEV STAGE 01</span>
            <span style={{ color: "var(--steel)" }}>2021 - 2025</span>
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8.5px", marginTop: "2px" }}>
            PROGRAM: B.TECH COMPUTER SCIENCE & ENGINEERING
          </div>
          <div style={{ fontSize: "9.5px", color: "var(--steel)", fontFamily: "var(--font-mono)", marginTop: "4px", lineHeight: "1.4" }}>
            Core computational work on DRAM/NVM cache replacement policies (ChampSim), NLP text classification architectures, and distributed ledger systems.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RACE STRATEGY (LEADERSHIP / MBA) SECTION ──────────
function RaceStrategySection() {
  const visible = useSectionVisibility("RACE_STRATEGY");

  return (
    <div
      className={`section-content tech-panel ${visible ? "visible" : "hidden"}`}
      style={{
        top: "14vh",
        left: "6vw",
        maxWidth: "460px",
      }}
    >
      <div className="tech-panel-screws" />
      <div className="panel-header">
        <div className="panel-title">DECISION MATRIX // SECTOR 5</div>
        <h2 className="panel-main-heading">RACE STRATEGY</h2>
        <div className="panel-subtitle">LEADERSHIP & COMPILING TRADEOFFS</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "9.5px", lineHeight: "1.4" }}>
        <div style={{ borderBottom: "1px solid #141416", paddingBottom: "6px" }}>
          <div style={{ color: "var(--orange)", fontWeight: "bold" }}>[DECISION 01: GRAPH SIMPLICITY]</div>
          <div style={{ color: "var(--steel)", marginTop: "1px" }}>
            Opting for solid space-frame chassis patterns instead of deep inheritance. Reducing system weight ensures higher operating agility.
          </div>
        </div>

        <div style={{ borderBottom: "1px solid #141416", paddingBottom: "6px" }}>
          <div style={{ color: "var(--orange)", fontWeight: "bold" }}>[DECISION 02: OBSERVABILITY COMPLIANCE]</div>
          <div style={{ color: "var(--steel)", marginTop: "1px" }}>
            Heartbeat metrics and telemetry ingest loops should be developed synchronously, not as post-failure diagnostic layers.
          </div>
        </div>

        <div>
          <div style={{ color: "#ffffff", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>
            ENGINEER NOTES
          </div>
          <div style={{ color: "var(--steel)", background: "#09090b", border: "1px solid #151518", padding: "8px", fontSize: "9px" }}>
            &quot;I enjoy building clean pipelines that process massive volumes, responsive technical panels that respect strict mechanical limits, and CI/CD integrations that automate operational friction away.&quot;
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PIT WALL RADIO (CONTACT) SECTION ──────────────────
function PitWallRadioSection() {
  const visible = useSectionVisibility("PIT_WALL");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { playAudio } = usePortfolio();

  const handleDownloadClick = (e: React.MouseEvent) => {
    if (isExporting) return;
    e.preventDefault();
    setIsExporting(true);
    setExportProgress(0);
    playAudio('static');

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsExporting(false);
          playAudio('chirp');
          window.open(CONTACT.resume, "_blank");
        }, 300);
      }
      setExportProgress(current);
    }, 120);
  };

  return (
    <div
      className={`section-content tech-panel ${visible ? "visible" : "hidden"}`}
      style={{
        bottom: "16vh",
        left: "6vw",
        transform: `translateY(${(1 - (visible ? 1 : 0)) * 20}px)`,
        maxWidth: "480px"
      }}
    >
      <div className="tech-panel-screws" />
      <div className="panel-header">
        <div className="panel-title">SECTOR 6 // PIT WALL RADIO</div>
        <h2 className="panel-main-heading">TEAM COMMUNICATIONS</h2>
        <div className="panel-subtitle">TRANSCRIPT INGESTION LINKS</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "10.5px" }}>
        <div>
          <span style={{ color: "var(--orange)" }}>[PIT WALL]:</span> <span style={{ color: "var(--titanium)" }}>&quot;Driver, box this lap. Confirm ingestion lines. Over.&quot;</span>
        </div>
        <div>
          <span style={{ color: "#ffffff" }}>[DRIVER]:</span> <span style={{ color: "var(--steel)" }}>&quot;Copy. Ingestion pathways active. Transmitting contact feeds.&quot;</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start", marginTop: "16px" }}>
        <a href={`mailto:${CONTACT.email}`} className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
          EMAIL // {CONTACT.email}
        </a>
        <CopyEmailButton />
        <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
          GITHUB // github.com/33SN0W
        </a>
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
          LINKEDIN // linkedin.com/in/prateek-00a970228
        </a>
      </div>

      <div style={{ marginTop: "20px" }}>
        {isExporting ? (
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}>
            EXPORTING SPECIFICATION // {exportProgress}% [ {"█".repeat(exportProgress / 10).padEnd(10, "░")} ]
          </div>
        ) : (
          <a
            href={CONTACT.resume}
            onClick={handleDownloadClick}
            className="link-subtle"
            style={{ borderBottom: "1px solid var(--orange)", fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--orange)" }}
          >
            [EXPORT FACTORY BLUEPRINT SPEC ↗]
          </a>
        )}
      </div>
    </div>
  );
}

// ─── POSTER DETAILS MODAL ──────────────────────────────
function PosterModal() {
  const { focusedPoster, setFocusedPoster } = usePortfolio();
  const [animateProgress, setAnimateProgress] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, !!focusedPoster, () => setFocusedPoster(null));

  useEffect(() => {
    if (!focusedPoster) return;
    let curr = 0;
    const interval = setInterval(() => {
      curr += 5;
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
  }, [focusedPoster]);

  if (!focusedPoster) return null;

  const data = focusedPoster in POSTER_DATA ? POSTER_DATA[focusedPoster as PosterKey] : null;
  if (!data) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="poster-modal-title"
      onClick={() => setFocusedPoster(null)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5, 5, 5, 0.82)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        pointerEvents: "auto",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#08080a",
          border: "1px solid var(--orange)",
          borderRadius: "0px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxShadow: "0 0 32px rgba(255, 40, 0, 0.15)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ borderBottom: "1px solid #222", paddingBottom: "10px" }}>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em" }}>
            SPECIFICATION REPORT
          </div>
          <h2
            id="poster-modal-title"
            style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "13px", marginTop: "4px", fontWeight: "bold" }}
          >
            {data.title}
          </h2>
          <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", marginTop: "2px" }}>
            {data.subtitle}
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8.5px", marginTop: "6px", letterSpacing: "0.05em" }}>
            TELEMETRY SCANNING: {Math.round(animateProgress)}% [{ "█".repeat(Math.floor(animateProgress / 10)).padEnd(10, "░") }]
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {data.sections.map((sect, i) => (
            <div key={i} style={{ borderBottom: i < data.sections.length - 1 ? "1px solid #141416" : "none", paddingBottom: "10px" }}>
              <div style={{ color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "9.5px", fontWeight: "bold", textTransform: "uppercase" }}>
                {sect.label}
              </div>
              <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.45", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                {sect.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px", borderTop: "1px solid #222", paddingTop: "10px" }}>
          <button
            type="button"
            onClick={() => setFocusedPoster(null)}
            aria-label="Close poster details"
            style={{
              background: "transparent",
              border: "1px solid var(--steel)",
              color: "var(--titanium)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              padding: "5px 14px",
              cursor: "pointer",
              borderRadius: "0px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--orange)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--steel)";
              e.currentTarget.style.color = "var(--titanium)";
            }}
          >
            [CLOSE_SESSION]
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BIKE CAD TELEMETRY PANEL ─────────────────────────
function BikeTelemetryPanel() {
  const { activeBikePart, setActiveBikePart } = usePortfolio();
  if (!activeBikePart) return null;

  const partData: Record<string, { title: string; subtitle: string; skills: string[]; status: string; buildNotes: string }> = {
    engine: {
      title: "PROPULSION ENGINE UNIT // SPECIFICATIONS",
      subtitle: "Ingestion & Processing Core",
      skills: ["Python", "Go", "PySpark", "ETL Pipelines"],
      status: "MOTOR: 373cc Single DOHC 44HP // BATTERY: 12V 8Ah // WEIGHT: 36 kg // EFFICIENCY: 94%",
      buildNotes: "Tuned fuel mappings. Development Log: Ingestion schedules handle high RPM stress loads. Lessons Learned: High RPM vibrations require scheduling lock bounds."
    },
    frame: {
      title: "STRUCTURAL CHASSIS & SKELETON // ANALYSIS",
      subtitle: "System Architecture & Layouts",
      skills: ["System Design", "Cloud Architecture", "Database Partitioning"],
      status: "MOTOR: N/A // BATTERY: N/A // WEIGHT: 14 kg // EFFICIENCY: 100% Structural",
      buildNotes: "Welded space frame load paths. Development Log: Configured central structural load balance. Lessons Learned: Triangulated nodes optimize data routing stability."
    },
    suspension: {
      title: "WP KINEMATIC SUSPENSION LINKAGE // LOGS",
      subtitle: "Memory & Cache Optimization",
      skills: ["Cache Policies", "LRU Eviction", "ChampSim Simulator", "C++"],
      status: "MOTOR: N/A // BATTERY: N/A // WEIGHT: 8 kg // EFFICIENCY: WP Pressurized",
      buildNotes: "Calibrated rebound dampening. Development Log: Dampers buffer latency spike access rates. Lessons Learned: Rebound frequencies act like replacement eviction bounds."
    },
    rear_section: {
      title: "REAR TRACTION & STORAGE HUB // METRICS",
      subtitle: "Data Lakes & Storage Infrastructure",
      skills: ["Azure Synapse", "Microsoft Fabric", "Delta Lake", "Azure SQL"],
      status: "MOTOR: Chain Drive // BATTERY: N/A // WEIGHT: 19 kg // EFFICIENCY: 96% Ingest Rate",
      buildNotes: "Tuned gear ratios. Development Log: Maintained parquet historical tables. Lessons Learned: High torque gear transfers prevent index slip under loads."
    },
    electrical: {
      title: "IGNITION & CONTROL ELECTRONICS // HUD",
      subtitle: "CI/CD & Release Engineering Automation",
      skills: ["CI/CD DevOps", "Docker", "GitHub Actions", "Azure DevOps"],
      status: "MOTOR: N/A // BATTERY: Central distribution // WEIGHT: 6 kg // EFFICIENCY: 98% Delivery",
      buildNotes: "Mapped projector LED wiring grids. Development Log: Continuous status updates automated. Lessons Learned: Voltage limits match gate checks."
    }
  };

  const data = partData[activeBikePart];
  if (!data) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "14vh",
        left: "4vw",
        width: "360px",
        background: "rgba(8, 8, 9, 0.95)",
        border: "1px solid var(--orange)",
        borderRadius: "0px",
        padding: "20px",
        zIndex: 9999,
        fontFamily: "var(--font-mono)",
        boxShadow: "0 0 24px rgba(255, 40, 0, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "8px" }}>
        <span style={{ color: "var(--orange)", fontSize: "9px", letterSpacing: "0.12em", fontWeight: "bold" }}>CAD INSPECTION ACTIVE</span>
        <button
          onClick={() => setActiveBikePart(null)}
          style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: "9px", fontFamily: "var(--font-mono)" }}
          onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
          onMouseOut={(e) => e.currentTarget.style.color = "#666"}
        >
          [EXIT_CAD]
        </button>
      </div>

      <div>
        <h3 style={{ color: "#ffffff", fontSize: "11px", margin: 0, fontWeight: "bold" }}>{data.title}</h3>
        <p style={{ color: "var(--steel)", fontSize: "7.5px", margin: "1px 0 0 0" }}>{data.subtitle}</p>
      </div>

      <div>
        <span style={{ color: "var(--steel)", fontSize: "7.5px" }}>VEHICLE STATUS //</span>
        <div style={{ fontSize: "8px", color: "#ffffff", border: "1px solid #222", padding: "6px", background: "#08080a", marginTop: "3px" }}>
          {data.status}
        </div>
      </div>

      <div>
        <span style={{ color: "var(--steel)", fontSize: "7.5px" }}>MAPPED SKILLS //</span>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "4px" }}>
          {data.skills.map((s, i) => (
            <span key={i} style={{ fontSize: "8px", color: "var(--orange)", border: "1px solid rgba(255, 40, 0, 0.15)", padding: "2px 6px", background: "rgba(255, 40, 0, 0.02)" }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #222", paddingTop: "8px" }}>
        <span style={{ color: "var(--steel)", fontSize: "7.5px" }}>BUILD NOTES //</span>
        <p style={{ fontSize: "8.5px", color: "var(--steel)", lineHeight: "1.4", margin: "3px 0 0 0" }}>
          {data.buildNotes}
        </p>
      </div>
    </div>
  );
}

// ─── HUD OVERLAY (TRACK & STATUS) ──────────────────────
function HUDOverlay() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  
  const pathRef = useRef<SVGPathElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  
  // Loading status
  useEffect(() => {
    THREE.DefaultLoadingManager.onStart = () => {
      setIsLoadingComplete(false);
    };
    THREE.DefaultLoadingManager.onLoad = () => {
      setIsLoadingComplete(true);
      setLoadingProgress(100);
    };
    THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
      const p = Math.round((loaded / total) * 100);
      setLoadingProgress(p);
      if (loaded === total) setIsLoadingComplete(true);
    };

    const timer = setTimeout(() => {
      setIsLoadingComplete(true);
      setLoadingProgress(100);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Cursor tracker
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.style.cursor === "pointer" ||
        target.closest(".nav-dot-wrapper");
      if (interactive) {
        cursor.style.width = "22px";
        cursor.style.height = "22px";
      } else {
        cursor.style.width = "12px";
        cursor.style.height = "12px";
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  // Track Progress
  useEffect(() => {
    const path = pathRef.current;
    const circle = circleRef.current;
    if (!path || !circle) return;
    const length = path.getTotalLength();

    const updateTrackDot = () => {
      const p = getProgress();
      const point = path.getPointAtLength(p * length);
      circle.setAttribute("cx", String(point.x));
      circle.setAttribute("cy", String(point.y));
    };

    updateTrackDot();
    return subscribe(updateTrackDot);
  }, []);

  return (
    <>
      {/* HUD Cursor */}
      <div
        ref={cursorRef}
        className="hud-cursor-circle"
        style={{
          position: "fixed",
          left: "-100px",
          top: "-100px",
          transform: "translate(-50%, -50%)",
          width: "12px",
          height: "12px",
          border: "1px solid var(--orange)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "width 0.15s ease, height 0.15s ease",
        }}
      >
        <div style={{ width: "2px", height: "2px", background: "var(--orange)", borderRadius: "50%" }} />
      </div>

      {/* Ingestion status (shifted up to clear bottom telemetry strip) */}
      <div
        style={{
          position: "fixed",
          bottom: "3.5rem",
          left: "2rem",
          zIndex: 900,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
        }}
      >
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: isLoadingComplete ? "#41ff72" : "var(--orange)",
            boxShadow: isLoadingComplete ? "0 0 6px #41ff72" : "0 0 6px var(--orange-glow)",
          }}
        />
        <span style={{ color: "var(--titanium)" }}>
          {isLoadingComplete
            ? "TELEMETRY LINK: ACTIVE // NOMINAL"
            : `TELEMETRY LINK: COMPILING // ${loadingProgress}%`}
        </span>
      </div>

      {/* Red Bull Ring (Spielberg) Track map (shifted up to clear bottom strip) */}
      <div
        style={{
          position: "fixed",
          bottom: "3.5rem",
          right: "2rem",
          zIndex: 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "5px",
        }}
      >
        <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.1em" }}>
          RED BULL RING PROGRESS
        </div>
        <div style={{ position: "relative", width: "110px", height: "80px" }}>
          <svg width="100%" height="100%" viewBox="0 0 500 500">
            <path
              ref={pathRef}
              d="m460.715 363.195-2.743-3.298a30.76 30.76 0 0 0-12.787-9.099c-28.347-10.668-144.043-54.216-165.073-62.172-13.48-5.1-22.998-7.179-32.852-7.179-5.879 0-11.594.738-18.21 1.596l-2.824.363c-8.696 1.11-20.316 6.554-34.534 16.184-8.62 5.83-20.474 5.84-29.11.021a29.4 29.4 0 0 1-12.78-20.936l-7.272-61.646c-1.018-8.633 2.157-17.355 8.487-23.334l1.86-1.755c8.862-8.359 22.983-10.006 33.548-3.884 19.288 11.183 45.635 26.677 61.63 36.976 8.58 5.526 18.928 8.327 30.755 8.327 15.27 0 30.606-4.538 42.93-8.186l4.69-1.375c4.92-1.426 10.12-3.745 15.456-6.902 7.347-4.344 11.499-12.308 10.835-20.784s-6.007-15.705-13.948-18.86c-23.266-9.244-52.174-22.847-67.334-30.133a141 141 0 0 1-18.173-10.464C231.21 121.637 175.9 87.962 144.892 69.226a249.5 249.5 0 0 0-42.344-20.384C85.92 42.69 66.59 36.02 53.302 31.505c-6-2.038-12.657.313-16.084 5.56-2.551 3.899-2.942 8.787-1.045 13.07l29.974 67.736a185.7 185.7 0 0 1 15.662 64.962c.59 10.464 1.068 21.278 1.45 31.462a620 620 0 0 0 12.985 104.718l21.938 103.591c2.045 9.648 10.025 16.85 19.858 17.92l259.13 28.244c1.606.175 3.22.303 4.833.359a185 185 0 0 0 6.026.102c18.269 0 30.411-2.982 37.379-5.485 7.615-2.736 12.981-9.75 13.67-17.87l5.856-69.273a18.42 18.42 0 0 0-4.22-13.406z"
              fill="none"
              stroke="#1f1f22"
              strokeWidth="10"
            />
            <circle
              ref={circleRef}
              cx="0"
              cy="0"
              r="14"
              fill="var(--orange)"
              style={{ filter: "drop-shadow(0 0 8px var(--orange-glow))" }}
            />
          </svg>
        </div>
      </div>
    </>
  );
}

// ─── PERSISTENT BOTTOM TELEMETRY STRIP ──────────────────
function LiveTelemetryStrip() {
  const { livery } = usePortfolio();
  const themeColor = LIVERIES[livery]?.color || "#ff2800";
  const [rpmVal, setRpmVal] = useState(8500);
  const [cpuUsage, setCpuUsage] = useState(24);

  // Animate values slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setRpmVal(Math.round(8250 + Math.random() * 550));
      setCpuUsage(Math.round(18 + Math.random() * 12));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressChars = Math.round((rpmVal / 9000) * 12);
  const rpmBar = "█".repeat(progressChars).padEnd(12, "░");

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "36px",
        background: "#060608",
        borderTop: "1px solid #1a1a1d",
        zIndex: 9999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        color: "var(--titanium)",
        pointerEvents: "auto",
        boxSizing: "border-box"
      }}
    >
      {/* Metrics Layout */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--steel)" }}>SIM RPM</span>
          <span style={{ color: themeColor, fontWeight: "bold" }}>[{rpmBar}] {rpmVal.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--steel)" }}>SYSTEM STATUS</span>
          <span style={{ color: "#41ff72", fontWeight: "bold" }}>NOMINAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--steel)" }}>SIM CPU</span>
          <span style={{ color: "#ffffff" }}>{cpuUsage}%</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--steel)" }}>LOCATION</span>
          <span style={{ color: "#ffffff" }}>IIM MUMBAI (INCOMING)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--steel)" }}>PIT STOP</span>
          <span style={{ color: "var(--orange)" }}>OPEN TO ROLES</span>
        </div>
      </div>

      {/* Recruiter Quick Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <a 
          href={CONTACT.resume} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            color: "var(--orange)", 
            textDecoration: "none", 
            fontWeight: "bold",
            border: "1px solid rgba(255, 40, 0, 0.25)",
            background: "rgba(255, 40, 0, 0.05)",
            padding: "2px 8px",
            borderRadius: "0px",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "var(--orange)";
            e.currentTarget.style.background = "rgba(255, 40, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 40, 0, 0.25)";
            e.currentTarget.style.background = "rgba(255, 40, 0, 0.05)";
          }}
        >
          [RESUME ↗]
        </a>
        <a 
          href={`mailto:${CONTACT.email}`} 
          style={{ color: "#ffffff", textDecoration: "none", borderBottom: "1px solid var(--steel)" }}
        >
          [EMAIL]
        </a>
        <a 
          href={CONTACT.github} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "#ffffff", textDecoration: "none", borderBottom: "1px solid var(--steel)" }}
        >
          [GITHUB]
        </a>
        <a 
          href={CONTACT.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "#ffffff", textDecoration: "none", borderBottom: "1px solid var(--steel)" }}
        >
          [LINKEDIN]
        </a>
      </div>
    </div>
  );
}

// ─── PROJECT DETAILS MODAL ──────────────────────────────
function ProjectModal() {
  const { focusedProjectIndex, setFocusedProjectIndex } = usePortfolio();
  const [animateProgress, setAnimateProgress] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, focusedProjectIndex !== null, () => setFocusedProjectIndex(null));

  useEffect(() => {
    if (focusedProjectIndex === null) return;
    let curr = 0;
    const interval = setInterval(() => {
      curr += 5;
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
  }, [focusedProjectIndex]);

  if (focusedProjectIndex === null) return null;

  const data = PROJECTS_DATA[focusedProjectIndex];
  if (!data) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={() => setFocusedProjectIndex(null)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5, 5, 5, 0.82)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        pointerEvents: "auto",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#08080a",
          border: "1px solid var(--orange)",
          borderRadius: "0px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxShadow: "0 0 32px rgba(255, 40, 0, 0.15)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <div style={{ borderBottom: "1px solid #222", paddingBottom: "10px" }}>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em" }}>
            PROJECT SPECIFICATION REPORT
          </div>
          <h2
            id="project-modal-title"
            style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "14px", marginTop: "4px", fontWeight: "bold" }}
          >
            {data.name.toUpperCase()}
          </h2>
          <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", marginTop: "2px" }}>
            TECH STACK // {data.tech}
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8.5px", marginTop: "6px", letterSpacing: "0.05em" }}>
            TELEMETRY SCANNING: {Math.round(animateProgress)}% [{ "█".repeat(Math.floor(animateProgress / 10)).padEnd(10, "░") }]
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ borderBottom: "1px solid #141416", paddingBottom: "10px" }}>
            <div style={{ color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "9.5px", fontWeight: "bold", textTransform: "uppercase" }}>
              OVERVIEW
            </div>
            <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.45", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
              {data.desc}
            </p>
          </div>

          <div style={{ borderBottom: "1px solid #141416", paddingBottom: "10px" }}>
            <div style={{ color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "9.5px", fontWeight: "bold", textTransform: "uppercase" }}>
              PROBLEM & CONSTRAINTS
            </div>
            <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.45", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
              <strong>PROBLEM:</strong> {data.problem}<br />
              <strong style={{ color: "var(--orange)" }}>CONSTRAINTS:</strong> {data.constraints}
            </p>
          </div>

          <div style={{ borderBottom: "1px solid #141416", paddingBottom: "10px" }}>
            <div style={{ color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "9.5px", fontWeight: "bold", textTransform: "uppercase" }}>
              ARCHITECTURE & TRADEOFFS
            </div>
            <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.45", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
              <strong>ARCHITECTURE:</strong> {data.architecture}<br />
              <strong style={{ color: "var(--orange)" }}>TRADEOFFS:</strong> {data.tradeoffs}
            </p>
          </div>

          <div>
            <div style={{ color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "9.5px", fontWeight: "bold", textTransform: "uppercase" }}>
              METRICS & SYSTEM SCALE
            </div>
            <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.45", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
              <strong>SCALE:</strong> {data.scale}<br />
              <strong style={{ color: "#41ff72" }}>IMPACT:</strong> {data.impact}
            </p>
          </div>
        </div>

        {/* Links Actions */}
        <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #222", paddingTop: "14px", marginTop: "6px" }}>
          {data.github && (
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                textAlign: "center",
                background: "rgba(255, 40, 0, 0.08)",
                border: "1px solid var(--orange)",
                color: "var(--orange)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                padding: "8px 16px",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--orange)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 40, 0, 0.08)";
                e.currentTarget.style.color = "var(--orange)";
              }}
            >
              [OPEN GITHUB REPOSITORY ↗]
            </a>
          )}
          {data.deck && (
            <a
              href={data.deck}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                textAlign: "center",
                background: "rgba(255, 40, 0, 0.08)",
                border: "1px solid var(--orange)",
                color: "var(--orange)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                padding: "8px 16px",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--orange)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 40, 0, 0.08)";
                e.currentTarget.style.color = "var(--orange)";
              }}
            >
              [OPEN PRESENTATION DECK ↗]
            </a>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #222", paddingTop: "10px" }}>
          <button
            type="button"
            onClick={() => setFocusedProjectIndex(null)}
            aria-label="Close project details"
            style={{
              background: "transparent",
              border: "1px solid var(--steel)",
              color: "var(--titanium)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              padding: "5px 14px",
              cursor: "pointer",
              borderRadius: "0px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--orange)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--steel)";
              e.currentTarget.style.color = "var(--titanium)";
            }}
          >
            [CLOSE_SESSION]
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OVERLAY ASSEMBLY ─────────────────────────────────
export default function Overlay() {
  return (
    <div className="overlay">
      <PaddockSection />
      <GarageSection />
      <BuildLogSection />
      <RaceHistorySection />
      <RaceStrategySection />
      <PitWallRadioSection />
      <PosterModal />
      <ProjectModal />
      <BikeTelemetryPanel />
      <HUDOverlay />
      <LiveTelemetryStrip />
    </div>
  );
}
