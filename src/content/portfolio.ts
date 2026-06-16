export type Project = {
  id: string;
  name: string;
  tech: string;
  desc: string;
  problem: string;
  constraints: string;
  tradeoffs: string;
  architecture: string;
  scale: string;
  impact: string;
  github: string;
  deck: string;
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "senna2",
    name: "YouTube Ad Recommender",
    tech: "Python // TF-IDF // Scikit-Learn",
    desc: "SVM video category classifier trained on 3,500+ videos and 6,600+ ad records to optimize recommendations.",
    problem: "Low matching precision due to sparse video metadata and high label noise.",
    constraints:
      "Required classification accuracy above 95% using high-density unigram/bigram textual features.",
    tradeoffs:
      "Selected SVM over deep transformer models to reduce computation cost and latency on CPU nodes.",
    architecture:
      "Lemmatization and NLP pre-processing pipelines feeding trained SVM and Naive Bayes classifiers.",
    scale: "Categorized 3,500+ videos and 6,600+ custom-scraped advertisement segments.",
    impact: "Achieved 97% Naive Bayes and 98% SVM accuracy on validation sets.",
    github: "https://github.com/33SN0W/ad_reccomd",
    deck: "",
  },
  {
    id: "ferrari",
    name: "Hybrid Memory Cache Design",
    tech: "C++ // ChampSim // Memory Systems",
    desc: "Frequency-aware and channel-aware cache eviction strategies over baseline LRU for DRAM/NVM architectures.",
    problem:
      "Excessive writebacks and latency bottlenecks on non-volatile memory (NVM) due to standard cache policy limits.",
    constraints: "Must execute within strict hardware cycle counts using the ChampSim simulator.",
    tradeoffs:
      "Designed slightly complex eviction computations to prioritize NVM longevity and reduce write fatigue.",
    architecture:
      "Custom eviction algorithms (P1 and P2) integrating access recency, frequency, and channel priority.",
    scale: "Evaluated across benchmark traces on a simulated 4-channel hybrid memory system.",
    impact: "Reduced NVM writebacks while maintaining instructions-per-cycle, boosting LLC hit rate by up to 5%.",
    github: "https://github.com/33SN0W/champsim",
    deck: "https://raw.githubusercontent.com/33SN0W/champsim/main/endsem_presentation_prateek.pdf",
  },
  {
    id: "ktm",
    name: "Academic Domain Predictor",
    tech: "TensorFlow // sentence-transformers // NLP",
    desc: "Research discovery platform with semantic paper recommendation and multi-label academic classification.",
    problem: "High manual overhead and friction in academic literature discovery and categorization.",
    constraints: "Requires highly accurate multi-label classification of overlapping scientific domains.",
    tradeoffs:
      "Used sentence-transformers (all-MiniLM-L6-v2) for embeddings to balance search speed and semantic accuracy.",
    architecture: "TensorFlow deep neural networks combined with cosine similarity search engines.",
    scale: "Processes high-dimensional paper embeddings for real-time semantic query matching.",
    impact: "Achieved 99.4% categorical classification accuracy and instant recommendation retrieval.",
    github: "https://github.com/33SN0W/nlp_project",
    deck: "https://raw.githubusercontent.com/33SN0W/nlp_project/main/Research%20Literature%20Recommendation%20System%20and%20Academic%20Domain%20Predictor.pdf",
  },
];

export type PosterKey =
  | "journey"
  | "resume"
  | "ferrari"
  | "ktm"
  | "senna"
  | "senna2"
  | "helmet"
  | "notebook"
  | "coffee";

export type PosterSection = { label: string; value: string };

export type PosterData = {
  title: string;
  subtitle: string;
  sections: PosterSection[];
};

