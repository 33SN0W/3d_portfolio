"use client";

import { useEffect, useState, useRef } from "react";

// Poster/Blueprint data
type PosterKey = "journey" | "resume" | "ferrari" | "ktm" | "senna" | "senna2";

const POSTER_DATA: Record<PosterKey, {
  title: string;
  subtitle: string;
  sections: { label: string; value: string }[];
}> = {
  journey: {
    title: "SYSTEMS ENGINEERING PATHWAY // CAREER JOURNEY",
    subtitle: "Prateek // Systems Strategy & Data Ingestion",
    sections: [
      {
        label: "2021 — CS INCEPTION (IIIT GUWAHATI)",
        value: "B.Tech CSE entry. Developed core systems concepts: pointer manipulation, thread safety, process trees, and cache-aligned memory layouts in C++."
      },
      {
        label: "2023 — SCALING PREDICTIONS (YOUTUBE AD RECOMMENDER)",
        value: "Engineered NLP text preprocessing and lemmatization pipelines. Built TF-IDF and SVM classifiers to achieve 98% accuracy on video recommendation."
      },
      {
        label: "2024 — ARCHITECTURE & CORE OPTIMIZATION",
        value: "Designed hybrid memory-aware cache policies over LRU (ChampSim), improving LLC hit rates by 5%. Built academic research discovery engines using sentence-transformers."
      },
      {
        label: "2025 - 2026 — CLOUD TELESCOPING & BIG DATA (MAQ SOFTWARE)",
        value: "Software Engineer 1. Built PySpark ingestion pipelines handling 200M+ rows/day. Reduced runtime execution from 12h to 3h. Certified DP-600 and DP-700."
      },
      {
        label: "2026 - 2028 — STRATEGIC MANAGEMENT (IIM MUMBAI)",
        value: "MBA Core. Blending deep computational expertise with systems operations, supply chain strategy, and decision models."
      }
    ]
  },
  resume: {
    title: "ENGINEERING SPEC SHEET // RESUME SUMMARY",
    subtitle: "Prateek // Software Engineer & Systems Strategist",
    sections: [
      {
        label: "PROPULSION SYSTEM (LANGUAGES & DATA)",
        value: "C++, C#, Java, Python, SQL, KQL, PySpark, Data Warehousing, ETL Pipelines."
      },
      {
        label: "CHASSIS & INSTRUMENTATION (FULL STACK)",
        value: "Next.js, React, React Native, Node.js, Flask, TypeScript, HTML/CSS, .NET."
      },
      {
        label: "AERODYNAMICS (CLOUD & DEVOPS)",
        value: "Microsoft Fabric, Azure Synapse, Azure Data Factory, ADLS, Azure DevOps, CI/CD, Docker."
      },
      {
        label: "WORK EXPERIENCE",
        value: "Software Engineer 1 (Associate SE -> SE 1) @ MAQ Software (Jan 2025 - May 2026) // Noida, India"
      },
      {
        label: "EDUCATION & CERTIFICATION",
        value: "MBA Core @ IIM Mumbai (2026 - 2028) // B.Tech CSE @ IIIT Guwahati (2021 - 2025) // Certified DP-600 & DP-700"
      }
    ]
  },
  ferrari: {
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
        label: "HYBRID CACHE POLICY ALIGNMENT",
        value: "Selected as the architectural blueprint for the Hybrid Memory-Aware Cache Policy. Translating complex power recovery parameters into high-efficiency memory access recency and eviction algorithms."
      }
    ]
  },
  ktm: {
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
        label: "ACADEMIC RECOMMENDATION ALIGNMENT",
        value: "Selected as the blueprint for the NLP Research Recommendation engine. High-speed, multi-dimensional semantic retrieval resembling the pneumatic control valves of a V4 power unit."
      }
    ]
  },
  senna: {
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
  },
  senna2: {
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
        label: "YOUTUBE RECOMMENDER ALIGNMENT",
        value: "Selected as the blueprint for the YouTube Ad Recommender. Active optimization and NLP feature engineering to adapt to dynamic textual conditions under CPU latency bounds."
      }
    ]
  }
};

const SECTIONS = [
  { id: "paddock", name: "PADDOCK", code: "SEC-01" },
  { id: "garage", name: "GARAGE", code: "SEC-02" },
  { id: "build_log", name: "BUILD LOG", code: "SEC-03" },
  { id: "history", name: "RACE HISTORY", code: "SEC-04" },
  { id: "strategy", name: "RACE STRATEGY", code: "SEC-05" },
  { id: "radio", name: "PIT WALL", code: "SEC-06" }
];

