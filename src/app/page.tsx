"use client";

/**
 * Page — The entry point
 *
 * Layers:
 * 1. Scroll container (invisible, creates scroll height)
 * 2. R3F Canvas (fixed, z-0, responds to scroll)
 * 3. HTML Overlay (fixed, z-10, typography appears/disappears)
 * 4. Navigation (fixed, z-20, dot indicator)
 */

import { useState, useEffect } from "react";
import Scene from "@/components/canvas/Scene";
import Overlay from "@/components/ui/Overlay";
import Navigation from "@/components/ui/Navigation";
import SmoothScrollProvider from "@/providers/SmoothScroll";
import { PortfolioProvider, usePortfolio } from "@/providers/PortfolioProvider";
import { initScroll, SCROLL_PAGES } from "@/systems/scroll";
import MobileLayout from "@/components/ui/MobileLayout";
import CursorTrail from "@/components/ui/CursorTrail";

function HomeContent() {
  const { isLaptopActive, setIsLaptopActive, playAudio } = usePortfolio();
  const [isMobile, setIsMobile] = useState(false);

  // Initialize garage hum on first click
  useEffect(() => {
    const handleFirstClick = () => {
      playAudio('hum');
      window.removeEventListener("click", handleFirstClick);
    };
    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, [playAudio]);

  // Responsive checker
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Escape key exits laptop zoom mode
  useEffect(() => {
    if (isMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLaptopActive) {
        setIsLaptopActive(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLaptopActive, setIsLaptopActive, isMobile]);

  // Scrolling exits laptop zoom mode
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      if (isLaptopActive) {
        setIsLaptopActive(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLaptopActive, setIsLaptopActive, isMobile]);

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <>
      <CursorTrail />
      {/* Invisible scroll container — its height drives the experience */}
      <div
        className="scroll-container"
        style={{ height: `${SCROLL_PAGES * 100}vh` }}
      />

      {/* 3D Canvas — fixed behind everything */}
      <div className="canvas-layer">
        <Scene />
      </div>

      {/* Typography overlay — fixed on top of canvas */}
      <Overlay />

      {/* Navigation dots — fixed on the right edge */}
      <Navigation />
    </>
  );
}

function StartLightsLoader({ onComplete }: { onComplete: () => void }) {
  const [lightsCount, setLightsCount] = useState(0);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 5 lights turn on one by one every 350ms
    const intervals = [0, 1, 2, 3, 4].map((i) => {
      return setTimeout(() => {
        setLightsCount(i + 1);
      }, (i + 1) * 350);
    });

    // All lights turn off together at 2100ms
    const outTimer = setTimeout(() => {
      setIsLightsOut(true);
      setFadeOut(true);
      // Let fadeout animation finish (500ms) then complete loading
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2200);

    return () => {
      intervals.forEach(clearTimeout);
      clearTimeout(outTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#050505",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        transition: "opacity 0.5s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: "none"
      }}
    >
      {/* Light Gantry Rack */}
      <div style={{ display: "flex", gap: "16px", padding: "16px 24px", background: "#111", borderRadius: "4px", border: "1px solid #222" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const isOn = !isLightsOut && lightsCount > i;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
              {/* Individual light housing */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: isOn ? "#ff0000" : "#222",
                  boxShadow: isOn ? "0 0 15px #ff0000" : "none",
                  transition: "background 0.1s ease"
                }}
              />
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: isOn ? "#ff0000" : "#222",
                  boxShadow: isOn ? "0 0 15px #ff0000" : "none",
                  transition: "background 0.1s ease"
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ color: "#707070", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {isLightsOut ? "LIGHTS OUT // AWAY WE GO" : "WARMING UP ENGINE"}
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const cleanup = initScroll();
    return cleanup;
  }, []);

  if (!mounted) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#050505" }} />
    );
  }

  return (
    <SmoothScrollProvider>
      <PortfolioProvider>
        {isLoading && <StartLightsLoader onComplete={() => setIsLoading(false)} />}
        <HomeContent />
      </PortfolioProvider>
    </SmoothScrollProvider>
  );
}