export const POSTER_DATA: Record<PosterKey, PosterData> = {
  journey: {
    title: "SYSTEMS ENGINEERING PATHWAY // CAREER JOURNEY",
    subtitle: "Prateek // Systems Strategy & Data Ingestion",
    sections: [
      {
        label: "2021 — CS INCEPTION (IIIT GUWAHATI)",
        value:
          "B.Tech CSE entry. Developed core systems concepts: pointer manipulation, thread safety, process trees, and cache-aligned memory layouts in C++.",
      },
      {
        label: "2023 — SCALING PREDICTIONS (YOUTUBE AD RECOMMENDER)",
        value:
          "Engineered NLP text preprocessing and lemmatization pipelines. Built TF-IDF and SVM classifiers to achieve 98% accuracy on video recommendation.",
      },
      {
        label: "2024 — ARCHITECTURE & CORE OPTIMIZATION",
        value:
          "Designed hybrid memory-aware cache policies over LRU (ChampSim), improving LLC hit rates by 5%. Built academic research discovery engines using sentence-transformers.",
      },
      {
        label: "2025 - 2026 — CLOUD TELESCOPING & BIG DATA (MAQ SOFTWARE)",
        value:
          "Software Engineer 1. Built PySpark ingestion pipelines handling 200M+ rows/day. Reduced runtime execution from 12h to 3h. Certified DP-600 and DP-700.",
      },
      {
        label: "2026 - 2028 — STRATEGIC MANAGEMENT (IIM MUMBAI)",
        value:
          "MBA Core. Blending deep computational expertise with systems operations, supply chain strategy, and decision models.",
      },
    ],
  },
  resume: {
    title: "ENGINEERING SPEC SHEET // RESUME SUMMARY",
    subtitle: "Prateek // Software Engineer & Systems Strategist",
    sections: [
      {
        label: "PROPULSION SYSTEM (LANGUAGES & DATA)",
        value: "C++, C#, Java, Python, SQL, KQL, PySpark, Data Warehousing, ETL Pipelines.",
      },
      {
        label: "CHASSIS & INSTRUMENTATION (FULL STACK)",
        value: "Next.js, React, React Native, Node.js, Flask, TypeScript, HTML/CSS, .NET.",
      },
      {
        label: "AERODYNAMICS (CLOUD & DEVOPS)",
        value: "Microsoft Fabric, Azure Synapse, Azure Data Factory, ADLS, Azure DevOps, CI/CD, Docker.",
      },
      {
        label: "WORK EXPERIENCE",
        value:
          "Software Engineer 1 (Associate SE -> SE 1) @ MAQ Software (Jan 2025 - May 2026) // Noida, India",
      },
      {
        label: "EDUCATION & CERTIFICATION",
        value:
          "MBA Core @ IIM Mumbai (2026 - 2028) // B.Tech CSE @ IIIT Guwahati (2021 - 2025) // Certified DP-600 & DP-700",
      },
    ],
  },
  ferrari: {
    title: "TECHNICAL DIRECTIVE // SCUDERIA FERRARI SF-24",
    subtitle: "Dept. Motorsport // Maranello, Italy",
    sections: [
      {
        label: "POWER UNIT // 066/12 HYBRID",
        value:
          "90° 1.6L V6 Turbocharged Internal Combustion Engine + MGU-H (heat) + MGU-K (kinetic, recovering 120kW / 161HP). Total output ~1000 HP.",
      },
      {
        label: "CHASSIS & AERODYNAMICS",
        value:
          "Molded honeycomb carbon-fiber composite. Pull-rod front suspension, push-rod rear suspension. Advanced high-rake ground effect venturi tunnels.",
      },
      {
        label: "HYBRID CACHE POLICY ALIGNMENT",
        value:
          "Selected as the architectural blueprint for the Hybrid Memory-Aware Cache Policy. Translating complex power recovery parameters into high-efficiency memory access recency and eviction algorithms.",
      },
    ],
  },
  ktm: {
    title: "ENGINE BLOCK DETAIL // KTM RC16 MOTOGP V4",
    subtitle: "Mattighofen, Austria // Ready To Race",
    sections: [
      {
        label: "ENGINE CONFIGURATION // 75° V4",
        value:
          "1000cc liquid-cooled V4, pneumatic valves, DOHC, dry sump lubrication. Max engine speed: 18,500 RPM. Max output: 265+ HP.",
      },
      {
        label: "CHASSIS KINEMATICS",
        value:
          "Triangulated chromoly steel trellis frame. WP pressurized forks, aluminum swingarm. Kinematic link rear damper.",
      },
      {
        label: "ACADEMIC RECOMMENDATION ALIGNMENT",
        value:
          "Selected as the blueprint for the NLP Research Recommendation engine. High-speed, multi-dimensional semantic retrieval resembling the pneumatic control valves of a V4 power unit.",
      },
    ],
  },
  senna: {
    title: "HISTORICAL LEGACY // AYRTON SENNA DA SILVA",
    subtitle: "1960 - 1994 // Three-Times Formula 1 World Champion",
    sections: [
      {
        label: "CHAMPIONSHIP PERFORMANCE",
        value:
          "World Champion: 1988, 1990, 1991 (McLaren Honda). 41 GP wins, 65 pole positions, 80 podiums.",
      },
      {
        label: "MONACO GP SUPREMACY",
        value:
          "6 victories at the Monaco Grand Prix, including 5 consecutive wins between 1989-1993. The ultimate testament to precision driving.",
      },
      {
        label: "RACING DOCTRINE",
        value:
          "“If you no longer go for a gap that exists, you are no longer a racing driver.” Represents aggressive, relentless optimization and refusal to settle.",
      },
    ],
  },
  senna2: {
    title: "ACTIVE SUSPENSION DIAGRAM // AYRTON SENNA LOTUS 99T",
    subtitle: "Formula 1 Season 1987 // Team Lotus // Honda V6 Turbo",
    sections: [
      {
        label: "LOTUS ACTIVE SUSPENSION TECHNOLOGY",
        value:
          "The first successful computer-controlled active suspension. Utilized hydraulic actuators driven by a computer processing chassis acceleration and height telemetry at 200 Hz.",
      },
      {
        label: "1987 SEASON & STREET CIRCUIT PERFORMANCE",
        value:
          "Lotus 99T powered by the Honda RA167E V6 Twin-Turbo (~1000 HP). Senna secured victories at Monaco and Detroit, demonstrating superior mechanical grip on bumpy street tracks.",
      },
      {
        label: "YOUTUBE RECOMMENDER ALIGNMENT",
        value:
          "Selected as the blueprint for the YouTube Ad Recommender. Active optimization and NLP feature engineering to adapt to dynamic textual conditions under CPU latency bounds.",
      },
    ],
  },
  helmet: {
    title: "INSPIRATION SHIELD // SHOEI X-15",
    subtitle: "Driver Inspirations & Systems Safety Philosophy",
    sections: [
      {
        label: "LEGENDARY DRIVERS",
        value:
          "Ayrton Senna (absolute, uncompromising focus), Charles Leclerc (mechanical precision under bounds), Marc Marquez (defying physics thresholds).",
      },
      {
        label: "SYSTEM DESIGNERS",
        value:
          "Adrian Newey (converting fluid dynamics into absolute mechanical downforce). Compiling data architectures with identical aerodynamic elegance.",
      },
      {
        label: "CHASSIS COHESION",
        value:
          "Rigid composite outer structures protecting the inner processing core. Fallback failure limits and sandboxed container orchestration.",
      },
    ],
  },
  notebook: {
    title: "STRATEGIC DOCTRINE // SYSTEMS LOGBOOK",
    subtitle: "Prateek's Core Architectural Rules",
    sections: [
      {
        label: "RULE 01 // LEAVE NEGATIVE SPACE",
        value:
          "Do not over-engineer. Confidence is found in simplicity. Build light, readable, highly observable nodes. Complexity is technical debt.",
      },
      {
        label: "RULE 02 // OBSERVABILITY IS NOT AN ADD-ON",
        value:
          "Heartbeats, latency trackers, and data validation stages are built directly into initial design matrices, not as post-failure patches.",
      },
      {
        label: "RULE 03 // AUTOMATE COMPREHENSIVELY",
        value:
          "Every deployment cycle, ETL ingestion, and testing pass must compile automatically. Manual steps are single points of failure.",
      },
    ],
  },
  coffee: {
    title: "INGESTION RATIOS // CAFFEINE STATUS",
    subtitle: "Human-in-the-Loop Energy Analytics",
    sections: [
      {
        label: "CAPACITY // 85% FULL",
        value:
          "Double shot dark roast espresso. The physical fuel powering 2 AM cluster migrations, dependency resolutions, and canvas viewport builds.",
      },
      {
        label: "METRIC CONVERSIONS",
        value:
          "C8H10N4O2 (caffeine) binds directly to human adenosine receptors, suppressing latency indicators in the carbon processing core.",
      },
    ],
  },
};

