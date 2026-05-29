import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus, Cylinder, Box, Environment, Stars, Sparkles as DreiSparkles, MeshWobbleMaterial } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";
import type { Mesh, Group } from "three";

/* ------------------------------------------------------------------ */
/* Procedural canvas textures — keeps the bundle lean while delivering */
/* a real "sports object" look (panels, seams, treads, laces).         */
/* ------------------------------------------------------------------ */

function useSoccerTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, 512, 512);
    g.fillStyle = "#0a0a0a";
    // hex/pent pattern
    const r = 46;
    for (let y = 0; y < 512 + r; y += r * 1.5) {
      for (let x = 0; x < 512 + r; x += r * Math.sqrt(3)) {
        const off = (Math.floor(y / (r * 1.5)) % 2) * (r * Math.sqrt(3) / 2);
        g.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          const px = x + off + Math.cos(a) * r * 0.42;
          const py = y + Math.sin(a) * r * 0.42;
          if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.closePath();
        if ((Math.floor(x / r) + Math.floor(y / r)) % 3 === 0) g.fill();
        g.lineWidth = 2; g.strokeStyle = "#111"; g.stroke();
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, []);
}

function useBasketballTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(256, 256, 60, 256, 256, 300);
    grd.addColorStop(0, "#f97316"); grd.addColorStop(1, "#9a3412");
    g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
    // pebble noise
    for (let i = 0; i < 2000; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`;
      g.beginPath(); g.arc(Math.random() * 512, Math.random() * 512, Math.random() * 1.6, 0, Math.PI * 2); g.fill();
    }
    g.strokeStyle = "#1a0a05"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(0, 256); g.lineTo(512, 256); g.stroke();
    g.beginPath(); g.moveTo(256, 0); g.lineTo(256, 512); g.stroke();
    g.beginPath(); g.arc(256, 256, 220, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
    g.beginPath(); g.arc(256, 256, 220, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
    return new THREE.CanvasTexture(c);
  }, []);
}

function useTennisTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#d9f99d"; g.fillRect(0, 0, 512, 512);
    // fuzz
    for (let i = 0; i < 6000; i++) {
      g.fillStyle = `rgba(132,204,22,${Math.random() * 0.35})`;
      g.fillRect(Math.random() * 512, Math.random() * 512, 1, 2);
    }
    g.strokeStyle = "#ffffff"; g.lineWidth = 6;
    g.beginPath(); g.arc(256, 256, 240, Math.PI * 0.1, Math.PI * 0.9); g.stroke();
    g.beginPath(); g.arc(256, 256, 240, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    return new THREE.CanvasTexture(c);
  }, []);
}

function useBaseballTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#fafaf9"; g.fillRect(0, 0, 512, 512);
    // red stitches
    g.strokeStyle = "#dc2626"; g.lineWidth = 3;
    for (let s = 0; s < 2; s++) {
      const cy = s === 0 ? 200 : 312;
      for (let x = 30; x < 482; x += 22) {
        g.beginPath();
        g.moveTo(x, cy - 10 + (s ? 8 : -8));
        g.lineTo(x + 14, cy + 10 + (s ? -8 : 8));
        g.stroke();
      }
    }
    return new THREE.CanvasTexture(c);
  }, []);
}

/* ------------------------ Sports objects ------------------------ */

function SoccerBall({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  const tex = useSoccerTexture();
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.5;
      ref.current.rotation.y += dt * 0.7;
    }
  });
  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.4}>
      <Sphere ref={ref} position={position} args={[0.72, 64, 64]}>
        <meshStandardMaterial map={tex} roughness={0.5} metalness={0.1} />
      </Sphere>
    </Float>
  );
}

function Basketball({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  const tex = useBasketballTexture();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.9; });
  return (
    <Float speed={2} rotationIntensity={0.7} floatIntensity={1.6}>
      <Sphere ref={ref} position={position} args={[0.62, 64, 64]}>
        <meshStandardMaterial map={tex} roughness={0.85} metalness={0.05} />
      </Sphere>
    </Float>
  );
}

function TennisBall({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  const tex = useTennisTexture();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.x += dt * 1.2; });
  return (
    <Float speed={2.4} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere ref={ref} position={position} args={[0.42, 64, 64]}>
        <meshStandardMaterial map={tex} roughness={0.95} emissive="#65a30d" emissiveIntensity={0.15} />
      </Sphere>
    </Float>
  );
}

function Baseball({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  const tex = useBaseballTexture();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 0.5; });
  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.2}>
      <Sphere ref={ref} position={position} args={[0.46, 64, 64]}>
        <meshStandardMaterial map={tex} roughness={0.6} />
      </Sphere>
    </Float>
  );
}

function F1Wheel({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 3; });
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={1}>
      <group ref={ref} position={position}>
        {/* tyre */}
        <Torus args={[0.55, 0.22, 24, 64]}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.95} metalness={0.05} />
        </Torus>
        {/* rim */}
        <Cylinder args={[0.36, 0.36, 0.42, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.9} />
        </Cylinder>
        {/* spokes — 5 */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Box key={i} args={[0.08, 0.62, 0.04]} rotation={[0, 0, (Math.PI * 2 * i) / 5]}>
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} metalness={0.7} />
          </Box>
        ))}
      </group>
    </Float>
  );
}

function HockeyPuck({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 1.6; });
  return (
    <Float speed={1.3} rotationIntensity={0.4} floatIntensity={1.1}>
      <Cylinder ref={ref} position={position} args={[0.45, 0.45, 0.18, 48]}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.4} />
      </Cylinder>
    </Float>
  );
}

function RugbyBall({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.7;
      ref.current.rotation.z += dt * 0.4;
    }
  });
  return (
    <Float speed={1.7} rotationIntensity={0.6} floatIntensity={1.3}>
      <Sphere ref={ref} position={position} args={[0.45, 48, 48]} scale={[1.7, 0.85, 0.85]}>
        <meshStandardMaterial color="#7c2d12" roughness={0.55} />
      </Sphere>
    </Float>
  );
}

function TrophyShape({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.6; });
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={ref} position={position}>
        <Cylinder args={[0.34, 0.22, 0.55, 32]} position={[0, 0.12, 0]}>
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.12} emissive="#f59e0b" emissiveIntensity={0.35} />
        </Cylinder>
        <Box args={[0.55, 0.09, 0.55]} position={[0, -0.24, 0]}>
          <meshStandardMaterial color="#92400e" metalness={0.85} roughness={0.25} />
        </Box>
      </group>
    </Float>
  );
}

/* Subtle volumetric blob behind everything */
function EnergyBlob() {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.15;
  });
  return (
    <Sphere ref={ref} args={[3.3, 64, 64]} position={[0, 0, -2.5]}>
      <MeshWobbleMaterial color="#1f4ed8" factor={0.35} speed={0.6} transparent opacity={0.07} />
    </Sphere>
  );
}

export function SportsScene({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-4, -2, -3]} intensity={0.9} color="#fde047" />
          <pointLight position={[4, 3, -2]} intensity={1} color="#1f4ed8" />
          <pointLight position={[0, -4, 2]} intensity={0.6} color="#ef4444" />

          <Stars radius={40} depth={30} count={800} factor={2} fade speed={1} />
          <DreiSparkles count={50} scale={9} size={2.2} speed={0.5} color="#fde047" />
          <EnergyBlob />

          <SoccerBall position={[-2.6, 0.8, 0]} />
          <Basketball position={[2.4, -0.4, -0.5]} />
          <TennisBall position={[1.7, 1.6, 0.6]} />
          <Baseball position={[-1.8, -1.5, 0.4]} />
          <F1Wheel position={[0.4, 0.3, -0.9]} />
          <HockeyPuck position={[-0.6, 1.9, -0.4]} />
          <RugbyBall position={[2.7, 1.2, -0.6]} />
          <TrophyShape position={[-2.2, -1.9, -0.2]} />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
