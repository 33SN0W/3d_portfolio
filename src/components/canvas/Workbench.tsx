"use client";

/**
 * Workbench — The workspace of Prateek
 *
 * Implements the Workbench section from the SCENE_GRAPH.md:
 * - Workbench (Notebook, Coffee Mug, Gloves, Pencil)
 * - Laptop (MAQ, Azure, Fabric, Power BI)
 * - Blueprint Wall (Journey, Resume)
 *
 * Placed at z = -0.7m behind the Hero Sculpture, under the warm task lamp.
 * Built using materials from the PBR library to ensure physical accuracy.
 */

import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html, Text } from "@react-three/drei";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { LIVERIES, LiveryType } from "@/config/colors";
import {
  createConcrete,
  createBrushedAluminum,
  createMachinedAluminum,
  createAnodizedOrange,
  createSteel,
  createWornLeather,
  createSmokedGlass,
} from "@/materials";

function useWalnutTexture(mounted: boolean) {
  return useMemo(() => {
    if (!mounted || typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Base walnut warm brown
    ctx.fillStyle = "#3e2817";
    ctx.fillRect(0, 0, 512, 512);

    // Warm organic grain lines
    ctx.strokeStyle = "#27190e";
    ctx.lineWidth = 1.5;
    for (let y = -20; y < 530; y += 8) {
      ctx.beginPath();
      ctx.moveTo(-10, y);
      for (let x = 0; x <= 530; x += 15) {
        // Organic sine/cosine noise offsets for wood grain rings
        const dy = Math.sin(x * 0.015) * 8 + Math.cos(x * 0.04) * 3;
        ctx.lineTo(x, y + dy);
      }
      ctx.stroke();
    }

    // Add fine parallel surface scratches/pores
    ctx.strokeStyle = "rgba(43, 27, 13, 0.25)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 60; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rw = 20 + Math.random() * 80;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + rw, ry + (Math.random() * 2 - 1));
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.5);
    return texture;
  }, [mounted]);
}

