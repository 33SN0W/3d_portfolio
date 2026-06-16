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
import { getProgress, subscribe, type SectionKey, SECTIONS, scrollToSection } from "@/systems/scroll";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { LIVERIES } from "@/config/colors";

/** Computes section-local progress (0-1) for a given section */
function useSectionVisibility(sectionKey: SectionKey): boolean {
  const [visible, setVisible] = useState(false);
  const { activeBikePart } = usePortfolio();

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
    update();
    return subscribe(update);
  }, [update]);

  return activeBikePart ? false : visible;
}

// PROJECTS CONFIG
const PROJECTS_DATA = [
  {
    id: "senna2", // Maps to active suspension poster
    name: "YouTube Ad Recommender",
    tech: "Python // NLTK // Scikit-Learn",
    desc: "SVM video category classifier trained on 3,000+ ads to optimize target recommendations.",
    problem: "Poor recommendation precision due to highly sparse video metadata labels.",
    constraints: "Strict sub-15ms real-time inference latency constraints on standard CPU nodes.",
    tradeoffs: "Selected traditional SVM over heavy Transformer models, sacrificing 2% accuracy for 8x faster CPU speeds.",
    architecture: "Multi-threaded text pre-processors feeding parallelized TF-IDF feature pipelines.",
    scale: "Trained on 3,000+ custom-scraped ad segments.",
    impact: "+14% precision uptick, and 35% latency reduction."
  },
  {
    id: "ferrari", // Maps to SF-24 engine poster
    name: "Health App & Diagnostics",
    tech: "React Native // Flask // ML",
    desc: "Mobile health companion with automatic symptom inference and offline triage diagnostics.",
    problem: "Unreliable network coverage causing sync delays during critical diagnostic triages.",
    constraints: "Absolute patient privacy (zero cloud logging of sensitive data) and zero-network fallback.",
    tradeoffs: "Leveraged device-local SQLite storage and optimized model parameters to fit mobile constraints.",
    architecture: "React Native client communicating with a localized Flask symptom parser.",
    scale: "Triages 45+ standard symptom groupings with sub-50ms offline response times.",
    impact: "Zero leak logs recorded, HIPAA compliance verified."
  },
  {
    id: "ktm", // Maps to MotoGP V4 engine poster
    name: "Microsoft Fabric Workflows",
    tech: "Synapse // PySpark // CI-CD",
    desc: "Enterprise data engineering pipelines, DP-600 certified warehouse deployment.",
    problem: "High ingestion latency and fragmented structures across transactional workloads.",
    constraints: "Extreme transaction scale (200M+ rows processed daily) and schema drift.",
    tradeoffs: "Utilized Fabric direct-lake semantic modeling to bypass traditional import refresh cycles.",
    architecture: "Incremental PySpark staging notebooks loading compressed partitioned Delta Lakes.",
    scale: "Ingests 200M+ rows/day from fragmented transactional VM telemetry nodes.",
    impact: "40% database sync latency reduction."
  }
];

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
        <div className="panel-subtitle">SOFTWARE ENGINEER // SYSTEMS & DATA ARCHITECT</div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "10px", lineHeight: "1.4" }}>
        <div>
          <span style={{ color: "var(--steel)" }}>EDUCATION:</span>
          <span style={{ color: "#ffffff", marginLeft: "12px" }}>Incoming IIM Mumbai MBA (Systems & Strategy) // B.Tech CS IIIT Guwahati</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>CORE STACK:</span>
          <span style={{ color: "var(--orange)", marginLeft: "12px" }}>PySpark // Azure Synapse // Python // Go // SQL</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>SCALE INDEX:</span>
          <span style={{ color: "#ffffff", marginLeft: "12px" }}>200M+ daily records // 40% latency reductions // CI-CD automations</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>DIAGNOSTIC:</span>
          <span style={{ color: "#41ff72", marginLeft: "12px" }}>[TELEMETRY PIPELINES OPERATIONAL]</span>
        </div>
      </div>

      <p className="type-mono" style={{ color: "var(--orange)", fontSize: "8px", marginTop: "20px", opacity: 0.8, letterSpacing: "0.1em" }}>
        [SCROLL DOWN TO PROGRESS SCAN]
      </p>
    </div>
  );
}

