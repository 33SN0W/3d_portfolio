"use client";

import { useState, useEffect, useCallback } from "react";
import Scene from "@/components/canvas/Scene";
import Overlay from "@/components/ui/Overlay";
import Navigation from "@/components/ui/Navigation";
import SmoothScrollProvider from "@/providers/SmoothScroll";
import { PortfolioProvider, usePortfolio } from "@/providers/PortfolioProvider";
import { initScroll, SCROLL_PAGES } from "@/systems/scroll";
import { initAssetLoading, subscribeLoading } from "@/systems/loading";
import MobileLayout from "@/components/ui/MobileLayout";
import CursorTrail from "@/components/ui/CursorTrail";
import InteractionHints from "@/components/ui/InteractionHints";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function DesktopExperience({ showHints }: { showHints: boolean }) {
  const { isLaptopActive, setIsLaptopActive, playAudio } = usePortfolio();

  useEffect(() => {
    const handleFirstClick = () => {
      playAudio("hum");
      window.removeEventListener("click", handleFirstClick);
    };
    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, [playAudio]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLaptopActive) setIsLaptopActive(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLaptopActive, setIsLaptopActive]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLaptopActive) setIsLaptopActive(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLaptopActive, setIsLaptopActive]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <CursorTrail />
      <div
        className="scroll-container"
        style={{ height: `${SCROLL_PAGES * 100}vh` }}
        id="main-content"
      />
      <div className="canvas-layer">
        <Scene />
      </div>
      <Overlay />
      <Navigation />
      <InteractionHints visible={showHints} />
    </>
  );
}

function StartLightsLoader({
  onComplete,
  assetsReady,
}: {
  onComplete: () => void;
  assetsReady: boolean;
}) {
  const [lightsCount, setLightsCount] = useState(0);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [sequenceDone, setSequenceDone] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      const id = setTimeout(() => setSequenceDone(true), 0);
      return () => clearTimeout(id);
    }

    const intervals = [0, 1, 2, 3, 4].map((i) =>
      setTimeout(() => setLightsCount(i + 1), (i + 1) * 350)
    );

    const outTimer = setTimeout(() => {
      setIsLightsOut(true);
      setSequenceDone(true);
    }, 2200);

    return () => {
      intervals.forEach(clearTimeout);
      clearTimeout(outTimer);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (sequenceDone && assetsReady) {
      const id = setTimeout(() => setFadeOut(true), 0);
      const timer = setTimeout(onComplete, reducedMotion ? 0 : 500);
      return () => {
        clearTimeout(id);
        clearTimeout(timer);
      };
    }
  }, [sequenceDone, assetsReady, onComplete, reducedMotion]);

  if (reducedMotion && sequenceDone && assetsReady) return null;

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
        transition: reducedMotion ? "none" : "opacity 0.5s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {!reducedMotion && (
        <div
          style={{
            display: "flex",
            gap: "16px",
            padding: "16px 24px",
            background: "#111",
            borderRadius: "4px",
            border: "1px solid #222",
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => {
            const isOn = !isLightsOut && lightsCount > i;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: isOn ? "#ff0000" : "#222",
                    boxShadow: isOn ? "0 0 15px #ff0000" : "none",
                  }}
                />
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: isOn ? "#ff0000" : "#222",
                    boxShadow: isOn ? "0 0 15px #ff0000" : "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      <div
        style={{
          color: "#707070",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {isLightsOut || reducedMotion
          ? assetsReady
            ? "LIGHTS OUT // AWAY WE GO"
            : "COMPILING TELEMETRY // LOADING ASSETS"
          : "WARMING UP ENGINE"}
      </div>
    </div>
  );
}

function ResponsiveShell({ showHints }: { showHints: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return <MobileLayout />;
  return <DesktopExperience showHints={showHints} />;
}

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assetsReady, setAssetsReady] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    setShowHints(true);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    initAssetLoading();
    const cleanupScroll = initScroll();
    const cleanupLoading = subscribeLoading((_progress, isComplete) => {
      setAssetsReady(isComplete);
    });
    const fallback = setTimeout(() => setAssetsReady(true), 5000);
    return () => {
      clearTimeout(id);
      cleanupScroll();
      cleanupLoading();
      clearTimeout(fallback);
    };
  }, []);

  if (!mounted) {
    return <div style={{ position: "fixed", inset: 0, background: "#050505" }} />;
  }

  return (
    <SmoothScrollProvider>
      <PortfolioProvider>
        {isLoading && (
          <StartLightsLoader onComplete={handleLoadComplete} assetsReady={assetsReady} />
        )}
        <ResponsiveShell showHints={showHints && !isLoading} />
      </PortfolioProvider>
    </SmoothScrollProvider>
  );
}
