"use client";

/**
 * Overlay — Typography floating over the 3D space
 *
 * No backgrounds. No cards. Just words appearing at the right moment.
 * Content fades in/out based on scroll progress.
 * The text is Prateek's voice. Not a design choice.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { getProgress, subscribe, type SectionKey, SECTIONS, scrollToSection } from "@/systems/scroll";
import { usePortfolio } from "@/providers/PortfolioProvider";

/** Computes section-local progress (0-1) for a given section */
function useSectionVisibility(sectionKey: SectionKey): boolean {
  const [visible, setVisible] = useState(false);

  const update = useCallback(() => {
    const p = getProgress();
    const section = SECTIONS[sectionKey];

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

  return visible;
}

// ─── PADDOCK (HERO) SECTION ───────────────────────────
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
      className={`section-content hud-card ${visible ? "visible" : "hidden"}`}
      style={{
        bottom: "12vh",
        left: "6vw",
        transform: `translateY(${(1 - (visible ? 1 : 0)) * 20}px)`,
        maxWidth: "460px",
      }}
    >
      <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "12px" }}>
        SPECIFICATION SHEET // SECTOR 1 // PADDOCK
      </div>
      <h1 
        className="type-hero" 
        style={{ 
          fontFamily: "var(--font-display)", 
          fontWeight: 900, 
          fontStyle: "italic", 
          letterSpacing: "-0.04em", 
          lineHeight: "0.95", 
          margin: "0 0 12px 0", 
          color: "#ffffff",
          textShadow: "0 0 15px rgba(255, 80, 0, 0.65), 0 0 30px rgba(255, 80, 0, 0.3)",
          textTransform: "uppercase"
        }}
      >
        PRATEEK
      </h1>
      
      <div style={{ borderTop: "1px solid #1c1c1f", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
        <div>
          <span style={{ color: "var(--steel)" }}>ROLE:</span>
          <span style={{ color: "#ffffff", marginLeft: "12px" }}>Software Engineer // Systems & Data Architect</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>PROGRAM:</span>
          <span style={{ color: "var(--orange)", marginLeft: "12px" }}>Incoming IIM Mumbai (MBA // Core Systems Leadership)</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>PREVIOUS:</span>
          <span style={{ color: "#ffffff", marginLeft: "12px" }}>Ex MAQ Software (Data Platform Architect)</span>
        </div>
        <div>
          <span style={{ color: "var(--steel)" }}>STATUS:</span>
          <span style={{ color: "#00ff00", marginLeft: "12px" }}>[TELEMETRY LINKS OPERATIONAL]</span>
        </div>
      </div>

      <p className="type-mono" style={{ color: "var(--orange)", fontSize: "8px", marginTop: "24px", opacity: 0.8, letterSpacing: "0.1em" }}>
        [SCROLL TO START SECTOR INGESTION]
      </p>
    </div>
  );
}

// ─── GARAGE (SKILLS & SETUP) SECTION ──────────────────
function GarageSection() {
  const visible = useSectionVisibility("GARAGE");

  // Timing screen colors: purple (#d100d1), green (#00d100), yellow (#ffff00)
  const skills = [
    { cat: "PROPULSION (Backend)", items: [{ name: "PySpark", color: "#d100d1" }, { name: "Python", color: "#d100d1" }, { name: "Go", color: "#00d100" }, { name: "SQL", color: "#00d100" }, { name: "KQL", color: "#00d100" }] },
    { cat: "CHASSIS (Frontend)", items: [{ name: "React", color: "#00d100" }, { name: "React Native", color: "#00d100" }, { name: "TypeScript", color: "#00d100" }, { name: "Tailwind CSS", color: "#00d100" }] },
    { cat: "AERODYNAMICS (Cloud)", items: [{ name: "Microsoft Fabric", color: "#d100d1" }, { name: "Azure Synapse", color: "#d100d1" }, { name: "AWS", color: "#ffff00" }] },
    { cat: "TELEMETRY (Automation)", items: [{ name: "CI/CD Devops", color: "#d100d1" }, { name: "Git", color: "#00d100" }, { name: "Docker", color: "#ffff00" }] }
  ];

  return (
    <div
      className={`section-content hud-card ${visible ? "visible" : "hidden"}`}
      style={{
        top: "14vh",
        right: "6vw",
        maxWidth: "450px",
        textAlign: "right",
      }}
    >
      <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px" }}>
        SECTOR 2 // GARAGE SETUP
      </div>
      <h2 className="type-heading" style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", borderBottom: "1px solid #222", paddingBottom: "6px" }}>
        CAR SETUP SHEET // TECH STACK
      </h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
        {skills.map((s, idx) => (
          <div key={idx}>
            <div style={{ fontSize: "10px", color: "var(--steel)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
              {s.cat}
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap", marginTop: "4px" }}>
              {s.items.map((item, itemIdx) => (
                <span
                  key={itemIdx}
                  style={{
                    color: item.color,
                    border: `1px solid ${item.color}33`,
                    background: `${item.color}0b`,
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    padding: "3px 8px",
                    borderRadius: "2px",
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #222", paddingTop: "8px", marginTop: "16px" }}>
        <p style={{ fontSize: "8px", color: "var(--steel)", fontFamily: "var(--font-mono)" }}>
          [TIMING FEED LEGEND: <span style={{ color: "#d100d1" }}>■ PURPLE</span> = STRONGEST / OUTRIGHT FASTEST // <span style={{ color: "#00d100" }}>■ GREEN</span> = PROFICIENT // <span style={{ color: "#ffff00" }}>■ YELLOW</span> = FAMILIAR]
        </p>
      </div>
    </div>
  );
}

// ─── STATIONS OF DEPLOYMENT (EXPERIENCE) ────────────────
function RaceHistorySection() {
  const visible = useSectionVisibility("RACE_HISTORY");

  return (
    <div
      className={`section-content hud-card ${visible ? "visible" : "hidden"}`}
      style={{
        top: "14vh",
        left: "6vw",
        maxWidth: "480px",
      }}
    >
      <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "8px" }}>
        DRIVER LOGS // SECTOR 3 // HISTORY
      </div>
      <h2 className="type-heading" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #1c1c1f", paddingBottom: "6px" }}>
        CAREER RACE SUMMARY & PIT STOPS
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
        {/* Driver Transfer Block (IIM Mumbai Admission) */}
        <div style={{ border: "1px solid rgba(255, 24, 0, 0.2)", background: "rgba(255, 24, 0, 0.02)", padding: "10px 12px", borderRadius: "2px" }}>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8.5px", fontWeight: "bold", letterSpacing: "0.08em" }}>
            [CURRENT DRIVER STATUS // TRANSFER ANNOUNCEMENT]
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#ffffff" }}>
            <span>PROGRAM: MBA // IIM MUMBAI</span>
            <span style={{ color: "var(--orange)" }}>2026 - 2028</span>
          </div>
          <div style={{ fontSize: "8.5px", color: "var(--steel)", fontFamily: "var(--font-mono)", marginTop: "4px", lineHeight: "1.4" }}>
            New program initialized. Strategic systems leadership and computational organization studies.
          </div>
        </div>

        {/* MAQ Software Telemetry Log */}
        <div style={{ borderLeft: "2px solid var(--orange)", paddingLeft: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "bold" }}>
            <span style={{ color: "#ffffff" }}>PIT STOP 01 // MAQ SOFTWARE</span>
            <span style={{ color: "var(--steel)" }}>2025 - PRESENT</span>
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8px", marginTop: "2px" }}>
            ROLE: SOFTWARE ENGINEER I // BIG DATA SYSTEMS
          </div>
          
          {/* Telemetry metrics payload */}
          <div style={{ background: "#09090b", border: "1px solid #151518", padding: "8px", borderRadius: "2px", marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "8.5px", color: "var(--steel)", display: "flex", flexDirection: "column", gap: "3px" }}>
            <div><span style={{ color: "#fff" }}>INGESTION RATE:</span> 200M+ transaction rows processed daily</div>
            <div><span style={{ color: "#fff" }}>ORCHESTRATION:</span> Automated Synapse pipelines and CI/CD releases</div>
            <div><span style={{ color: "#fff" }}>PLATFORMS:</span> Azure DevOps, Microsoft Fabric, Delta Lake</div>
            <div><span style={{ color: "#fff" }}>OUTCOMES:</span> Reduced ETL sync latency by 40%</div>
          </div>
        </div>

        {/* IIIT Guwahati Academic Log */}
        <div style={{ borderLeft: "2px solid var(--steel)", paddingLeft: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "bold" }}>
            <span style={{ color: "#ffffff" }}>DEVELOPMENT STAGE 01 // IIIT GUWAHATI</span>
            <span style={{ color: "var(--steel)" }}>2021 - 2025</span>
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8px", marginTop: "2px" }}>
            PROGRAM: B.TECH COMPUTER SCIENCE
          </div>
          <div style={{ fontSize: "8.5px", color: "var(--steel)", fontFamily: "var(--font-mono)", marginTop: "6px", lineHeight: "1.4" }}>
            Core computational study focusing on database systems, memory allocation bounds, distributed architectures, and machine learning models.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TROPHY WALL (PHILOSOPHY WALL) SECTION ────────────
function TrophyWallSection() {
  const visible = useSectionVisibility("TROPHY_WALL");

  const principles = [
    "01 // Measure twice before optimizing once.",
    "02 // Code performance is a fundamental feature.",
    "03 // Observability is not optional — it is architecture.",
    "04 // Automation compounds value over the lifecycle.",
    "05 // Elegant systems reduce complexity instead of hiding it."
  ];

  return (
    <div
      className={`section-content hud-card ${visible ? "visible" : "hidden"}`}
      style={{
        top: "14vh",
        right: "6vw",
        maxWidth: "440px",
        textAlign: "right",
      }}
    >
      <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "8px" }}>
        MUSEUM WALL // SECTOR 4 // PHILOSOPHY
      </div>
      <h2 className="type-heading" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #1c1c1f", paddingBottom: "6px" }}>
        ENGINEERING CORE DOCTRINE
      </h2>
      
      <div style={{ marginTop: "16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#ffffff", fontStyle: "italic", lineHeight: "1.5" }}>
        "I enjoy designing systems that are mechanically simple, operationally observable, and capable of scaling without unnecessary complexity."
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px", alignItems: "flex-end" }}>
        {principles.map((pr, idx) => (
          <div
            key={idx}
            style={{
              fontSize: "8.5px",
              color: "var(--steel)",
              fontFamily: "var(--font-mono)",
              borderBottom: "1px solid #141416",
              paddingBottom: "4px",
              width: "100%",
            }}
          >
            {pr}
          </div>
        ))}
      </div>

      <p className="type-mono" style={{ marginTop: "24px", color: "var(--orange)", fontSize: "8px", letterSpacing: "0.05em" }}>
        [MECHANICAL RESTRAINT OVER VISUAL EXCESS]
      </p>
    </div>
  );
}

// ─── PIT WALL RADIO (CONTACT) SECTION ─────────────────
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
      className={`section-content hud-card ${visible ? "visible" : "hidden"}`}
      style={{
        bottom: "12vh",
        left: "6vw",
        textAlign: "left",
        transform: `translateY(${(1 - (visible ? 1 : 0)) * 20}px)`,
        maxWidth: "480px"
      }}
    >
      <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px" }}>
        SECTOR 5 // PIT WALL RADIO
      </div>
      <h2 className="type-heading" style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", borderBottom: "1px solid #222", paddingBottom: "6px" }}>
        TEAM-RADIO TRANSCRIPT // COMMS CHECK
      </h2>

      {/* Radio Transcript styling */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
        <div>
          <span style={{ color: "var(--orange)" }}>[PIT WALL]:</span> <span style={{ color: "var(--titanium)" }}>"Driver, box this lap. We need contact confirmation. Over."</span>
        </div>
        <div>
          <span style={{ color: "#ffffff" }}>[DRIVER]:</span> <span style={{ color: "var(--steel)" }}>"Copy. Box confirmation received. Commencing ingestion links..."</span>
        </div>
        <div>
          <span style={{ color: "var(--orange)" }}>[PIT WALL]:</span> <span style={{ color: "var(--titanium)" }}>"Links deployed. Channels open for email, GitHub, and LinkedIn."</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start", marginTop: "20px" }}>
        <a href="mailto:prateek19701@gmail.com" className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
          EMAIL // prateek19701@gmail.com
        </a>
        <a href="https://github.com/33SN0W" target="_blank" rel="noopener noreferrer" className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
          GITHUB // github.com/33SN0W
        </a>
        <a href="https://linkedin.com/in/prateek-00a970228" target="_blank" rel="noopener noreferrer" className="link-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
          LINKEDIN // linkedin.com/in/prateek-00a970228
        </a>
      </div>

      <div style={{ marginTop: "24px" }}>
        {isExporting ? (
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.05em" }}>
            EXPORTING SPECIFICATION // {exportProgress}% [ {"█".repeat(exportProgress / 10).padEnd(10, "░")} ]
          </div>
        ) : (
          <a
            href="/resume.pdf"
            onClick={handleDownloadClick}
            className="link-subtle"
            style={{ borderBottom: "1px solid var(--steel)", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--orange)", borderBottomColor: "var(--orange)" }}
          >
            [EXPORT FACTORY SPECIFICATION SHEET ↗]
          </a>
        )}
      </div>
    </div>
  );
}

function PosterModal() {
  const { focusedPoster, setFocusedPoster } = usePortfolio();
  const [animateProgress, setAnimateProgress] = useState(0);

  useEffect(() => {
    if (!focusedPoster) return;
    setAnimateProgress(0);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 4;
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
              label: "NARRATIVE ALIGNMENT",
              value: "Symbolizes physical optimization under structural regulations. Translating computational CFD parameters into pure kinetic force transfer."
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
              label: "NARRATIVE ALIGNMENT",
              value: "Prateek's personal garage machine. A tangible, structural study of space-frame load paths and mechanical power density."
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
              label: "1987 SEASON & STREET CIRCUIT PERFORMANCE",
              value: "Lotus 99T powered by the Honda RA167E V6 Twin-Turbo (~1000 HP). Senna secured victories at Monaco and Detroit, demonstrating superior mechanical grip on bumpy street tracks."
            },
            {
              label: "NARRATIVE ALIGNMENT",
              value: "Represents the seamless integration of software and hardware control theory. Active adaptation to dynamic environments to maximize computational speed and grip."
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
        background: "rgba(5, 5, 5, 0.8)",
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
          background: "#0a0a0c",
          border: "1px solid var(--orange)",
          borderRadius: "4px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: "0 0 30px rgba(255, 105, 0, 0.15)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        {/* Modal Header */}
        <div style={{ borderBottom: "1px solid #222", paddingBottom: "12px" }}>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em" }}>
            SPECIFICATION REPORT
          </div>
          <h2 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "14px", marginTop: "4px", fontWeight: "bold" }}>
            {data.title}
          </h2>
          <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "11px", marginTop: "2px" }}>
            {data.subtitle}
          </div>
          <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "9px", marginTop: "6px", letterSpacing: "0.05em" }}>
            TELEMETRY SCANNING: {Math.round(animateProgress)}% [{ "█".repeat(Math.floor(animateProgress / 10)).padEnd(10, "░") }]
          </div>
        </div>

        {/* Modal Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {data.sections.map((sect, i) => (
            <div key={i} style={{ borderBottom: i < data.sections.length - 1 ? "1px solid #141416" : "none", paddingBottom: "12px" }}>
              <div style={{ color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>
                {sect.label}
              </div>
              <p style={{ color: "var(--steel)", fontSize: "12px", lineHeight: "1.5", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                {sect.value}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer / Close */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px", borderTop: "1px solid #222", paddingTop: "12px" }}>
          <button
            onClick={() => setFocusedPoster(null)}
            style={{
              background: "transparent",
              border: "1px solid var(--steel)",
              color: "var(--titanium)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              padding: "6px 16px",
              cursor: "pointer",
              borderRadius: "2px",
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

function HUDOverlay() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  
  const pathRef = useRef<SVGPathElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  
  // 1. Loading Manager Status
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

    // Default fallback if loading manager is quiet
    const timer = setTimeout(() => {
      setIsLoadingComplete(true);
      setLoadingProgress(100);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 3. HUD Cursor Tracking (direct DOM style modification to avoid React re-renders)
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
        cursor.style.width = "24px";
        cursor.style.height = "24px";
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

  // 4. Track Map progress dot (direct DOM modification to avoid React re-renders)
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
      {/* HUD Cursor (Only desktop / pointer: fine) */}
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

      {/* Bottom Left: System Status HUD */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "2rem",
          zIndex: 900,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: isLoadingComplete ? "#00ff00" : "var(--orange)",
            boxShadow: isLoadingComplete ? "0 0 8px #00ff00" : "0 0 8px var(--orange)",
          }}
        />
        <span style={{ color: "var(--titanium)" }}>
          {isLoadingComplete
            ? "TELEMETRY LINK: ACTIVE // SEC-01"
            : `TELEMETRY LINK: COMPILING SYSTEMS // ${loadingProgress}%`}
        </span>
      </div>

      {/* Bottom Right: Red Bull Ring F1 Track Map */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "2rem",
          zIndex: 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "6px",
        }}
      >
        <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.12em" }}>
          RED BULL RING // PROGRESS
        </div>
        <div style={{ position: "relative", width: "120px", height: "90px" }}>
          <svg width="100%" height="100%" viewBox="0 0 500 500">
            <path
              ref={pathRef}
              d="m460.715 363.195-2.743-3.298a30.76 30.76 0 0 0-12.787-9.099c-28.347-10.668-144.043-54.216-165.073-62.172-13.48-5.1-22.998-7.179-32.852-7.179-5.879 0-11.594.738-18.21 1.596l-2.824.363c-8.696 1.11-20.316 6.554-34.534 16.184-8.62 5.83-20.474 5.84-29.11.021a29.4 29.4 0 0 1-12.78-20.936l-7.272-61.646c-1.018-8.633 2.157-17.355 8.487-23.334l1.86-1.755c8.862-8.359 22.983-10.006 33.548-3.884 19.288 11.183 45.635 26.677 61.63 36.976 8.58 5.526 18.928 8.327 30.755 8.327 15.27 0 30.606-4.538 42.93-8.186l4.69-1.375c4.92-1.426 10.12-3.745 15.456-6.902 7.347-4.344 11.499-12.308 10.835-20.784s-6.007-15.705-13.948-18.86c-23.266-9.244-52.174-22.847-67.334-30.133a141 141 0 0 1-18.173-10.464C231.21 121.637 175.9 87.962 144.892 69.226a249.5 249.5 0 0 0-42.344-20.384C85.92 42.69 66.59 36.02 53.302 31.505c-6-2.038-12.657.313-16.084 5.56-2.551 3.899-2.942 8.787-1.045 13.07l29.974 67.736a185.7 185.7 0 0 1 15.662 64.962c.59 10.464 1.068 21.278 1.45 31.462a620 620 0 0 0 12.985 104.718l21.938 103.591c2.045 9.648 10.025 16.85 19.858 17.92l259.13 28.244c1.606.175 3.22.303 4.833.359a185 185 0 0 0 6.026.102c18.269 0 30.411-2.982 37.379-5.485 7.615-2.736 12.981-9.75 13.67-17.87l5.856-69.273a18.42 18.42 0 0 0-4.22-13.406z"
              fill="none"
              stroke="#2e2e30"
              strokeWidth="8"
            />
            <circle
              ref={circleRef}
              cx="0"
              cy="0"
              r="12"
              fill="var(--orange)"
              style={{ filter: "drop-shadow(0 0 15px var(--orange))" }}
            />
          </svg>
        </div>
      </div>
    </>
  );
}

// ─── BIKE CAD TELEMETRY PANEL ─────────────────────────
function BikeTelemetryPanel() {
  const { activeBikePart, setActiveBikePart } = usePortfolio();
  if (!activeBikePart) return null;

  const partData: Record<string, { title: string; subtitle: string; skills: string[]; metrics: string; details: string }> = {
    engine: {
      title: "PROPULSION ENGINE UNIT // SPECIFICATIONS",
      subtitle: "Ingestion & Processing Core",
      skills: ["Python", "Go", "PySpark", "ETL Pipelines"],
      metrics: "OUTPUT: 44 HP // MAX RPM: 18,500",
      details: "Translates high-scale data streams into structured analytics assets. Engineered with parallel ingestion clusters for low-latency batch scheduling."
    },
    frame: {
      title: "STRUCTURAL CHASSIS & SKELETON // ANALYSIS",
      subtitle: "System Architecture & Layouts",
      skills: ["System Design", "Cloud Architecture", "Database Partitioning"],
      metrics: "RIGIDITY: HIGH TORSIONAL // RATIO: 1:1",
      details: "Trellis skeleton mapping load path geometries. Focuses on structural integrity, eliminating bottlenecks, and establishing high availability layout matrices."
    },
    suspension: {
      title: "WP KINEMATIC SUSPENSION LINKAGE // LOGS",
      subtitle: "Distributed Systems Coordination",
      skills: ["Distributed Systems", "RPC Protocols", "Consensus Algorithms"],
      metrics: "MULTIPLIER: KINEMATIC FORCE // TENSION: 85N/mm",
      details: "Monoshock linkages buffering high-speed traffic spikes. Coordinates real-time node handshakes and minimizes latency drop-offs under load variance."
    },
    rear_section: {
      title: "REAR TRACTION & STORAGE HUB // METRICS",
      subtitle: "Data Lakes & Storage Infrastructure",
      skills: ["Azure Synapse", "Microsoft Fabric", "Delta Lake", "Azure SQL"],
      metrics: "STORAGE RATE: 200M+ ROWS/DAY // TYPE: COMPRESSED",
      details: "Delta Lake format clusters maintaining historical telemetry tables. Configured with Direct Lake access protocols to enable instantaneous reporting loops."
    },
    electrical: {
      title: "IGNITION & CONTROL ELECTRONICS // HUD",
      subtitle: "CI/CD & Release Engineering Automation",
      skills: ["CI/CD DevOps", "Docker", "GitHub Actions", "Azure DevOps"],
      metrics: "DEPLOYS: 140+ RUNS // STATUS: OPERATIONAL",
      details: "Automated pipelines driving continuous testing and deployment. Minimizes integration failure points through static analysis checks and test runs."
    }
  };

  const data = partData[activeBikePart];
  if (!data) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "12vh",
        left: "4vw",
        width: "360px",
        background: "rgba(10, 10, 12, 0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--orange)",
        borderRadius: "4px",
        padding: "20px",
        zIndex: 9999,
        fontFamily: "var(--font-mono)",
        boxShadow: "0 0 20px rgba(255, 24, 0, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "8px" }}>
        <span style={{ color: "var(--orange)", fontSize: "9px", letterSpacing: "0.15em", fontWeight: "bold" }}>CAD INSPECTION ACTIVE</span>
        <button
          onClick={() => setActiveBikePart(null)}
          style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: "10px", fontFamily: "var(--font-mono)" }}
          onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
          onMouseOut={(e) => e.currentTarget.style.color = "#666"}
        >
          [EXIT_CAD]
        </button>
      </div>

      <div>
        <h3 style={{ color: "#ffffff", fontSize: "11px", margin: 0, fontWeight: "bold" }}>{data.title}</h3>
        <p style={{ color: "var(--steel)", fontSize: "8px", margin: "2px 0 0 0" }}>{data.subtitle}</p>
      </div>

      <div style={{ fontSize: "8px", color: "#888", border: "1px dashed #222", padding: "6px", background: "#0c0c0e" }}>
        {data.metrics}
      </div>

      <div>
        <span style={{ color: "var(--steel)", fontSize: "8px" }}>MAPPED SKILLS //</span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
          {data.skills.map((s, i) => (
            <span key={i} style={{ fontSize: "8.5px", color: "var(--orange)", border: "1px solid rgba(255, 24, 0, 0.2)", padding: "2px 6px", background: "rgba(255, 24, 0, 0.04)" }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div style={{ fontSize: "9px", color: "var(--steel)", lineHeight: "1.4", borderTop: "1px solid #222", paddingTop: "8px" }}>
        {data.details}
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
      <RaceHistorySection />
      <TrophyWallSection />
      <PitWallRadioSection />
      <PosterModal />
      <BikeTelemetryPanel />
      <HUDOverlay />
    </div>
  );
}