// ─── GARAGE (CAR SETUP / SKILLS) SECTION ──────────────
function GarageSection() {
  const visible = useSectionVisibility("GARAGE");

  const skills = [
    { cat: "PROPULSION (Backend)", items: [{ name: "PySpark", color: "#ffd500" }, { name: "Python", color: "#ffd500" }, { name: "Go", color: "#41ff72" }, { name: "SQL", color: "#41ff72" }, { name: "KQL", color: "#41ff72" }] },
    { cat: "CHASSIS (Frontend)", items: [{ name: "React", color: "#41ff72" }, { name: "React Native", color: "#41ff72" }, { name: "TypeScript", color: "#41ff72" }, { name: "Tailwind CSS", color: "#41ff72" }] },
    { cat: "AERODYNAMICS (Cloud)", items: [{ name: "Microsoft Fabric", color: "#ffd500" }, { name: "Azure Synapse", color: "#ffd500" }, { name: "AWS", color: "#ffd500" }] },
    { cat: "TELEMETRY (Automation)", items: [{ name: "CI/CD Devops", color: "#ffd500" }, { name: "Git", color: "#41ff72" }, { name: "Docker", color: "#ffb36b" }] }
  ];

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
        <p style={{ fontSize: "7.5px", color: "var(--steel)", fontFamily: "var(--font-mono)" }}>
          [TIMING FEED LEGEND: <span style={{ color: "#ffd500" }}>■ GOLD</span> = CORE SPEC // <span style={{ color: "#41ff72" }}>■ GREEN</span> = PROFICIENT // <span style={{ color: "#ffb36b" }}>■ ORANGE</span> = FAMILIAR]
        </p>
      </div>
    </div>
  );
}