export const BLUEPRINT_ARCHIVE: {
  key: PosterKey;
  title: string;
  code: string;
  desc: string;
}[] = [
  {
    key: "journey",
    title: "Career Journey",
    code: "BP-01 // JOURNEY",
    desc: "Academic and industry trajectory blueprint.",
  },
  {
    key: "resume",
    title: "Resume Summary",
    code: "BP-02 // RESUME",
    desc: "Core stack configuration and certifications checklist.",
  },
  {
    key: "ferrari",
    title: "Scuderia Ferrari SF-24",
    code: "PT-44 // SF24",
    desc: "Aero telemetry aligned with Hybrid Memory Cache project.",
  },
  {
    key: "ktm",
    title: "KTM RC16 MotoGP V4",
    code: "PT-33 // RC16",
    desc: "Engine specs aligned with Academic Domain Predictor.",
  },
  {
    key: "senna",
    title: "Ayrton Senna (Monaco)",
    code: "PT-08 // MONACO",
    desc: "Monaco GP historical telemetry and doctrine.",
  },
  {
    key: "senna2",
    title: "Ayrton Senna (Lotus 99T)",
    code: "PT-12 // LOTUS",
    desc: "Active suspension blueprint aligned with YouTube Recommender.",
  },
];

export const SKILLS_DATA = [
  {
    cat: "PROPULSION (Data & Systems)",
    items: [
      { name: "PySpark", color: "#ffd500" },
      { name: "Python", color: "#ffd500" },
      { name: "SQL", color: "#ffd500" },
      { name: "C++", color: "#41ff72" },
      { name: "KQL", color: "#41ff72" },
      { name: "Data Warehousing", color: "#41ff72" },
    ],
  },
  {
    cat: "CHASSIS (Full Stack & UX)",
    items: [
      { name: "Next.js", color: "#ffd500" },
      { name: "React", color: "#41ff72" },
      { name: "React Native", color: "#41ff72" },
      { name: "TypeScript", color: "#41ff72" },
      { name: "Flask", color: "#41ff72" },
      { name: "HTML/CSS", color: "#41ff72" },
      { name: ".NET", color: "#ffb36b" },
    ],
  },
  {
    cat: "AERODYNAMICS (Cloud Platforms)",
    items: [
      { name: "Microsoft Fabric", color: "#ffd500" },
      { name: "Azure Synapse", color: "#ffd500" },
      { name: "Azure DevOps", color: "#ffd500" },
      { name: "CI/CD", color: "#ffd500" },
      { name: "Azure Data Factory", color: "#41ff72" },
      { name: "ADLS", color: "#41ff72" },
    ],
  },
  {
    cat: "TELEMETRY (Developer Tools & Sim)",
    items: [
      { name: "Git / GitHub", color: "#41ff72" },
      { name: "Docker", color: "#41ff72" },
      { name: "Unity", color: "#ffb36b" },
      { name: "JIRA", color: "#ffb36b" },
      { name: "AntiGravity", color: "#ffb36b" },
    ],
  },
];

export const TIMELINE_DATA = [
  {
    station: "STATION 01",
    role: "MBA Candidate",
    location: "IIM MUMBAI /",
    date: "2026 - 2028",
    details:
      "Focusing on operations management, supply chain strategy, decision sciences, systems modeling, and strategic sourcing.",
  },
  {
    station: "STATION 02",
    role: "Software Engineer 1 (Associate SE -> SE 1)",
    location: "MAQ SOFTWARE // SYSTEMS & BIG DATA PLATFORMS",
    date: "JAN 2025 - MAY 2026",
    details:
      "Owned production data pipelines for Microsoft Azure Core Business Insights, processing 200M+ rows daily. Cut ETL runtimes from 12 hours to 3 hours (75% optimization). Modernized ingestion framework, replacing 300+ legacy pipelines.",
  },
  {
    station: "STATION 03",
    role: "CS Academic Core",
    location: "IIIT GUWAHATI // CORE SYSTEMS COMPUTATION",
    date: "2021 - 2025",
    details:
      "Rigorous academic focus in CSE. Designed hybrid cache eviction simulator architectures, developed deep learning multi-label literature classification models, and studied distributed systems.",
  },
];
