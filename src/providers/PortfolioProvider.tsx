"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSection, subscribe } from "@/systems/scroll";
import { LIVERIES, LiveryType } from "@/config/colors";

interface PortfolioContextProps {
  activeSection: number;
  isLaptopActive: boolean;
  setIsLaptopActive: (val: boolean) => void;
  activeProjectIndex: number;
  setActiveProjectIndex: (index: number) => void;
  focusedPoster: string | null;
  setFocusedPoster: (val: string | null) => void;
  livery: LiveryType;
  setLivery: (val: LiveryType) => void;
  activeBikePart: 'frame' | 'engine' | 'suspension' | 'rear_section' | 'electrical' | null;
  setActiveBikePart: (part: 'frame' | 'engine' | 'suspension' | 'rear_section' | 'electrical' | null) => void;
  playAudio: (type: 'chirp' | 'static' | 'sweep' | 'hum') => void;
}

export const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

let audioCtx: AudioContext | null = null;
let humOsc: OscillatorNode | null = null;
let humGain: GainNode | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playProceduralAudio(type: 'chirp' | 'static' | 'sweep' | 'hum') {
  if (typeof window === "undefined") return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (type === 'hum') {
      if (humOsc) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      gain.gain.setValueAtTime(0.005, ctx.currentTime); // low hum
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      humOsc = osc;
      humGain = gain;
    } else if (type === 'chirp') {
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
    } else if (type === 'static') {
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === 'sweep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    }
  } catch (err) {
    console.warn("Audio Context error:", err);
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState(0);
  const [isLaptopActive, setIsLaptopActive] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [focusedPoster, setFocusedPoster] = useState<string | null>(null);
  const [livery, setLivery] = useState<LiveryType>("ferrari");
  const [activeBikePart, setActiveBikePart] = useState<'frame' | 'engine' | 'suspension' | 'rear_section' | 'electrical' | null>(null);

  const playAudio = (type: 'chirp' | 'static' | 'sweep' | 'hum') => {
    playProceduralAudio(type);
  };

  // Dynamically map CSS color variables to the HTML root node on livery updates
  useEffect(() => {
    const theme = LIVERIES[livery];
    if (theme) {
      document.documentElement.style.setProperty("--orange", theme.color);
      document.documentElement.style.setProperty("--orange-glow", theme.glow);
    }
  }, [livery]);

  // Sync scroll section changes and trigger telemetry sweeps
  useEffect(() => {
    const handleScrollUpdate = () => {
      const nextSec = getSection();
      setActiveSection((prev) => {
        if (prev !== nextSec) {
          playProceduralAudio('sweep');
        }
        return nextSec;
      });
    };
    handleScrollUpdate();
    return subscribe(handleScrollUpdate);
  }, []);

  // Exit poster focus on scrolling or clicking elsewhere
  useEffect(() => {
    const handleScroll = () => {
      if (focusedPoster) setFocusedPoster(null);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [focusedPoster]);

  return (
    <PortfolioContext.Provider
      value={{
        activeSection,
        isLaptopActive,
        setIsLaptopActive,
        activeProjectIndex,
        setActiveProjectIndex,
        focusedPoster,
        setFocusedPoster,
        livery,
        setLivery,
        activeBikePart,
        setActiveBikePart,
        playAudio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}

