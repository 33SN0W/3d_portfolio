/**
 * Scroll System — Maps window scroll to normalized progress
 *
 * The invisible driver of the entire experience.
 * Scroll position → 0..1 progress → camera position + content reveals.
 */

// Reactive scroll state — components read this every frame
let _progress = 0;
let _section = 0;
const _listeners: Set<() => void> = new Set();

// Section boundaries (normalized 0–1)
export const SECTIONS = {
  PADDOCK:      { start: 0.00, end: 0.15, index: 0, label: "Paddock" },
  GARAGE:       { start: 0.15, end: 0.35, index: 1, label: "Garage" },
  RACE_HISTORY: { start: 0.35, end: 0.55, index: 2, label: "Race History" },
  TROPHY_WALL:  { start: 0.55, end: 0.75, index: 3, label: "Trophy Wall" },
  PIT_WALL:     { start: 0.75, end: 1.00, index: 4, label: "Pit Wall Radio" },
} as const;

export type SectionKey = keyof typeof SECTIONS;

const SECTION_LIST = Object.values(SECTIONS);

/** How many viewports of scroll height to create */
export const SCROLL_PAGES = 9;

/** Get current scroll progress (0–1) */
export function getProgress(): number {
  return _progress;
}

/** Get current section index (0–4) */
export function getSection(): number {
  return _section;
}

/** Compute which section index a progress value falls into */
function computeSection(progress: number): number {
  for (let i = SECTION_LIST.length - 1; i >= 0; i--) {
    if (progress >= SECTION_LIST[i].start) return i;
  }
  return 0;
}

/** 
 * Get local progress within a section (0–1).
 * Useful for animating content within a single section.
 */
export function getSectionProgress(sectionKey: SectionKey): number {
  const section = SECTIONS[sectionKey];
  const range = section.end - section.start;
  return Math.max(0, Math.min(1, (_progress - section.start) / range));
}

/** Subscribe to progress changes */
export function subscribe(fn: () => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/** Initialize scroll tracking on the window */
export function initScroll(): () => void {
  const update = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) {
      _progress = 0;
      _section = 0;
      return;
    }
    _progress = Math.max(0, Math.min(1, window.scrollY / scrollHeight));
    _section = computeSection(_progress);
    _listeners.forEach((fn) => fn());
  };

  window.addEventListener("scroll", update, { passive: true });
  update(); // Initial read

  return () => {
    window.removeEventListener("scroll", update);
  };
}

/** Scroll to a specific section */
export function scrollToSection(sectionKey: SectionKey): void {
  const section = SECTIONS[sectionKey];
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const targetY = section.start * scrollHeight;
  window.scrollTo({ top: targetY, behavior: "smooth" });
}