// ─── NOTEBOOK TEXTURE ────────────────────────────────────
function useNotebookTexture(mounted: boolean) {
  return useMemo(() => {
    if (!mounted || typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Warm white pages
    ctx.fillStyle = "#f2e8df"; // Aged warm paper
    ctx.fillRect(0, 0, 512, 512);

    // Book center line / crease shadow
    const gradient = ctx.createLinearGradient(236, 0, 276, 0);
    gradient.addColorStop(0, "rgba(242, 232, 223, 1)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.15)");
    gradient.addColorStop(1, "rgba(242, 232, 223, 1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(236, 0, 40, 512);

    // Page margin lines
    ctx.strokeStyle = "rgba(255, 105, 0, 0.15)"; // Soft red/orange margin line
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, 512);
    ctx.moveTo(472, 0);
    ctx.lineTo(472, 512);
    ctx.stroke();

    // Sketching lines representing schematics (Left page)
    ctx.strokeStyle = "rgba(26, 20, 16, 0.35)"; // Pencil graphite color
    ctx.lineWidth = 1.5;
    
    // Draw some geometric diagrams on left page
    ctx.beginPath();
    ctx.arc(120, 150, 45, 0, Math.PI * 2);
    ctx.moveTo(75, 150);
    ctx.lineTo(165, 150);
    ctx.moveTo(120, 105);
    ctx.lineTo(120, 195);
    // Triangle
    ctx.moveTo(70, 320);
    ctx.lineTo(170, 320);
    ctx.lineTo(120, 240);
    ctx.closePath();
    ctx.stroke();

    // Scribbled text lines on right page
    ctx.font = "italic 16px cursive, sans-serif";
    ctx.fillStyle = "rgba(26, 20, 16, 0.6)";
    const lines = [
      "trellis stress loads",
      "nodes = 6061 aluminum",
      "spring tension: 85N/mm",
      "PBR material index:",
      " concrete roughness = 0.82",
      " anodized = 1.0 metalness",
      "11:47 PM - block 6 is ready",
    ];
    lines.forEach((line, index) => {
      ctx.fillText(line, 290, 80 + index * 30);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [mounted]);
}

// ─── BLUEPRINT TEXTURES ──────────────────────────────────
function useBlueprintTexture(isResume: boolean, mounted: boolean) {
  return useMemo(() => {
    if (!mounted || typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1448; // A4 aspect ratio
    const ctx = canvas.getContext("2d")!;

    // Unified dark slate blueprint background
    ctx.fillStyle = "#0a0e14";
    ctx.fillRect(0, 0, 1024, 1448);

    // Fine grid
    ctx.strokeStyle = "rgba(242, 242, 242, 0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 20; i < 1024; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1448);
      ctx.stroke();
    }
    for (let j = 20; j < 1448; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(1024, j);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = "rgba(242, 242, 242, 0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 964, 1388);

    // Title Block (bottom-right)
    ctx.strokeRect(600, 1250, 364, 140);
    ctx.fillStyle = "rgba(242, 242, 242, 0.8)";
    ctx.font = "bold 16px monospace";
    ctx.fillText("TITLE: " + (isResume ? "RESUME / PRATEEK" : "JOURNEY PATHWAY"), 620, 1280);
    ctx.fillText("SCALE: 1:1", 620, 1310);
    ctx.fillText("DATE: 2026.06.14 // 11:47 PM", 620, 1340);

    if (isResume) {
      // Resume Content
      ctx.fillStyle = "#f2f2f2";
      ctx.font = "bold 42px monospace";
      ctx.fillText("PRATEEK", 80, 120);

      ctx.fillStyle = "#ff6900";
      ctx.font = "bold 20px monospace";
      ctx.fillText("SOFTWARE ENGINEER // DATA ARCHITECT", 80, 160);

      // Section: Experience
      ctx.fillStyle = "rgba(242, 242, 242, 0.9)";
      ctx.font = "bold 26px monospace";
      ctx.fillText("EXPERIENCE", 80, 240);
      ctx.strokeStyle = "rgba(242, 242, 242, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 255);
      ctx.lineTo(500, 255);
      ctx.stroke();

      const exp = [
        { title: "Software Engineer 1", company: "MAQ Software", period: "2025 - Present", desc: "" },
        { title: "Associate Software Engineer", company: "MAQ Software", period: "Jan - Jul 2025", desc: "" },
        { title: "", company: "", period: "", desc: "- Developed ETL workflows using PySpark, SQL, and KQL." },
        { title: "", company: "", period: "", desc: "- Automated CI/CD pipelines for Synapse Fabric notebooks." },
        { title: "", company: "", period: "", desc: "- Managed and analyzed Microsoft Virtual Machine data." },
      ];
      exp.forEach((line, idx) => {
        ctx.fillStyle = line.title ? "#f2f2f2" : "#a4a4a4";
        ctx.font = line.title ? "bold 18px monospace" : "16px monospace";
        ctx.fillText(line.title ? `${line.title} @ ${line.company} (${line.period})` : line.desc, 80, 290 + idx * 30);
      });

      // Section: Projects
      ctx.fillStyle = "rgba(242, 242, 242, 0.9)";
      ctx.font = "bold 26px monospace";
      ctx.fillText("ENGINEERING PROJECTS", 80, 480);
      ctx.beginPath();
      ctx.moveTo(80, 495);
      ctx.lineTo(500, 495);
      ctx.stroke();

      const projs = [
        { name: "YouTube Ad Recommender", tech: "Python / NLTK / Scikit-Learn" },
        { name: "Health App (Disease Prediction)", tech: "React Native / Flask / ML" },
        { name: "Microsoft Fabric DP-600 certified", tech: "Synapse Analytics Engineer" },
      ];
      projs.forEach((p, idx) => {
        ctx.fillStyle = "#f2f2f2";
        ctx.font = "bold 18px monospace";
        ctx.fillText(p.name, 80, 530 + idx * 60);
        ctx.fillStyle = "#ff6900";
        ctx.font = "14px monospace";
        ctx.fillText(p.tech, 80, 555 + idx * 60);
      });

      // Section: Education
      ctx.fillStyle = "rgba(242, 242, 242, 0.9)";
      ctx.font = "bold 26px monospace";
      ctx.fillText("TECHNICAL EDUCATION", 80, 750);
      ctx.beginPath();
      ctx.moveTo(80, 765);
      ctx.lineTo(500, 765);
      ctx.stroke();

      ctx.fillStyle = "#f2f2f2";
      ctx.font = "18px monospace";
      ctx.fillText("IIIT Guwahati — Bachelor of Technology in CS", 80, 800);
      ctx.fillStyle = "#a4a4a4";
      ctx.fillText("Graduated: June 2025 // Kullu Science School (2021)", 80, 825);
    } else {
      // Journey Content
      ctx.fillStyle = "#f2f2f2";
      ctx.font = "bold 42px monospace";
      ctx.fillText("JOURNEY GRAPH", 80, 120);

      ctx.fillStyle = "#ff6900";
      ctx.font = "bold 20px monospace";
      ctx.fillText("PATHWAY ARCHITECTURE", 80, 160);

      // Draw a timeline graph representing the journey
      ctx.strokeStyle = "rgba(242, 242, 242, 0.3)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(150, 300);
      ctx.lineTo(150, 1000);
      ctx.stroke();

      const milestones = [
        { year: "2021", title: "Computer Science Inception", desc: "Entered IIIT Guwahati. First C programs and core system algorithms." },
        { year: "2023", title: "NLP & Machine Learning", desc: "Built YouTube Ad Recommender. Classification model accuracy study." },
        { year: "2024", title: "Full-Stack Diagnostics", desc: "Developed Health App. Integrated symptom inference engine and chat." },
        { year: "2025", title: "Enterprise Systems", desc: "Joined MAQ Software. Software Engineer 1. Microsoft Fabric certified." },
      ];

      milestones.forEach((m, idx) => {
        const y = 320 + idx * 200;

        // Draw node circle
        ctx.fillStyle = "#ff6900";
        ctx.beginPath();
        ctx.arc(150, y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#f2f2f2";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(150, y, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Details
        ctx.fillStyle = "#ff6900";
        ctx.font = "bold 24px monospace";
        ctx.fillText(m.year, 200, y - 10);

        ctx.fillStyle = "#f2f2f2";
        ctx.font = "bold 20px monospace";
        ctx.fillText(m.title, 200, y + 20);

        ctx.fillStyle = "#a4a4a4";
        ctx.font = "16px monospace";
        ctx.fillText(m.desc, 200, y + 45);
      });
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [isResume, mounted]);
}



// ─── GLOWING BRAKE ROTOR LAMP (Desk item) ────────────────
function BrakeRotorLamp({ position, rotation, steelMat, aluminumMat }: { position: [number, number, number]; rotation: [number, number, number]; steelMat: THREE.Material; aluminumMat: THREE.Material }) {
  const rotorGeo = useMemo(() => {
    const outerR = 0.08;
    const innerR = 0.035;
    const thickness = 0.005;
    const segments = 32;

    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    const holeCount = 8;
    const holeR = (outerR + innerR) / 2;
    const drillR = 0.004;
    for (let i = 0; i < holeCount; i++) {
      const angle = (i / holeCount) * Math.PI * 2;
      const cx = Math.cos(angle) * holeR;
      const cy = Math.sin(angle) * holeR;
      const drillPath = new THREE.Path();
      drillPath.absarc(cx, cy, drillR, 0, Math.PI * 2, true);
      shape.holes.push(drillPath);
    }

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.001,
      bevelSize: 0.001,
      bevelSegments: 2,
      curveSegments: segments,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const baseStandMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#111112"),
      roughness: 0.7,
      metalness: 0.2,
    });
  }, []);

  const orangeEmissiveMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ff3000"),
      emissive: new THREE.Color("#ff4000"),
      emissiveIntensity: 6.0,
      roughness: 0.1,
    });
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* 2 black support stand feet */}
      <mesh position={[-0.045, -0.09, 0]} material={baseStandMat}>
        <boxGeometry args={[0.015, 0.02, 0.06]} />
      </mesh>
      <mesh position={[0.045, -0.09, 0]} material={baseStandMat}>
        <boxGeometry args={[0.015, 0.02, 0.06]} />
      </mesh>
      {/* Curved stand upright connecting bracket */}
      <mesh position={[0, -0.06, -0.01]} material={baseStandMat}>
        <boxGeometry args={[0.1, 0.05, 0.02]} />
      </mesh>

      {/* Main Rotor Disc */}
      <mesh geometry={rotorGeo} position={[0, 0, 0]} castShadow receiveShadow material={steelMat} />

      {/* Brake Caliper (silver/grey) mounted on right-front */}
      <group position={[0.076, 0.012, 0.002]} rotation={[0, 0, -Math.PI / 12]}>
        <mesh castShadow material={aluminumMat}>
          <boxGeometry args={[0.024, 0.062, 0.036]} />
        </mesh>
        {/* Caliper center cutout */}
        <mesh position={[0, 0, 0]} material={baseStandMat}>
          <boxGeometry args={[0.025, 0.03, 0.015]} />
        </mesh>
      </group>

      {/* Glowing center hub ring */}
      <mesh position={[0, 0, -0.015]} material={orangeEmissiveMat}>
        <torusGeometry args={[0.038, 0.008, 8, 24]} />
      </mesh>

      {/* Backplate light mask (glow washes out from slots) */}
      <mesh position={[0, 0, -0.008]} rotation={[Math.PI / 2, 0, 0]} material={baseStandMat}>
        <cylinderGeometry args={[0.08, 0.08, 0.004, 24]} />
      </mesh>

      {/* Active PointLight source casting light onto the desk surface */}
      <pointLight color="#ff4000" intensity={2.5} distance={1.2} decay={2.0} position={[0, 0, 0.04]} />
    </group>
  );
}

// ─── SHOEI HELMET (Desk item) ───────────────────────────
function ShoeiHelmet({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const shellMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#eceff1"), // Glossy white paint
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
  }, []);

  const visorMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0c0c0e"), // Smoked dark visor
      transmission: 0.6,
      opacity: 0.9,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });
  }, []);

  const blackTrimMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0f0f10"),
      roughness: 0.6,
      metalness: 0.1,
    });
  }, []);

  const orangeDecalMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ff5000"),
      roughness: 0.2,
      metalness: 0.8,
    });
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stretched aerodynamic inner group */}
      <group scale={[0.96, 1.0, 1.08]}>
        {/* Main outer shell structure */}
        <mesh castShadow>
          <sphereGeometry args={[0.065, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
          <primitive object={shellMat} attach="material" />
        </mesh>
        
        {/* Sleek cohesive chin bar - cylinder segment following sphere curvature */}
        <mesh castShadow position={[0, -0.026, 0.018]} rotation={[0.16, 0, 0]} material={shellMat}>
          <cylinderGeometry args={[0.064, 0.062, 0.038, 24, 1, true, -Math.PI / 2.3, Math.PI / 1.15]} />
        </mesh>
        
        {/* Base rubber neck trim roll */}
        <mesh position={[0, -0.048, -0.01]} rotation={[0.08, 0, 0]} material={blackTrimMat}>
          <torusGeometry args={[0.058, 0.006, 8, 24]} />
        </mesh>
        
        {/* Chin splitter aerodynamic winglet */}
        <mesh position={[0, -0.045, 0.04]} rotation={[0.1, 0, 0]} material={blackTrimMat}>
          <cylinderGeometry args={[0.063, 0.063, 0.006, 16, 1, true, -Math.PI / 3, Math.PI / 1.5]} />
        </mesh>
        
        {/* Black chin vent intake */}
        <mesh position={[0, -0.024, 0.075]} material={blackTrimMat}>
          <boxGeometry args={[0.016, 0.014, 0.005]} />
        </mesh>

        {/* Visor seal / eyeport black rubber gasket */}
        <mesh position={[0, 0.008, 0.035]} rotation={[0.2, 0, 0]} material={blackTrimMat}>
          <cylinderGeometry args={[0.063, 0.063, 0.034, 24, 1, true, -Math.PI / 2.7, Math.PI / 1.35]} />
        </mesh>

        {/* Visor lens */}
        <mesh position={[0, 0.008, 0.038]} rotation={[0.2, 0, 0]} material={visorMat}>
          <cylinderGeometry args={[0.061, 0.061, 0.032, 24, 1, true, -Math.PI / 2.8, Math.PI / 1.4]} />
        </mesh>
        
        {/* Visor lift tab (bottom-left) */}
        <mesh position={[0.035, -0.01, 0.052]} rotation={[0.2, 0.4, 0.1]} material={blackTrimMat}>
          <boxGeometry args={[0.008, 0.004, 0.004]} />
        </mesh>

        {/* Visor mounting gear pivot plates */}
        <mesh position={[0.061, 0.008, 0]} rotation={[0, Math.PI / 2, 0]} material={blackTrimMat}>
          <cylinderGeometry args={[0.008, 0.008, 0.005, 12]} />
        </mesh>
        <mesh position={[-0.061, 0.008, 0]} rotation={[0, Math.PI / 2, 0]} material={blackTrimMat}>
          <cylinderGeometry args={[0.008, 0.008, 0.005, 12]} />
        </mesh>
        
        {/* Pivot plates metallic details */}
        <mesh position={[0.063, 0.008, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.003, 12]} />
          <meshStandardMaterial color="#888" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[-0.063, 0.008, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.003, 12]} />
          <meshStandardMaterial color="#888" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Ventilation slots on top of helmet */}
        <mesh position={[0.02, 0.05, 0.02]} rotation={[0.4, 0.2, 0]} material={blackTrimMat}>
          <boxGeometry args={[0.012, 0.005, 0.024]} />
        </mesh>
        <mesh position={[-0.02, 0.05, 0.02]} rotation={[0.4, -0.2, 0]} material={blackTrimMat}>
          <boxGeometry args={[0.012, 0.005, 0.024]} />
        </mesh>

        {/* Sleek rear spoiler stabilizer winglet */}
        <mesh position={[0, 0.016, -0.052]} rotation={[-0.25, 0, 0]} material={shellMat}>
          <boxGeometry args={[0.054, 0.012, 0.03]} />
        </mesh>
        <mesh position={[0, 0.022, -0.06]} rotation={[-0.3, 0, 0]} material={orangeDecalMat}>
          <boxGeometry args={[0.048, 0.008, 0.02]} />
        </mesh>
        
        {/* Decals: High speed side livery lines */}
        <mesh position={[0.032, 0.022, 0.022]} rotation={[0.2, 0.4, 0.3]} material={orangeDecalMat}>
          <boxGeometry args={[0.008, 0.0015, 0.07]} />
        </mesh>
        <mesh position={[-0.032, 0.022, 0.022]} rotation={[0.2, -0.4, -0.3]} material={orangeDecalMat}>
          <boxGeometry args={[0.008, 0.0015, 0.07]} />
        </mesh>

        {/* Forehead Logo decal block */}
        <mesh position={[0, 0.044, 0.046]} rotation={[0.32, 0, 0]} material={blackTrimMat}>
          <boxGeometry args={[0.018, 0.008, 0.002]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── FRAMED GALLERY POSTER ──────────────────────────────
function FramedPoster({ 
  position, 
  rotation, 
  args, 
  material, 
  onClick, 
  onPointerOver, 
  onPointerOut,
  steelMat,
  frameMat,
  paperColor = "#f4f0ea"
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  args: [number, number]; 
  material: THREE.Material; 
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
  steelMat: THREE.Material;
  frameMat: THREE.Material;
  paperColor?: string;
}) {
  const [w, h] = args;
  const border = 0.02; // 2cm frame border thickness
  const glassMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.18,
    });
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Black Frame Backing */}
      <mesh castShadow receiveShadow material={frameMat}>
        <boxGeometry args={[w + border * 2, h + border * 2, 0.014]} />
      </mesh>

      {/* Solid Backing Paper Sheet */}
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color={paperColor} />
      </mesh>
      
      {/* Poster Page print */}
      <mesh position={[0, 0, 0.008]} material={material} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <planeGeometry args={[w, h]} />
      </mesh>

      {/* Reflective Glass overlay */}
      <mesh position={[0, 0, 0.009]} material={glassMat}>
        <planeGeometry args={[w, h]} />
      </mesh>

      {/* Corner mounting metal studs */}
      {[-w/2 - border/2, w/2 + border/2].map((x, xi) => 
        [-h/2 - border/2, h/2 + border/2].map((y, yi) => (
          <mesh key={`${xi}-${yi}`} position={[x, y, 0.008]} rotation={[Math.PI / 2, 0, 0]} material={steelMat}>
            <cylinderGeometry args={[0.004, 0.004, 0.016, 8]} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ─── PROJECTS DATA ───────────────────────────────────────
const PROJECTS = [
  {
    name: "YouTube Ad Recommender",
    tech: "Python // NLTK // Scikit-Learn",
    desc: "SVM video category classifier trained on 3,000+ ads to optimize target recommendations.",
    overview: "A highly parallelized text classification system designed to scrape, clean, and categorize YouTube advertisements to maximize click-through optimization.",
    constraints: "High sparsity in meta text labels, strictly low-latency inference limits for real-time recommendation engines.",
    solution: "Engineered robust TF-IDF feature pipelines and utilized localized Support Vector Machines, yielding 87% accuracy with sub-10ms latency.",
    decisions: "Chose SVM over transformer models to minimize computational cost on standard CPU nodes, maximizing operational yield.",
    impact: "Boosted recommendation precision metrics by 14% and cut cold-start classification latency by 35%.",
    details: [
      "Built custom scraping pipelines for YouTube ad metadata.",
      "Engineered text classification features using TF-IDF and NLTK.",
      "Achieved 87% classifier accuracy with Support Vector Machines."
    ]
  },
  {
    name: "Health App & Diagnostics",
    tech: "React Native // Flask // ML",
    desc: "Mobile health companion with automatic symptom inference and LLM chatbot diagnostics.",
    overview: "A secure, cross-platform mobile application utilizing natural language processing to triage patient symptoms offline.",
    constraints: "Absolute patient data privacy (HIPAA compliance), zero network coverage fallback operation.",
    solution: "Built a localized SQLite encrypted logging database paired with a Flask REST API symptom parsing engine.",
    decisions: "Selected an lightweight local inference architecture on device rather than continuous cloud pinging to guarantee user privacy.",
    impact: "Zero data leaks recorded, and achieved sub-50ms local diagnostic response times.",
    details: [
      "Developed cross-platform mobile client in React Native.",
      "Built Flask REST API for low-latency ML inferences.",
      "Integrated secure health logging and clinical metric charts."
    ]
  },
  {
    name: "Microsoft Fabric Workflows",
    tech: "Synapse // PySpark // CI-CD",
    desc: "Enterprise data engineering pipelines, DP-600 certified warehouse deployment.",
    overview: "Big data extraction, transformation, and loading pipelines managing transaction telemetry streams for Microsoft VM workloads.",
    constraints: "Extremely fragmented source structures, high daily scale (200M+ transaction rows).",
    solution: "Architected Synapse pipelines with partitioned delta lakes and automated DevOps release infrastructure.",
    decisions: "Utilized Fabric direct-lake semantic modeling to enable real-time Power BI reporting without import refreshes.",
    impact: "Cut database ingestion cycles by 40% and improved ETL processing efficiency.",
    details: [
      "Automated deployment pipelines using Azure DevOps.",
      "Optimized Synapse Spark notebooks for large scale ETL.",
      "Built scalable semantic models for Power BI integration."
    ]
  }
];

// ─── LAPTOP IDLE SCREEN TERMINAL ANIMATION ────────────────
interface LaptopIdleScreenProps {
  livery: LiveryType;
  setIsLaptopActive: (val: boolean) => void;
}

function LaptopIdleScreen({ livery, setIsLaptopActive }: LaptopIdleScreenProps) {
  const themeColor = LIVERIES[livery]?.color || "#ff6900";
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const allLines = useMemo(() => [
    "prateek@engine:~$ whoami",
    "Prateek // Systems & Data Architect",
    "prateek@engine:~$ load --telemetry",
    "Ingesting Spark cluster node stats...",
    "Telemetry link: SECURE // PORT 443",
    "Ingestion feed rate: 1000 Hz",
    "System status: TELEMETRY ACTIVE",
    "Ready to compile portfolio database.",
    "------------------------------------",
    "[CLICK SCREEN TO INGEST PORTFOLIO]"
  ], []);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let active = true;

    const typeChar = () => {
      if (!active) return;
      const targetText = allLines[lineIdx];

      if (charIdx < targetText.length) {
        setCurrentLine(targetText.slice(0, charIdx + 1));
        charIdx++;
        setTimeout(typeChar, 30 + Math.random() * 20);
      } else {
        // Line complete
        setLines(prev => [...prev, targetText]);
        setCurrentLine("");
        lineIdx = (lineIdx + 1) % allLines.length;
        charIdx = 0;
        
        // Clear terminal if full
        if (lineIdx === 0) {
          setTimeout(() => {
            if (active) setLines([]);
            typeChar();
          }, 3000);
        } else {
          setTimeout(typeChar, 500);
        }
      }
    };

    const startTimer = setTimeout(typeChar, 500);

    return () => {
      active = false;
      clearTimeout(startTimer);
    };
  }, [allLines]);

  return (
    <div 
      onClick={() => setIsLaptopActive(true)}
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        boxSizing: "border-box",
        background: "#080809",
        color: themeColor,
        fontFamily: "var(--font-mono)",
        fontSize: "9.5px",
        lineHeight: "1.4",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        textShadow: `0 0 2px ${themeColor}66`,
        opacity: 0.9,
        overflow: "hidden",
        cursor: "pointer"
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ color: l.startsWith("prateek") ? "#707072" : l.startsWith("[CLICK") ? "#ffffff" : themeColor }}>{l}</div>
      ))}
      {currentLine && (
        <div>
          <span style={{ color: currentLine.startsWith("prateek") ? "#707072" : themeColor }}>{currentLine}</span>
          <span style={{ animation: "pulse 1s infinite" }}>_</span>
        </div>
      )}
    </div>
  );
}