// ─── BUILD LOG (PROJECT DEPLOYMENTS) SECTION ───────────
function BuildLogSection() {
  const visible = useSectionVisibility("BUILD_LOG");
  const { setFocusedPoster, activeProjectIndex, setActiveProjectIndex, playAudio } = usePortfolio();

  return (
    <div
      className={`section-content tech-panel ${visible ? "visible" : "hidden"}`}
      style={{
        top: "14vh",
        left: "6vw",
        maxWidth: "480px",
      }}
    >
      <div className="tech-panel-screws" />
      <div className="panel-header">
        <div className="panel-title">BUILD LOG // SECTOR 3</div>
        <h2 className="panel-main-heading">PROJECT DEPLOYMENTS</h2>
        <div className="panel-subtitle">TECHNICAL SPECIFICATIONS & TRADEOFFS</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {PROJECTS_DATA.map((proj, idx) => {
          const isSelected = activeProjectIndex === idx;

          return (
            <div
              key={idx}
              style={{
                borderLeft: isSelected ? "2px solid var(--orange)" : "2px solid #1c1c1f",
                paddingLeft: "12px",
                cursor: "pointer",
                transition: "border-color 0.2s ease"
              }}
              onClick={() => {
                setActiveProjectIndex(idx);
                playAudio('chirp');
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "bold", color: isSelected ? "#ffffff" : "var(--titanium)" }}>
                  {proj.name}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "8.5px", color: "var(--steel)" }}>
                  {proj.tech}
                </span>
              </div>
              <p style={{ fontSize: "10px", color: "var(--steel)", lineHeight: "1.35", marginTop: "3px" }}>
                {proj.desc}
              </p>
              
              {isSelected && (
                <div style={{ marginTop: "8px", borderTop: "1px dashed #222", paddingTop: "8px", fontFamily: "var(--font-mono)", fontSize: "8.5px", color: "var(--steel)", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div><span style={{ color: "var(--orange)" }}>CONSTRAINTS:</span> {proj.constraints}</div>
                  <div><span style={{ color: "var(--orange)" }}>TRADEOFFS:</span> {proj.tradeoffs}</div>
                  <div><span style={{ color: "#ffffff" }}>ARCHITECTURE:</span> {proj.architecture}</div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                    <span style={{ color: "#41ff72" }}>SCALE: {proj.scale}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedPoster(proj.id);
                        playAudio('sweep');
                      }}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--orange)",
                        color: "var(--orange)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "8px",
                        padding: "2px 6px",
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
        {/* MAQ Software Telemetry Log */}
        <div style={{ borderRight: "2px solid var(--orange)", paddingRight: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "bold", flexDirection: "row-reverse" }}>
            <span style={{ color: "#ffffff" }}>MAQ SOFTWARE // PIT STOP 01</span>
            <span style={{ color: "var(--steel)" }}>2025 - PRESENT</span>
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8.5px", marginTop: "2px" }}>
            ROLE: SOFTWARE ENGINEER I // BIG DATA SYSTEMS
          </div>
          
          <div style={{ background: "#09090b", border: "1px solid #151518", padding: "8px", borderRadius: "0px", marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--steel)", display: "flex", flexDirection: "column", gap: "3px", textAlign: "right" }}>
            <div>200M+ transaction rows/day <span style={{ color: "#fff" }}>:DATA VOLUME</span></div>
            <div>Automated Azure Synapse notebooks <span style={{ color: "#fff" }}>:ARCHITECTURE</span></div>
            <div>End-to-end telemetry pipeline migration <span style={{ color: "#fff" }}>:OWNERSHIP</span></div>
            <div>40% database sync latency reduction <span style={{ color: "#41ff72" }}>:BUSINESS IMPACT</span></div>
          </div>
        </div>

        {/* IIIT Guwahati Academic Log */}
        <div style={{ borderRight: "2px solid var(--steel)", paddingRight: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "bold", flexDirection: "row-reverse" }}>
            <span style={{ color: "#ffffff" }}>IIIT GUWAHATI // DEV STAGE 01</span>
            <span style={{ color: "var(--steel)" }}>2021 - 2025</span>
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8.5px", marginTop: "2px" }}>
            PROGRAM: B.TECH COMPUTER SCIENCE
          </div>
          <div style={{ fontSize: "9.5px", color: "var(--steel)", fontFamily: "var(--font-mono)", marginTop: "4px", lineHeight: "1.4" }}>
            Focused core computational work on memory allocation layout design, database indexing bounds, distributed algorithms, and regression modeling.
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
            "I enjoy building clean pipelines that process massive volumes, responsive technical panels that respect strict mechanical limits, and CI/CD integrations that automate operational friction away."
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
          window.open("/resume.pdf", "_blank");
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
          <span style={{ color: "var(--orange)" }}>[PIT WALL]:</span> <span style={{ color: "var(--titanium)" }}>"Driver, box this lap. Confirm ingestion lines. Over."</span>
        </div>
        <div>
          <span style={{ color: "#ffffff" }}>[DRIVER]:</span> <span style={{ color: "var(--steel)" }}>"Copy. Ingestion pathways active. Transmitting contact feeds."</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start", marginTop: "16px" }}>
        <a href="mailto:prateek19701@gmail.com" className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
          EMAIL // prateek19701@gmail.com
        </a>
        <a href="https://github.com/33SN0W" target="_blank" rel="noopener noreferrer" className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
          GITHUB // github.com/33SN0W
        </a>
        <a href="https://linkedin.com/in/prateek-00a970228" target="_blank" rel="noopener noreferrer" className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
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
            href="/resume.pdf"
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

  useEffect(() => {
    if (!focusedPoster) return;
    setAnimateProgress(0);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 5;
      if (curr >= 100) {
        curr = 100;
        clearInterval(interval);
      }
      setAnimateProgress(curr);
    }, 16);
    return () => clearInterval(interval);
  }, [focusedPoster]);

  if (!focusedPoster) return null;

  const getPosterData = () => {
    switch (focusedPoster) {
      case "journey":
        return {
          title: "SYSTEMS ENGINEERING PATHWAY // CAREER JOURNEY",
          subtitle: "Prateek // IIIT Guwahati CS (Graduated 2025)",
          sections: [
            {
              label: "2021 — CS INCEPTION",
              value: "Entered IIIT Guwahati. Developed core systems concepts: pointer manipulation, thread safety, process trees, and cache-aligned layouts in C/C++."
            },
            {
              label: "2023 — SCALING PREDICTIONS (YOUTUBE AD RECOMMENDER)",
              value: "Engineered high-concurrency scraping scripts for YouTube ad metrics. Built TF-IDF vectorizers and Support Vector Machine classifiers, optimizing video recommendation accuracy to 87%."
            },
            {
              label: "2024 — CROSS-PLATFORM MOBILE DIAGNOSTICS (HEALTH APP)",
              value: "Created a React Native client backed by a Flask machine learning inference server. Integrated medical symptom matching engines and low-latency chart plotting."
            },
            {
              label: "2025 — CLOUD SYSTEM AUTOMATION (MAQ SOFTWARE)",
              value: "Automated large-scale Spark ETL processing pipelines. Built Microsoft Fabric data warehouses, Synapse workspaces, and robust multi-stage CI/CD pipelines in Azure DevOps. Certified DP-600 Synapse Analytics Engineer."
            }
          ]
        };
      case "resume":
        return {
          title: "ENGINEERING SPEC SHEET // RESUME SUMMARY",
          subtitle: "Prateek // Software Engineer & Data Architect",
          sections: [
            {
              label: "PROPULSION SYSTEM (BACKEND & PIPELINES)",
              value: "PySpark, Python, Go, SQL, KQL, REST APIs, parallel ingestion pipelines."
            },
            {
              label: "CHASSIS & INSTRUMENTATION (FRONTEND)",
              value: "React, React Native, TypeScript, Tailwind CSS, Framer Motion, HTML5/Canvas."
            },
            {
              label: "AERODYNAMICS (CLOUD INFRASTRUCTURE)",
              value: "Microsoft Fabric, Azure Synapse Analytics, Azure DevOps CI/CD, AWS, Docker."
            },
            {
              label: "WORK EXPERIENCE",
              value: "Software Engineer 1 @ MAQ Software (2025 - Present) // Associate Software Engineer @ MAQ Software (Jan - Jul 2025)"
            },
            {
              label: "EDUCATION & CERTIFICATION",
              value: "B.Tech in Computer Science @ IIIT Guwahati (2021 - 2025) // DP-600 Microsoft Certified Fabric Analytics Engineer"
            }
          ]
        };
      case "ferrari":
        return {
          title: "TECHNICAL DIRECTIVE // SCUDERIA FERRARI SF-24",
          subtitle: "Dept. Motorsport // Maranello, Italy",
          sections: [
            {
              label: "POWER UNIT // 066/12 HYBRID",
              value: "90° 1.6L V6 Turbocharged Internal Combustion Engine + MGU-H (heat) + MGU-K (kinetic, recovering 120kW / 161HP). Total output ~1000 HP."
            },
            {
              label: "CHASSIS & AERODYNAMICS",
              value: "Molded honeycomb carbon-fiber composite. Pull-rod front suspension, push-rod rear suspension. Advanced high-rake ground effect venturi tunnels."
            },
            {
              label: "HEALTH APP NARRATIVE ALIGNMENT",
              value: "Selected as the structural blueprint for the Health App & Diagnostics engine. Translating complex system parameters into reliable, robust diagnostics logic."
            }
          ]
        };
      case "ktm":
        return {
          title: "ENGINE BLOCK DETAIL // KTM RC16 MOTOGP V4",
          subtitle: "Mattighofen, Austria // Ready To Race",
          sections: [
            {
              label: "ENGINE CONFIGURATION // 75° V4",
              value: "1000cc liquid-cooled V4, pneumatic valves, DOHC, dry sump lubrication. Max engine speed: 18,500 RPM. Max output: 265+ HP."
            },
            {
              label: "CHASSIS KINEMATICS",
              value: "Triangulated chromoly steel trellis frame. WP pressurized forks, aluminum swingarm. Kinematic link rear damper."
            },
            {
              label: "FABRIC WORKFLOWS ALIGNMENT",
              value: "Selected as the blueprint for Microsoft Fabric Big Data Pipelines. High-speed, high-density throughput handling 200M+ rows daily with mechanical coordination."
            }
          ]
        };
      case "senna":
        return {
          title: "HISTORICAL LEGACY // AYRTON SENNA DA SILVA",
          subtitle: "1960 - 1994 // Three-Times Formula 1 World Champion",
          sections: [
            {
              label: "CHAMPIONSHIP PERFORMANCE",
              value: "World Champion: 1988, 1990, 1991 (McLaren Honda). 41 GP wins, 65 pole positions, 80 podiums."
            },
            {
              label: "MONACO GP SUPREMACY",
              value: "6 victories at the Monaco Grand Prix, including 5 consecutive wins between 1989-1993. The ultimate testament to precision driving."
            },
            {
              label: "RACING DOCTRINE",
              value: "“If you no longer go for a gap that exists, you are no longer a racing driver.” Represents aggressive, relentless optimization and refusal to settle."
            }
          ]
        };
      case "senna2":
        return {
          title: "ACTIVE SUSPENSION DIAGRAM // AYRTON SENNA LOTUS 99T",
          subtitle: "Formula 1 Season 1987 // Team Lotus // Honda V6 Turbo",
          sections: [
            {
              label: "LOTUS ACTIVE SUSPENSION TECHNOLOGY",
              value: "The first successful computer-controlled active suspension. Utilized hydraulic actuators driven by a computer processing chassis acceleration and height telemetry at 200 Hz."
            },
            {
              label: "YOUTUBE RECOMMENDER ALIGNMENT",
              value: "Selected as the blueprint for the YouTube Ad Recommender. Active optimization and feature vectorization to adapt to dynamic textual sparse conditions at 1000Hz."
            }
          ]
        };
      case "helmet":
        return {
          title: "INSPIRATION SHIELD // SHOEI X-15",
          subtitle: "Driver Inspirations & Systems Safety Philosophy",
          sections: [
            {
              label: "LEGENDARY DRIVERS",
              value: "Ayrton Senna (absolute, uncompromising focus), Charles Leclerc (mechanical precision under bounds), Marc Marquez (defying physics thresholds)."
            },
            {
              label: "SYSTEM DESIGNERS",
              value: "Adrian Newey (converting fluid dynamics into absolute mechanical downforce). Compiling data architectures with identical aerodynamic elegance."
            },
            {
              label: "CHASSIS COHESION",
              value: "Rigid composite outer structures protecting the inner processing core. Fallback failure limits and sandboxed container orchestration."
            }
          ]
        };
      case "notebook":
        return {
          title: "STRATEGIC DOCTRINE // SYSTEMS LOGBOOK",
          subtitle: "Prateek's Core Architectural Rules",
          sections: [
            {
              label: "RULE 01 // LEAVE NEGATIVE SPACE",
              value: "Do not over-engineer. Confidence is found in simplicity. Build light, readable, highly observable nodes. Complexity is technical debt."
            },
            {
              label: "RULE 02 // OBSERVABILITY IS NOT AN ADD-ON",
              value: "Heartbeats, latency trackers, and data validation stages are built directly into initial design matrices, not as post-failure patches."
            },
            {
              label: "RULE 03 // AUTOMATE COMPREHENSIVELY",
              value: "Every deployment cycle, ETL ingestion, and testing pass must compile automatically. Manual steps are single points of failure."
            }
          ]
        };
      case "coffee":
        return {
          title: "INGESTION RATIOS // CAFFEINE STATUS",
          subtitle: "Human-in-the-Loop Energy Analytics",
          sections: [
            {
              label: "CAPACITY // 85% FULL",
              value: "Double shot dark roast espresso. The physical fuel powering 2 AM cluster migrations, dependency resolutions, and canvas viewport builds."
            },
            {
              label: "METRIC CONVERSIONS",
              value: "C8H10N4O2 (caffeine) binds directly to human adenosine receptors, suppressing latency indicators in the carbon processing core."
            }
          ]
        };
      default:
        return null;
    }
  };

  const data = getPosterData();
  if (!data) return null;

  return (
    <div
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
            SPECIFICATION REPORT
          </div>
          <h2 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "13px", marginTop: "4px", fontWeight: "bold" }}>
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
            onClick={() => setFocusedPoster(null)}
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
      subtitle: "Distributed Systems Coordination",
      skills: ["Distributed Systems", "RPC Protocols", "Consensus Algorithms"],
      status: "MOTOR: N/A // BATTERY: N/A // WEIGHT: 8 kg // EFFICIENCY: WP Pressurized",
      buildNotes: "Calibrated rebound dampening. Development Log: Dampers buffer high frequency traffic spikes. Lessons Learned: Spring rates act like queue throttles."
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
    }, 1500);

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
          <span style={{ color: "var(--steel)" }}>RPM</span>
          <span style={{ color: themeColor, fontWeight: "bold" }}>[{rpmBar}] {rpmVal.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--steel)" }}>SYSTEM STATUS</span>
          <span style={{ color: "#41ff72", fontWeight: "bold" }}>NOMINAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--steel)" }}>CPU</span>
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
          href="/resume.pdf" 
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
          href="mailto:prateek19701@gmail.com" 
          style={{ color: "#ffffff", textDecoration: "none", borderBottom: "1px solid var(--steel)" }}
        >
          [EMAIL]
        </a>
        <a 
          href="https://github.com/33SN0W" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "#ffffff", textDecoration: "none", borderBottom: "1px solid var(--steel)" }}
        >
          [GITHUB]
        </a>
        <a 
          href="https://linkedin.com/in/prateek-00a970228" 
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
      <BikeTelemetryPanel />
      <HUDOverlay />
      <LiveTelemetryStrip />
    </div>
  );
}