export default function MobileLayout() {
  const [activeSection, setActiveSection] = useState("paddock");
  const lapTimeRef = useRef<HTMLDivElement>(null);
  const [focusedPoster, setFocusedPoster] = useState<PosterKey | null>(null);
  const [animateProgress, setAnimateProgress] = useState(0);

  // 1. Lap Timer Stopwatch (counting up in real-time since load, direct DOM ref)
  useEffect(() => {
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
  }, []);

  // 2. Intersection Observer to detect scroll active sector
  useEffect(() => {
    const observers = SECTIONS.map((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(sec.id);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: "-20% 0px -50% 0px"
        }
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

  // 3. Simulated Telemetry Scanning Animation when poster selected
  useEffect(() => {
    if (!focusedPoster) return;
    setAnimateProgress(0);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 6;
      if (curr >= 100) {
        curr = 100;
        clearInterval(interval);
      }
      setAnimateProgress(curr);
    }, 16);
    return () => clearInterval(interval);
  }, [focusedPoster]);

  const skills = [
    { cat: "PROPULSION (Data & Systems)", items: [{ name: "PySpark", color: "#d100d1" }, { name: "Python", color: "#d100d1" }, { name: "SQL", color: "#d100d1" }, { name: "C++", color: "#00d100" }, { name: "KQL", color: "#00d100" }, { name: "Data Warehousing", color: "#00d100" }] },
    { cat: "CHASSIS (Full Stack & UX)", items: [{ name: "Next.js", color: "#d100d1" }, { name: "React", color: "#00d100" }, { name: "React Native", color: "#00d100" }, { name: "TypeScript", color: "#00d100" }, { name: "Flask", color: "#00d100" }, { name: "HTML/CSS", color: "#00d100" }, { name: ".NET", color: "#ffff00" }] },
    { cat: "AERODYNAMICS (Cloud Platforms)", items: [{ name: "Microsoft Fabric", color: "#d100d1" }, { name: "Azure Synapse", color: "#d100d1" }, { name: "Azure DevOps", color: "#d100d1" }, { name: "CI/CD", color: "#d100d1" }, { name: "Azure Data Factory", color: "#00d100" }, { name: "ADLS", color: "#00d100" }] },
    { cat: "TELEMETRY (Developer Tools & Sim)", items: [{ name: "Git / GitHub", color: "#00d100" }, { name: "Docker", color: "#00d100" }, { name: "Unity", color: "#ffff00" }, { name: "JIRA", color: "#ffff00" }] }
  ];

  const timeline = [
    { station: "STATION 01", role: "MBA Candidate", location: "IIM MUMBAI /", date: "2026 - 2028", details: "Focusing on operations management, supply chain strategy, decision sciences, systems modeling, and strategic sourcing." },
    { station: "STATION 02", role: "Software Engineer 1 (Associate SE -> SE 1)", location: "MAQ SOFTWARE // SYSTEMS & BIG DATA PLATFORMS", date: "JAN 2025 - MAY 2026", details: "Owned production data pipelines for Microsoft Azure Core Business Insights, processing 200M+ rows daily. Cut ETL runtimes from 12 hours to 3 hours (75% optimization). Modernized ingestion framework, replacing 300+ legacy pipelines." },
    { station: "STATION 03", role: "CS Academic Core", location: "IIIT GUWAHATI // CORE SYSTEMS COMPUTATION", date: "2021 - 2025", details: "Rigorous academic focus in CSE. Designed hybrid cache eviction simulator architectures, developed deep learning multi-label literature classification models, and studied distributed systems." }
  ];

  const posterMetadataList = [
    { key: "journey" as PosterKey, title: "Career Journey", code: "BP-01 // JOURNEY", desc: "Prateek's academic and industry trajectory blueprint." },
    { key: "resume" as PosterKey, title: "Resume summary", code: "BP-02 // RESUME", desc: "Core stack configuration and certifications checklist." },
    { key: "ferrari" as PosterKey, title: "Scuderia Ferrari SF-24", code: "PT-44 // SF24", desc: "Aero telemetry and chassis analysis of the SF-24." },
    { key: "ktm" as PosterKey, title: "KTM RC16 MotoGP V4", code: "PT-33 // RC16", desc: "Space frame design study and engine specifications." },
    { key: "senna" as PosterKey, title: "Ayrton Senna (Monaco)", code: "PT-08 // MONACO", desc: "Monaco GP historical telemetry and doctrine." },
    { key: "senna2" as PosterKey, title: "Ayrton Senna (Lotus 99T)", code: "PT-12 // LOTUS", desc: "Lotus 99T Active Suspension chassis blueprint." }
  ];

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
        overflowX: "hidden"
      }}
    >
      {/* ─── STICKY HEADER HUD ──────────────────────────────── */}
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
          fontFamily: "var(--font-mono)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#00ff00",
              boxShadow: "0 0 6px #00ff00"
            }}
          />
          <span style={{ fontSize: "10px", color: "var(--steel)" }}>
            {currentSecInfo.code} // <span style={{ color: "var(--orange)" }}>{currentSecInfo.name}</span>
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "8px", color: "var(--steel)", letterSpacing: "0.1em" }}>LAP TIME</div>
          <div ref={lapTimeRef} style={{ fontSize: "12px", color: "var(--orange)", fontWeight: "bold" }}>00:00.000</div>
        </div>
      </header>

      {/* ─── PADDOCK (HERO) ─────────────────────────────────── */}
      <section
        id="paddock"
        style={{
          minHeight: "calc(100vh - 50px)",
          padding: "36px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderBottom: "1px solid #111"
        }}
      >
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "8px" }}>
          SECTOR 1 // PADDOCK
        </span>
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "4.2rem",
            lineHeight: "0.9",
            fontWeight: "normal",
            letterSpacing: "-0.02em"
          }}
        >
          PRATEEK
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            textTransform: "uppercase",
            color: "var(--titanium)",
            marginTop: "16px",
            letterSpacing: "0.05em",
            lineHeight: "1.4"
          }}
        >
          Software Engineer // Systems & Data Architect
        </p>

        {/* Diagnostic Block */}
        <div
          style={{
            marginTop: "40px",
            padding: "16px",
            background: "#0a0a0c",
            border: "1px solid #222",
            borderRadius: "2px",
            fontFamily: "var(--font-mono)",
            fontSize: "10px"
          }}
        >
          <div style={{ color: "var(--orange)", marginBottom: "8px" }}>[SYSTEM REPORT]</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "var(--steel)" }}>
            <div>INGESTION LINK: <span style={{ color: "#00ff00" }}>ACTIVE</span></div>
            <div>STRESS RATINGS: <span style={{ color: "var(--warm-white)" }}>NOMINAL (1000Hz)</span></div>
            <div>CHASSIS MODE: <span style={{ color: "var(--warm-white)" }}>2D_FALLBACK</span></div>
            <div>LOCATION: <span style={{ color: "var(--warm-white)" }}>NEW DELHI // IN</span></div>
          </div>
        </div>
      </section>

      {/* ─── GARAGE (SKILLS) ────────────────────────────────── */}
      <section
        id="garage"
        style={{
          padding: "48px 20px",
          borderBottom: "1px solid #111"
        }}
      >
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 2 // GARAGE SETUP
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "20px" }}>
          CAR SETUP SHEET // TECH STACK
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {skills.map((s, idx) => (
            <div key={idx}>
              <div style={{ fontSize: "9px", color: "var(--steel)", fontFamily: "var(--font-mono)", textTransform: "uppercase", marginBottom: "6px" }}>
                {s.cat}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {s.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    style={{
                      color: item.color,
                      border: `1px solid ${item.color}33`,
                      background: `${item.color}0b`,
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      padding: "4px 8px",
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

        {/* Legend */}
        <div style={{ borderTop: "1px solid #222", paddingTop: "12px", marginTop: "24px" }}>
          <p style={{ fontSize: "8px", color: "var(--steel)", fontFamily: "var(--font-mono)", lineHeight: "1.4" }}>
            [TIMING BOARD FEED LEGEND:<br />
            <span style={{ color: "#d100d1" }}>■ PURPLE</span> = STRONGEST / OUTRIGHT FASTEST<br />
            <span style={{ color: "#00d100" }}>■ GREEN</span> = PROFICIENT // <span style={{ color: "#ffff00" }}>■ YELLOW</span> = FAMILIAR]
          </p>
        </div>
      </section>

      {/* ─── BUILD LOG (PROJECT BLUEPRINTS) ─────────────────── */}
      <section
        id="build_log"
        style={{
          padding: "48px 20px",
          borderBottom: "1px solid #111"
        }}
      >
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 3 // BUILD LOG
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "12px" }}>
          BLUEPRINT SPECIFICATIONS
        </h2>
        <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.5", marginBottom: "24px", fontFamily: "var(--font-display)" }}>
          Tap on any technical specification poster to fetch mechanical configurations and diagnostics telemetry.
        </p>

        {/* Blueprint Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {posterMetadataList.map((poster) => (
            <div
              key={poster.key}
              onClick={() => setFocusedPoster(poster.key)}
              style={{
                background: "#0a0a0c",
                border: "1px solid #1a1a1a",
                borderRadius: "0px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                cursor: "pointer",
                transition: "border-color 0.2s ease"
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.borderColor = "var(--orange)";
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.borderColor = "#1a1a1a";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: "var(--orange)", fontSize: "9px", letterSpacing: "0.05em" }}>{poster.code}</span>
                <span style={{ color: "var(--steel)", fontSize: "9px" }}>[TAP TO SCAN ↗]</span>
              </div>
              <h3 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "bold" }}>
                {poster.title.toUpperCase()}
              </h3>
              <p style={{ color: "var(--steel)", fontSize: "10px", lineHeight: "1.4", fontFamily: "var(--font-display)" }}>
                {poster.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WORK DEPLOYMENTS (TIMELINE) ────────────────────── */}
      <section
        id="history"
        style={{
          padding: "48px 20px",
          borderBottom: "1px solid #111"
        }}
      >
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 4 // RACE HISTORY
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "20px" }}>
          RACE HISTORY // EXPERIENCE LOGS
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {timeline.map((t, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px", borderBottom: idx < timeline.length - 1 ? "1px solid #141416" : "none", paddingBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: "var(--orange)", fontSize: "11px", fontWeight: "bold" }}>{t.station}</span>
                <span style={{ color: "var(--steel)", fontSize: "9px" }}>{t.date}</span>
              </div>
              <h3 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "bold" }}>
                {t.location}
              </h3>
              <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "9px", marginTop: "2px", letterSpacing: "0.02em" }}>{t.role.toUpperCase()}</div>
              <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.5", fontFamily: "var(--font-display)", marginTop: "4px" }}>
                {t.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── RACE STRATEGY (LEADERSHIP) ─────────────────────── */}
      <section
        id="strategy"
        style={{
          padding: "48px 20px",
          borderBottom: "1px solid #111"
        }}
      >
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 5 // RACE STRATEGY
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "20px" }}>
          DECISION MATRIX // LEADERSHIP
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontFamily: "var(--font-mono)", fontSize: "10.5px", lineHeight: "1.4" }}>
          <div style={{ borderBottom: "1px solid #141416", paddingBottom: "8px" }}>
            <div style={{ color: "var(--orange)", fontWeight: "bold" }}>[DECISION 01: SIMPLICITY]</div>
            <div style={{ color: "var(--steel)", marginTop: "2px" }}>
              Choosing lightweight structures (triangulated space frames) over heavy abstractions to optimize runtime speed.
            </div>
          </div>
          <div style={{ borderBottom: "1px solid #141416", paddingBottom: "8px" }}>
            <div style={{ color: "var(--orange)", fontWeight: "bold" }}>[DECISION 02: OBSERVABILITY]</div>
            <div style={{ color: "var(--steel)", marginTop: "2px" }}>
              Telemetry pipelines built-in from start line, guaranteeing immediate system health feedback.
            </div>
          </div>
          <div style={{ background: "#0a0a0c", border: "1px solid #222", padding: "12px", borderRadius: "2px" }}>
            <div style={{ color: "#ffffff", fontWeight: "bold", marginBottom: "4px" }}>ENGINEER NOTES // PHILOSOPHY</div>
            <div style={{ color: "var(--steel)" }}>
              "I build scalable big data pipelines, highly responsive modular UI screens, and robust cloud automation workflows."
            </div>
          </div>
        </div>
      </section>

      {/* ─── PIT WALL RADIO (CONTACT) ───────────────────────── */}
      <section
        id="radio"
        style={{
          padding: "48px 20px 80px 20px"
        }}
      >
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}>
          SECTOR 6 // PIT WALL RADIO
        </span>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #222", paddingBottom: "6px", marginBottom: "20px" }}>
          TEAM-RADIO TRANSCRIPT
        </h2>

        {/* Radio Transcript */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "10px", marginBottom: "32px" }}>
          <div>
            <span style={{ color: "var(--orange)" }}>[PIT WALL]:</span>{" "}
            <span style={{ color: "var(--titanium)" }}>"Driver, box this lap. We need contact confirmation. Over."</span>
          </div>
          <div>
            <span style={{ color: "#ffffff" }}>[DRIVER]:</span>{" "}
            <span style={{ color: "var(--steel)" }}>"Copy. Box confirmation received. Commencing ingestion links..."</span>
          </div>
          <div>
            <span style={{ color: "var(--orange)" }}>[PIT WALL]:</span>{" "}
            <span style={{ color: "var(--titanium)" }}>"Links deployed. Channels open for email, GitHub, and LinkedIn."</span>
          </div>
        </div>

        {/* Contact Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          <a
            href="mailto:prateek19701@gmail.com"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#0c0d10",
              border: "1px solid #222",
              borderRadius: "2px",
              padding: "12px 16px",
              color: "#ffffff",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "11px"
            }}
          >
            <span>EMAIL // prateek19701@gmail.com</span>
            <span style={{ color: "var(--orange)" }}>↗</span>
          </a>
          <a
            href="https://github.com/33SN0W"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#0c0d10",
              border: "1px solid #222",
              borderRadius: "2px",
              padding: "12px 16px",
              color: "#ffffff",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "11px"
            }}
          >
            <span>GITHUB // github.com/33SN0W</span>
            <span style={{ color: "var(--orange)" }}>↗</span>
          </a>
          <a
            href="https://linkedin.com/in/prateek-00a970228"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#0c0d10",
              border: "1px solid #222",
              borderRadius: "2px",
              padding: "12px 16px",
              color: "#ffffff",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "11px"
            }}
          >
            <span>LINKEDIN // prateek-00a970228</span>
            <span style={{ color: "var(--orange)" }}>↗</span>
          </a>
        </div>

        <div>
          <a
            href="/Prateek_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              borderBottom: "1px solid var(--orange)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--orange)",
              textDecoration: "none",
              paddingBottom: "4px"
            }}
          >
            [DOWNLOAD RESUME SPEC SHEET ↗]
          </a>
        </div>
      </section>

      {/* ─── POSTER DETAIL MODAL ────────────────────────────── */}
      {focusedPoster && (
        <div
          onClick={() => setFocusedPoster(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5, 5, 5, 0.9)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#0a0a0c",
              border: "1px solid var(--orange)",
              borderRadius: "4px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 0 25px rgba(255, 105, 0, 0.15)"
            }}
          >
            {/* Modal Header */}
            <div style={{ borderBottom: "1px solid #222", paddingBottom: "10px" }}>
              <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em" }}>
                SPECIFICATION REPORT
              </div>
              <h2 style={{ color: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "13px", marginTop: "4px", fontWeight: "bold" }}>
                {POSTER_DATA[focusedPoster].title}
              </h2>
              <div style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: "10px", marginTop: "2px" }}>
                {POSTER_DATA[focusedPoster].subtitle}
              </div>
              <div style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "8px", marginTop: "6px" }}>
                TELEMETRY SCANNING: {Math.round(animateProgress)}% [{"█".repeat(Math.floor(animateProgress / 10)).padEnd(10, "░")}]
              </div>
            </div>

            {/* Modal Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {POSTER_DATA[focusedPoster].sections.map((sect, i) => (
                <div key={i} style={{ borderBottom: i < POSTER_DATA[focusedPoster].sections.length - 1 ? "1px solid #141416" : "none", paddingBottom: "10px" }}>
                  <div style={{ color: "var(--titanium)", fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: "bold", textTransform: "uppercase" }}>
                    {sect.label}
                  </div>
                  <p style={{ color: "var(--steel)", fontSize: "11px", lineHeight: "1.45", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                    {sect.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Links if present */}
            {focusedPoster === "ferrari" && (
              <div style={{ display: "flex", gap: "12px", marginTop: "6px", borderTop: "1px dashed #222", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "9.5px" }}>
                <a href="https://github.com/33SN0W/champsim" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[GITHUB ↗]</a>
                <a href="https://raw.githubusercontent.com/33SN0W/champsim/main/endsem_presentation_prateek.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[PRESENTATION DECK ↗]</a>
              </div>
            )}
            {focusedPoster === "ktm" && (
              <div style={{ display: "flex", gap: "12px", marginTop: "6px", borderTop: "1px dashed #222", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "9.5px" }}>
                <a href="https://github.com/33SN0W/nlp_project" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[GITHUB ↗]</a>
                <a href="https://raw.githubusercontent.com/33SN0W/nlp_project/main/Research%20Literature%20Recommendation%20System%20and%20Academic%20Domain%20Predictor.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[PRESENTATION DECK ↗]</a>
              </div>
            )}
            {focusedPoster === "senna2" && (
              <div style={{ display: "flex", gap: "12px", marginTop: "6px", borderTop: "1px dashed #222", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "9.5px" }}>
                <a href="https://github.com/33SN0W/ad_reccomd" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>[GITHUB ↗]</a>
              </div>
            )}

            {/* Close Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #222", paddingTop: "10px" }}>
              <button
                onClick={() => setFocusedPoster(null)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--steel)",
                  color: "var(--titanium)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  padding: "6px 12px",
                  borderRadius: "2px"
                }}
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