// ─── LAPTOP ──────────────────────────────────────────────
interface LaptopProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

function Laptop({ position, rotation }: LaptopProps) {
  const aluBrushedMat = useMemo(() => createBrushedAluminum(), []);
  const { isLaptopActive, setIsLaptopActive, activeProjectIndex, setActiveProjectIndex, livery } = usePortfolio();
  const themeColor = LIVERIES[livery]?.color || "#ff6900";

  // Parse livery color to RGB for transparency backgrounds
  const r = parseInt(themeColor.slice(1, 3), 16);
  const g = parseInt(themeColor.slice(3, 5), 16);
  const b = parseInt(themeColor.slice(5, 7), 16);
  const themeBg = `rgba(${r}, ${g}, ${b}, 0.08)`;

  const blackPlasticMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#151515"),
      roughness: 0.6,
      metalness: 0.1,
    });
  }, []);

  const chromeMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e0e0e0"),
      roughness: 0.05,
      metalness: 0.95,
      clearcoat: 1.0,
    });
  }, []);

  const blackLeatherMat = useMemo(() => createWornLeather({ color: new THREE.Color("#050505") }), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Lower chassis (Sleek Apple MacBook design) */}
      <mesh castShadow receiveShadow position={[0, 0.004, 0]} material={aluBrushedMat}>
        <boxGeometry args={[0.34, 0.008, 0.24]} />
      </mesh>

      {/* MacBook keyboard well recess */}
      <mesh position={[0, 0.0082, 0.03]} material={blackPlasticMat}>
        <boxGeometry args={[0.31, 0.001, 0.12]} />
      </mesh>

      {/* MacBook keyboard rows (procedural key layout) */}
      {[-0.04, -0.02, 0, 0.02, 0.04].map((zOffset, rowIdx) => (
        <mesh key={rowIdx} position={[0, 0.009, 0.03 + zOffset]} material={blackLeatherMat}>
          <boxGeometry args={[0.294, 0.001, 0.013]} />
        </mesh>
      ))}

      {/* MacBook Trackpad */}
      <mesh position={[0, 0.0081, -0.065]} material={aluBrushedMat}>
        <boxGeometry args={[0.088, 0.001, 0.052]} />
      </mesh>

      {/* MacBook cylindrical display hinge */}
      <mesh position={[0, 0.004, -0.118]} rotation={[0, 0, Math.PI / 2]} material={blackPlasticMat}>
        <cylinderGeometry args={[0.006, 0.006, 0.31, 12]} />
      </mesh>

      {/* Screen panel assembly */}
      <group position={[0, 0.004, -0.118]} rotation={[-Math.PI / 6, 0, 0]}>
        {/* Screen back outer casing (aluminium) */}
        <mesh castShadow position={[0, 0.115, -0.003]} material={aluBrushedMat}>
          <boxGeometry args={[0.34, 0.23, 0.006]} />
        </mesh>

        {/* Chrome Apple logo on back of screen */}
        <mesh position={[0, 0.115, -0.0062]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.001, 16]} />
        </mesh>
        
        {/* Screen inner black bezel display border */}
        <mesh position={[0, 0.115, 0.001]} material={blackPlasticMat}>
          <boxGeometry args={[0.34, 0.23, 0.002]} />
        </mesh>

        {/* MacBook screen notch */}
        <mesh position={[0, 0.224, 0.0022]} material={blackPlasticMat}>
          <boxGeometry args={[0.052, 0.01, 0.001]} />
        </mesh>
        
        <Html
          transform
          position={[0, 0.115, 0.0024]}
          rotation={[0, 0, 0]}
          scale={0.00065} // Scales 492px width to exactly fit the screen
          style={{
            width: "492px",
            height: "338px",
            border: "1px solid #2e2e30",
            borderRadius: "2px",
            boxSizing: "border-box",
            overflow: "hidden",
            userSelect: "none",
            pointerEvents: "auto", // Always allow pointer events to enable direct DOM clicks
          }}
        >
          {isLaptopActive ? (
            <div style={{
              width: "100%",
              height: "100%",
              background: "#080809",
              color: "#a4a4a6",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              padding: "16px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #2e2e30", paddingBottom: "6px" }}>
                <span style={{ color: "#ffffff", fontWeight: "bold" }}>PROJECTS EXPLORER</span>
                <span style={{ color: "#5a5a5c" }}>PRESS ESC TO EXIT</span>
              </div>

              {/* Split layout: left navigation, right details */}
              <div style={{ display: "flex", flex: 1, gap: "16px", overflow: "hidden" }}>
                {/* Left Column: list of projects */}
                <div style={{ width: "160px", borderRight: "1px solid #2e2e30", paddingRight: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {PROJECTS.map((proj, idx) => {
                    const filename = proj.name.toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".md";
                    const isSelected = activeProjectIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveProjectIndex(idx)}
                        style={{
                          background: isSelected ? "rgba(255, 255, 255, 0.05)" : "transparent",
                          border: "none",
                          color: isSelected ? "#ffffff" : "#707072",
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          textAlign: "left",
                          padding: "6px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          borderRadius: "2px",
                          width: "100%",
                        }}
                      >
                        <span style={{ color: isSelected ? themeColor : "transparent", fontSize: "8px" }}>▶</span>
                        <span style={{ fontWeight: isSelected ? "bold" : "normal", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {filename}
                        </span>
                      </button>
                    );
                  })}

                  {/* Close Button at bottom of list */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLaptopActive(false);
                      document.body.style.cursor = "auto";
                    }}
                    style={{
                      marginTop: "auto",
                      background: "transparent",
                      border: "1px solid #4e4e50",
                      color: "#a4a4a6",
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      padding: "6px 0",
                      cursor: "pointer",
                      textAlign: "center",
                      borderRadius: "2px",
                    }}
                  >
                    [close_session]
                  </button>
                </div>

                {/* Right Column: details content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", paddingRight: "4px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "11px", color: "#ffffff", fontWeight: "bold" }}>
                      {PROJECTS[activeProjectIndex].name.toUpperCase()}
                    </h3>
                    <div style={{ fontSize: "7.5px", color: "#666669", marginTop: "2px" }}>
                      SPECIFICATION_ID // P-0{activeProjectIndex + 1}
                    </div>
                  </div>

                  <div style={{ display: "inline-block", background: "rgba(255, 24, 0, 0.06)", border: "1px solid rgba(255, 24, 0, 0.15)", padding: "2px 6px", borderRadius: "2px", width: "fit-content" }}>
                    <span style={{ fontSize: "7.5px", color: "var(--orange)", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>
                      {PROJECTS[activeProjectIndex].tech}
                    </span>
                  </div>

                  <div style={{ fontSize: "8.5px", color: "#a4a4a6", lineHeight: "1.4" }}>
                    <strong>OVERVIEW:</strong> {PROJECTS[activeProjectIndex].overview}
                  </div>
                  <div style={{ fontSize: "8.5px", color: "#a4a4a6", lineHeight: "1.4" }}>
                    <strong>CONSTRAINTS:</strong> {PROJECTS[activeProjectIndex].constraints}
                  </div>
                  <div style={{ fontSize: "8.5px", color: "#a4a4a6", lineHeight: "1.4" }}>
                    <strong>SOLUTION:</strong> {PROJECTS[activeProjectIndex].solution}
                  </div>
                  <div style={{ fontSize: "8.5px", color: "#a4a4a6", lineHeight: "1.4" }}>
                    <strong>DECISION:</strong> {PROJECTS[activeProjectIndex].decisions}
                  </div>
                  <div style={{ fontSize: "8.5px", color: "var(--orange)", lineHeight: "1.4" }}>
                    <strong>IMPACT:</strong> {PROJECTS[activeProjectIndex].impact}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LaptopIdleScreen livery={livery} setIsLaptopActive={setIsLaptopActive} />
          )}
        </Html>
      </group>
    </group>
  );
}

// ─── NOTEBOOK ────────────────────────────────────────────
function Notebook({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const coverMat = useMemo(() => createWornLeather(), []);
  const pageTex = useNotebookTexture(mounted);
  const pageMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      map: pageTex || undefined,
      roughness: 0.95,
      metalness: 0.0,
    });
  }, [pageTex]);

  return (
    <group position={position} rotation={rotation}>
      {/* Leather cover */}
      <mesh castShadow position={[0, 0.0015, 0]} material={coverMat}>
        <boxGeometry args={[0.23, 0.003, 0.16]} />
      </mesh>
      {/* Pages — left angled */}
      <mesh castShadow position={[-0.051, 0.0045, 0]} rotation={[0, 0, 0.03]} material={pageMat}>
        <boxGeometry args={[0.1, 0.003, 0.15]} />
      </mesh>
      {/* Pages — right angled */}
      <mesh castShadow position={[0.051, 0.0045, 0]} rotation={[0, 0, -0.03]} material={pageMat}>
        <boxGeometry args={[0.1, 0.003, 0.15]} />
      </mesh>
    </group>
  );
}

// ─── STEAM PARTICLES ─────────────────────────────────────
function SteamParticles() {
  const count = 5;
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      ref: { current: null as THREE.Mesh | null },
      speedY: 0.015 + Math.random() * 0.015,
      startY: 0.082 + Math.random() * 0.04,
      startX: -0.01 + Math.random() * 0.02,
      startZ: -0.01 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.forEach((p) => {
      const mesh = p.ref.current;
      if (!mesh) return;
      mesh.position.y += p.speedY * 0.016;
      mesh.position.x += Math.sin(time * 2 + p.phase) * 0.0002;
      if (mesh.position.y > 0.22) {
        mesh.position.y = 0.082;
        mesh.position.x = p.startX;
        mesh.position.z = p.startZ;
        mesh.scale.set(1, 1, 1);
      } else {
        const age = (mesh.position.y - 0.082) / (0.22 - 0.082);
        mesh.scale.setScalar(1 - age * 0.6);
        if (mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - age) * 0.25;
        }
      }
    });
  });

  return (
    <group>
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={p.ref as any}
          position={[p.startX, p.startY, p.startZ]}
        >
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshBasicMaterial
            color="#eaeaea"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── COFFEE MUG ──────────────────────────────────────────
function CoffeeMug({ position }: { position: [number, number, number] }) {
  const whiteCeramicMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#eaeaea"),
      roughness: 0.1,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
  }, []);

  const coffeeLiquidMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1f140e"),
      roughness: 0.05,
      metalness: 0.0,
    });
  }, []);

  return (
    <group position={position}>
      {/* Mug Body */}
      <mesh castShadow position={[0, 0.045, 0]} material={whiteCeramicMat}>
        <cylinderGeometry args={[0.045, 0.045, 0.09, 24]} />
      </mesh>
      {/* Coffee Liquid */}
      <mesh position={[0, 0.082, 0]} material={coffeeLiquidMat}>
        <cylinderGeometry args={[0.041, 0.041, 0.002, 16]} />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[0.048, 0.045, 0]} rotation={[0, 0, Math.PI / 2]} material={whiteCeramicMat}>
        <torusGeometry args={[0.02, 0.008, 8, 16, Math.PI]} />
      </mesh>
      {/* Subtle steam particles */}
      <SteamParticles />
    </group>
  );
}

