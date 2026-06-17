"use client";

import { useEffect, useRef } from "react";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { LIVERIES } from "@/config/colors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Point {
  x: number;
  y: number;
  age: number;
}

// Utility to convert hex color to rgba with dynamic transparency
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { livery } = usePortfolio();
  const reducedMotion = useReducedMotion();

  const activeTheme = LIVERIES[livery] || LIVERIES.ducati;

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Add a point on mouse move
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      const maxAge = 10; // Tighter, shorter length of the trail in frames

      // Filter out old points and update ages
      pointsRef.current = points
        .map((p) => ({ ...p, age: p.age + 1 }))
        .filter((p) => p.age < maxAge);

      const activePoints = pointsRef.current;

      if (activePoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(activePoints[0].x, activePoints[0].y);

        // Draw smooth Bezier curve through coordinates
        for (let i = 1; i < activePoints.length - 1; i++) {
          const xc = (activePoints[i].x + activePoints[i + 1].x) / 2;
          const yc = (activePoints[i].y + activePoints[i + 1].y) / 2;
          ctx.quadraticCurveTo(activePoints[i].x, activePoints[i].y, xc, yc);
        }

        ctx.strokeStyle = activeTheme.color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        // Add high-tech sharp glow
        ctx.shadowColor = activeTheme.color;
        ctx.shadowBlur = 8;

        ctx.stroke();

        // Draw fine tapering lines for extra mechanical feel
        ctx.shadowBlur = 0; // disable shadow for clean sharp details
        for (let i = 1; i < activePoints.length; i++) {
          const ratio = i / activePoints.length;
          const alpha = ratio * 0.4;
          const size = ratio * 2;
          
          ctx.beginPath();
          ctx.arc(activePoints[i].x, activePoints[i].y, size, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(activeTheme.color, alpha);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [activeTheme, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999999,
        background: "transparent",
      }}
    />
  );
}