// ─── MECHANICAL PENCIL ───────────────────────────────────
function MechanicalPencil({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const metalMat = useMemo(() => createMachinedAluminum(), []);
  const orangeMat = useMemo(() => createAnodizedOrange(), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Pencil shaft */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]} material={metalMat}>
        <cylinderGeometry args={[0.0035, 0.0035, 0.15, 8]} />
      </mesh>
      {/* Small orange accent band */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={orangeMat}>
        <cylinderGeometry args={[0.0037, 0.0037, 0.008, 8]} />
      </mesh>
      {/* Pencil tip */}
      <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={metalMat}>
        <coneGeometry args={[0.0035, 0.012, 8]} />
      </mesh>
    </group>
  );
}

// ─── LEATHER GLOVES ──────────────────────────────────────
function LeatherGloves({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const leatherMat = useMemo(() => createWornLeather(), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Glove 1 */}
      <mesh castShadow position={[-0.04, 0.004, 0]} rotation={[0, 0.1, -0.05]} material={leatherMat}>
        <boxGeometry args={[0.12, 0.008, 0.18]} />
      </mesh>
      {/* Glove 2 (slightly offset and overlayed) */}
      <mesh castShadow position={[0.03, 0.006, 0.02]} rotation={[0, -0.15, 0.05]} material={leatherMat}>
        <boxGeometry args={[0.12, 0.008, 0.18]} />
      </mesh>
    </group>
  );
}

// FloatingProjects3D has been removed in favor of clickable Blueprint overlays and 2D HTML project overlays.

// ─── COMPONENT ASSEMBLY ──────────────────────────────────
export default function Workbench() {
  const { setFocusedPoster, livery } = usePortfolio();
  const themeColor = LIVERIES[livery]?.color || "#ff6900";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const walnutTex = useWalnutTexture(mounted);
  const walnutDeskMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      map: walnutTex || undefined,
      roughness: 0.65,
      metalness: 0.0,
      clearcoat: 0.15,
      clearcoatRoughness: 0.2,
    });
  }, [walnutTex]);
  const steelMat = useMemo(() => createSteel(), []);
  const aluminumMat = useMemo(() => createMachinedAluminum(), []);
  const frameMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#121214"),
      roughness: 0.65,
      metalness: 0.2,
    });
  }, []);
  const blackLeatherMat = useMemo(() => createWornLeather({ color: new THREE.Color("#111113") }), []);
  const blueprintResumeTex = useBlueprintTexture(true, mounted);
  const blueprintJourneyTex = useBlueprintTexture(false, mounted);

  const blueprintResumeMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: blueprintResumeTex,
      transparent: true,
    });
  }, [blueprintResumeTex]);

  const blueprintJourneyMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: blueprintJourneyTex,
      transparent: true,
    });
  }, [blueprintJourneyTex]);

  // Load high-fidelity realistic poster textures
  const ferrariTex = useTexture("/images/ferrari.png");
  const ktmTex = useTexture("/images/ktm.png");
  const sennaTex = useTexture("/images/senna1.png");
  const senna2Tex = useTexture("/images/senna2.png");

  const ferrariMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: ferrariTex,
      transparent: true,
    });
  }, [ferrariTex]);

  const ktmMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: ktmTex,
      transparent: true,
    });
  }, [ktmTex]);

  const sennaMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: sennaTex,
      transparent: true,
    });
  }, [sennaTex]);

  const senna2Mat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: senna2Tex,
      transparent: true,
    });
  }, [senna2Tex]);

  const wallMat = useMemo(() => createConcrete({ color: new THREE.Color("#080808") }), []);

  return (
    <group>
      {/* 1. MODULAR INDUSTRIAL GARAGE (Backdrop & Structure) */}
      <group position={[0, 1.4, -1.2]}>
        {/* Concrete Back Wall */}
        <mesh receiveShadow position={[0, 0, -0.02]} material={wallMat}>
          <planeGeometry args={[6.0, 4.0]} />
        </mesh>

        {/* Concrete Left Wall */}
        <mesh receiveShadow position={[-3.0, 0, 2.5]} rotation={[0, Math.PI / 2, 0]} material={wallMat}>
          <planeGeometry args={[5.0, 4.0]} />
        </mesh>

        {/* Concrete Right Wall */}
        <mesh receiveShadow position={[3.0, 0, 2.5]} rotation={[0, -Math.PI / 2, 0]} material={wallMat}>
          <planeGeometry args={[5.0, 4.0]} />
        </mesh>

        {/* Concrete Ceiling */}
        <mesh receiveShadow position={[0, 2.0, 2.5]} rotation={[Math.PI / 2, 0, 0]} material={wallMat}>
          <planeGeometry args={[6.0, 5.0]} />
        </mesh>

        {/* Calibration Grid Floor Helper (Elevated slightly to prevent z-fighting) */}
        <gridHelper args={[10, 20, "#222225", "#141416"]} position={[0, -1.395, 2.5]} />

        {/* Structural Steel Support Trusses */}
        {/* Horizontal Beam - Back Top Corner */}
        <mesh castShadow position={[0, 2.0, -0.02]} material={steelMat}>
          <boxGeometry args={[6.0, 0.1, 0.1]} />
        </mesh>
        {/* Horizontal Beam - Left Top Corner */}
        <mesh castShadow position={[-2.95, 2.0, 2.5]} rotation={[0, Math.PI / 2, 0]} material={steelMat}>
          <boxGeometry args={[5.0, 0.1, 0.1]} />
        </mesh>
        {/* Horizontal Beam - Right Top Corner */}
        <mesh castShadow position={[2.95, 2.0, 2.5]} rotation={[0, -Math.PI / 2, 0]} material={steelMat}>
          <boxGeometry args={[5.0, 0.1, 0.1]} />
        </mesh>
        {/* Vertical Beam - Back Left Corner */}
        <mesh castShadow position={[-2.95, 0, -0.02]} material={steelMat}>
          <boxGeometry args={[0.1, 4.0, 0.1]} />
        </mesh>
        {/* Vertical Beam - Back Right Corner */}
        <mesh castShadow position={[2.95, 0, -0.02]} material={steelMat}>
          <boxGeometry args={[0.1, 4.0, 0.1]} />
        </mesh>

        {/* Glowing LED Tube Lights (Emissive washes) */}
        {/* Left strip light */}
        <mesh position={[-2.8, 1.95, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 4.8, 8]} />
          <meshBasicMaterial color={themeColor} />
        </mesh>
        {/* Right strip light */}
        <mesh position={[2.8, 1.95, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 4.8, 8]} />
          <meshBasicMaterial color={themeColor} />
        </mesh>
        {/* Back strip light */}
        <mesh position={[0, 1.95, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 5.6, 8]} />
          <meshBasicMaterial color={themeColor} />
        </mesh>

        {/* Blueprint: Career Journey */}
        <FramedPoster
          position={[-0.55, 0.25, 0.008]}
          rotation={[0, 0, -0.02]}
          args={[0.55, 0.77]}
          material={blueprintJourneyMat}
          paperColor="#0a0e14"
          onClick={(e) => {
            e.stopPropagation();
            setFocusedPoster("journey");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
          }}
          steelMat={steelMat}
          frameMat={frameMat}
        />

        {/* Blueprint: Resume */}
        <FramedPoster
          position={[0.55, 0.25, 0.008]}
          rotation={[0, 0, 0.015]}
          args={[0.55, 0.77]}
          material={blueprintResumeMat}
          paperColor="#0a0e14"
          onClick={(e) => {
            e.stopPropagation();
            setFocusedPoster("resume");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
          }}
          steelMat={steelMat}
          frameMat={frameMat}
        />

        {/* Poster: Ferrari */}
        <FramedPoster
          position={[-1.1, 0.25, 0.008]}
          rotation={[0, 0, 0.015]}
          args={[0.4, 0.56]}
          material={ferrariMat}
          onClick={(e) => {
            e.stopPropagation();
            setFocusedPoster("ferrari");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
          }}
          steelMat={steelMat}
          frameMat={frameMat}
        />

        {/* Poster: KTM */}
        <FramedPoster
          position={[-1.65, 0.22, 0.008]}
          rotation={[0, 0, -0.02]}
          args={[0.4, 0.56]}
          material={ktmMat}
          onClick={(e) => {
            e.stopPropagation();
            setFocusedPoster("ktm");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
          }}
          steelMat={steelMat}
          frameMat={frameMat}
        />

        {/* Poster: Ayrton Senna */}
        <FramedPoster
          position={[1.1, 0.25, 0.008]}
          rotation={[0, 0, -0.01]}
          args={[0.4, 0.56]}
          material={sennaMat}
          onClick={(e) => {
            e.stopPropagation();
            setFocusedPoster("senna");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
          }}
          steelMat={steelMat}
          frameMat={frameMat}
        />

        {/* Poster: Ayrton Senna 2 (Lotus) */}
        <FramedPoster
          position={[1.65, 0.22, 0.008]}
          rotation={[0, 0, 0.02]}
          args={[0.4, 0.56]}
          material={senna2Mat}
          onClick={(e) => {
            e.stopPropagation();
            setFocusedPoster("senna2");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
          }}
          steelMat={steelMat}
          frameMat={frameMat}
        />
      </group>

      {/* 2. THE WORKBENCH TABLE STRUCTURE */}
      {/* Table slab */}
      <mesh castShadow receiveShadow position={[0, 0.72, -0.6]} material={walnutDeskMat}>
        <boxGeometry args={[1.7, 0.06, 0.8]} />
      </mesh>

      {/* Table support legs */}
      <mesh castShadow position={[-0.78, 0.36, -0.6]} material={steelMat}>
        <boxGeometry args={[0.05, 0.72, 0.7]} />
      </mesh>
      <mesh castShadow position={[0.78, 0.36, -0.6]} material={steelMat}>
        <boxGeometry args={[0.05, 0.72, 0.7]} />
      </mesh>

      {/* 3. DESK OBJECTS */}
      {/* Laptop */}
      <Laptop position={[0, 0.75, -0.65]} rotation={[0, 0, 0]} />

      {/* Notebook */}
      <Notebook position={[-0.48, 0.75, -0.55]} rotation={[0, 0.12, 0]} />

      {/* Mechanical Pencil */}
      <MechanicalPencil position={[-0.42, 0.758, -0.48]} rotation={[0, -0.6, 0]} />

      {/* Coffee Mug */}
      <CoffeeMug position={[-0.38, 0.75, -0.7]} />

      {/* Leather Gloves */}
      <LeatherGloves position={[0.45, 0.75, -0.58]} rotation={[0, -0.2, 0]} />

      {/* Glowing Brake Rotor Desk Lamp (placed on back-left side of desk) */}
      <BrakeRotorLamp
        position={[-0.72, 0.84, -0.72]}
        rotation={[0, 0.8, 0]}
        steelMat={steelMat}
        aluminumMat={aluminumMat}
      />

      {/* Shoei Helmet (placed on right side of desk) */}
      <ShoeiHelmet
        position={[0.52, 0.84, -0.42]}
        rotation={[0, -0.6, 0]}
        scale={1.385}
      />

      {/* Drafting Vernier Caliper Tool */}
      <group position={[0.2, 0.752, -0.44]} rotation={[0, 0.6, 0]}>
        <mesh castShadow material={aluminumMat}>
          <boxGeometry args={[0.16, 0.002, 0.01]} />
        </mesh>
        <mesh position={[-0.07, 0, 0.012]} material={aluminumMat}>
          <boxGeometry args={[0.006, 0.002, 0.024]} />
        </mesh>
        <mesh position={[-0.05, 0.001, 0]} material={steelMat}>
          <boxGeometry args={[0.014, 0.003, 0.012]} />
        </mesh>
      </group>

      {/* Motorcycle Key Fob */}
      <group position={[-0.32, 0.751, -0.38]} rotation={[0, 0.2, 0]}>
        <mesh castShadow material={blackLeatherMat}>
          <boxGeometry args={[0.016, 0.005, 0.038]} />
        </mesh>
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={steelMat}>
          <torusGeometry args={[0.006, 0.0012, 6, 10]} />
        </mesh>
      </group>
    </group>
  );
}
