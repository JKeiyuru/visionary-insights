import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Sphere, Cylinder, Torus, Box, RoundedBox,
  MeshDistortMaterial, MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh } from "three";
import type { SportSlug } from "./sportConfig";

/* ------------------------------------------------------------------ */
/* PBR helpers + procedural textures (canvas) for high-fidelity look. */
/* ------------------------------------------------------------------ */

function makeCanvas(size = 1024) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return { c, g: c.getContext("2d")! };
}
function toTex(c: HTMLCanvasElement, repeat = 1) {
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}
function toBumpTex(c: HTMLCanvasElement, repeat = 1) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}

function useSoccerTextures() {
  return useMemo(() => {
    const { c, g } = makeCanvas(1024);
    // base white leather
    const grd = g.createRadialGradient(512, 512, 80, 512, 512, 700);
    grd.addColorStop(0, "#ffffff"); grd.addColorStop(1, "#dcdcdc");
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
    // hex/pent pattern
    const r = 70;
    g.lineWidth = 4; g.strokeStyle = "#0b0b0b";
    for (let y = -r; y < 1024 + r; y += r * 1.5) {
      for (let x = -r; x < 1024 + r; x += r * Math.sqrt(3)) {
        const off = (Math.floor(y / (r * 1.5)) % 2) * (r * Math.sqrt(3) / 2);
        g.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          const px = x + off + Math.cos(a) * r * 0.46;
          const py = y + Math.sin(a) * r * 0.46;
          if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.closePath();
        if ((Math.floor((x + off) / r) + Math.floor(y / r)) % 3 === 0) {
          g.fillStyle = "#0a0a0a"; g.fill();
        }
        g.stroke();
      }
    }
    // micro speckle for leather grain
    for (let i = 0; i < 6000; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
      g.fillRect(Math.random() * 1024, Math.random() * 1024, 1.2, 1.2);
    }
    // bump = same pattern grayscale
    const bump = makeCanvas(512);
    bump.g.drawImage(c, 0, 0, 512, 512);
    return { map: toTex(c), bumpMap: toBumpTex(bump.c) };
  }, []);
}

function useBasketballTextures() {
  return useMemo(() => {
    const { c, g } = makeCanvas(1024);
    const grd = g.createRadialGradient(512, 512, 60, 512, 512, 720);
    grd.addColorStop(0, "#f97316"); grd.addColorStop(1, "#7c2d12");
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
    // pebble dots
    for (let i = 0; i < 9000; i++) {
      const x = Math.random() * 1024, y = Math.random() * 1024;
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "20,8,4" : "255,200,140"},${Math.random() * 0.45})`;
      g.beginPath(); g.arc(x, y, Math.random() * 2.2 + 0.4, 0, Math.PI * 2); g.fill();
    }
    // seam stripes
    g.strokeStyle = "#1a0a05"; g.lineWidth = 9;
    g.beginPath(); g.moveTo(0, 512); g.lineTo(1024, 512); g.stroke();
    g.beginPath(); g.moveTo(512, 0); g.lineTo(512, 1024); g.stroke();
    g.beginPath(); g.arc(512, 512, 280, 0.2, Math.PI - 0.2); g.stroke();
    g.beginPath(); g.arc(512, 512, 280, Math.PI + 0.2, Math.PI * 2 - 0.2); g.stroke();
    return { map: toTex(c), bumpMap: toBumpTex(c, 1) };
  }, []);
}

function useTennisTextures() {
  return useMemo(() => {
    const { c, g } = makeCanvas(1024);
    g.fillStyle = "#bef264"; g.fillRect(0, 0, 1024, 1024);
    // fuzz noise
    for (let i = 0; i < 30000; i++) {
      const x = Math.random() * 1024, y = Math.random() * 1024;
      g.fillStyle = `rgba(${180 + Math.random() * 70},${230 + Math.random() * 25},${100 + Math.random() * 30},${Math.random() * 0.6})`;
      g.fillRect(x, y, 1, 1);
    }
    // white seam curves
    g.strokeStyle = "#ffffff"; g.lineWidth = 14;
    g.beginPath(); g.moveTo(0, 350); g.bezierCurveTo(280, 500, 740, 200, 1024, 350); g.stroke();
    g.beginPath(); g.moveTo(0, 700); g.bezierCurveTo(280, 850, 740, 550, 1024, 700); g.stroke();
    return { map: toTex(c), bumpMap: toBumpTex(c) };
  }, []);
}

function useAmFootballTextures() {
  return useMemo(() => {
    const { c, g } = makeCanvas(1024);
    const grd = g.createLinearGradient(0, 0, 0, 1024);
    grd.addColorStop(0, "#7c2d12"); grd.addColorStop(0.5, "#9a3412"); grd.addColorStop(1, "#5a1d09");
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 12000; i++) {
      g.fillStyle = `rgba(40,15,5,${Math.random() * 0.4})`;
      g.beginPath(); g.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 1.6, 0, Math.PI * 2); g.fill();
    }
    // central white stripe + laces
    g.fillStyle = "#fafafa"; g.fillRect(420, 470, 184, 30);
    for (let i = 0; i < 6; i++) {
      g.fillRect(470 + i * 16, 440, 8, 90);
    }
    return { map: toTex(c), bumpMap: toBumpTex(c) };
  }, []);
}

function useBaseballTextures() {
  return useMemo(() => {
    const { c, g } = makeCanvas(1024);
    g.fillStyle = "#fafaf9"; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`;
      g.fillRect(Math.random() * 1024, Math.random() * 1024, 1, 1);
    }
    // two red stitch curves
    function stitch(yShift: number) {
      g.strokeStyle = "#b91c1c"; g.lineWidth = 4;
      for (let x = 30; x < 1024; x += 26) {
        const y = 512 + Math.sin((x / 1024) * Math.PI * 2) * 220 + yShift;
        g.beginPath();
        g.moveTo(x, y - 8); g.lineTo(x + 14, y + 8); g.stroke();
        g.beginPath();
        g.moveTo(x + 4, y + 10); g.lineTo(x + 18, y - 6); g.stroke();
      }
    }
    stitch(-60); stitch(60);
    return { map: toTex(c), bumpMap: toBumpTex(c) };
  }, []);
}

function useCricketBallTextures() {
  return useMemo(() => {
    const { c, g } = makeCanvas(512);
    const grd = g.createRadialGradient(256, 256, 30, 256, 256, 320);
    grd.addColorStop(0, "#dc2626"); grd.addColorStop(1, "#7f1d1d");
    g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = "#fafafa"; g.lineWidth = 4;
    for (let x = 20; x < 512; x += 18) {
      g.beginPath(); g.moveTo(x, 250); g.lineTo(x + 10, 262); g.stroke();
    }
    return { map: toTex(c), bumpMap: toBumpTex(c) };
  }, []);
}

function useCarbonTextures() {
  return useMemo(() => {
    const { c, g } = makeCanvas(512);
    g.fillStyle = "#0a0a0a"; g.fillRect(0, 0, 512, 512);
    g.fillStyle = "#1a1a1a";
    const s = 16;
    for (let y = 0; y < 512; y += s) {
      for (let x = 0; x < 512; x += s) {
        const off = (y / s) % 2 === 0 ? 0 : s / 2;
        g.fillRect(x + off, y, s / 2 - 1, s / 2 - 1);
        g.fillRect(x + off + s / 2, y + s / 2, s / 2 - 1, s / 2 - 1);
      }
    }
    return { map: toTex(c, 4) };
  }, []);
}

/* ------------------------------------------------------------------ */
/* Hero entry                                                         */
/* ------------------------------------------------------------------ */

export function SportHeroObject({ slug, progress = 0 }: { slug: SportSlug; progress?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * (0.25 + progress * 0.6);
    ref.current.rotation.x = Math.sin(progress * Math.PI) * 0.18;
    const s = 1 + progress * 0.12;
    ref.current.scale.set(s, s, s);
  });

  return <group ref={ref}>{renderSport(slug)}</group>;
}

function renderSport(slug: SportSlug) {
  switch (slug) {
    case "soccer": return <SoccerHero />;
    case "formula1": return <F1Hero />;
    case "basketball": return <BasketballHero />;
    case "tennis": return <TennisHero />;
    case "boxing": return <BoxingHero />;
    case "cricket": return <CricketHero />;
    case "american-football": return <AmFootHero />;
    case "baseball": return <BaseballHero />;
  }
}

/* ------------------------------ Soccer ------------------------------ */
function SoccerHero() {
  const tex = useSoccerTextures();
  return (
    <group>
      <Sphere args={[1.25, 128, 128]} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={tex.map}
          bumpMap={tex.bumpMap}
          bumpScale={0.04}
          roughness={0.55}
          clearcoat={0.4}
          clearcoatRoughness={0.45}
          sheen={0.4}
          sheenColor="#ffffff"
        />
      </Sphere>
    </group>
  );
}

/* ------------------------------ F1 ---------------------------------- */
function F1Hero() {
  const wheels = useRef<Group>(null);
  const carbon = useCarbonTextures();
  useFrame((_, dt) => { if (wheels.current) wheels.current.rotation.z -= dt * 4; });
  return (
    <group position={[0, -0.15, 0]}>
      {/* main monocoque */}
      <RoundedBox args={[2.8, 0.34, 1.0]} radius={0.12} smoothness={6} castShadow>
        <meshPhysicalMaterial map={carbon.map} color="#1a1a1a" metalness={0.4} roughness={0.25} clearcoat={1} clearcoatRoughness={0.05} />
      </RoundedBox>
      {/* side pods */}
      <RoundedBox args={[1.4, 0.45, 1.35]} radius={0.18} smoothness={6} position={[-0.1, -0.05, 0]} castShadow>
        <meshPhysicalMaterial color="#dc2626" metalness={0.5} roughness={0.25} clearcoat={1} clearcoatRoughness={0.06} />
      </RoundedBox>
      {/* engine cover */}
      <RoundedBox args={[1.5, 0.5, 0.55]} radius={0.18} smoothness={6} position={[-0.4, 0.28, 0]} castShadow>
        <meshPhysicalMaterial color="#dc2626" metalness={0.6} roughness={0.18} clearcoat={1} clearcoatRoughness={0.04} />
      </RoundedBox>
      {/* air-intake */}
      <RoundedBox args={[0.3, 0.35, 0.45]} radius={0.08} smoothness={4} position={[0.0, 0.5, 0]}>
        <meshStandardMaterial color="#000000" />
      </RoundedBox>
      {/* nose cone */}
      <Cylinder args={[0.18, 0.3, 1.1, 24]} rotation={[0, 0, Math.PI / 2]} position={[1.7, -0.05, 0]}>
        <meshPhysicalMaterial color="#dc2626" metalness={0.5} roughness={0.2} clearcoat={1} clearcoatRoughness={0.05} />
      </Cylinder>
      {/* front wing */}
      <Box args={[0.18, 0.04, 1.7]} position={[2.05, -0.18, 0]}>
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.7} roughness={0.15} clearcoat={1} />
      </Box>
      <Box args={[0.5, 0.02, 1.7]} position={[2.0, -0.13, 0]}>
        <meshPhysicalMaterial color="#dc2626" metalness={0.5} roughness={0.2} clearcoat={1} />
      </Box>
      {/* rear wing endplates + wing */}
      <Box args={[0.04, 0.6, 1.2]} position={[-1.3, 0.45, 0.6]}>
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.7} roughness={0.2} clearcoat={1} />
      </Box>
      <Box args={[0.04, 0.6, 1.2]} position={[-1.3, 0.45, -0.6]}>
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.7} roughness={0.2} clearcoat={1} />
      </Box>
      <Box args={[0.12, 0.08, 1.3]} position={[-1.3, 0.78, 0]}>
        <meshPhysicalMaterial color="#dc2626" metalness={0.5} roughness={0.2} clearcoat={1} />
      </Box>
      {/* DRS slot */}
      <Box args={[0.06, 0.04, 1.3]} position={[-1.34, 0.66, 0]}>
        <meshStandardMaterial color="#fafafa" />
      </Box>
      {/* halo */}
      <Torus args={[0.36, 0.045, 16, 48]} position={[0.3, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.95} roughness={0.1} clearcoat={1} />
      </Torus>
      {/* cockpit pad */}
      <Box args={[0.4, 0.12, 0.4]} position={[0.35, 0.22, 0]}>
        <meshStandardMaterial color="#1f1f1f" roughness={0.7} />
      </Box>

      {/* wheels */}
      <group ref={wheels}>
        {[[1.0, 0.65], [1.0, -0.65], [-0.85, 0.65], [-0.85, -0.65]].map(([x, z], i) => (
          <group key={i} position={[x, -0.25, z]}>
            <Cylinder args={[0.42, 0.42, 0.32, 32]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
            </Cylinder>
            {/* rim */}
            <Cylinder args={[0.24, 0.24, 0.34, 24]} rotation={[Math.PI / 2, 0, 0]}>
              <meshPhysicalMaterial color="#c0c0c0" metalness={1} roughness={0.25} />
            </Cylinder>
            {/* spokes */}
            {Array.from({ length: 5 }).map((_, k) => (
              <Box key={k} args={[0.04, 0.02, 0.36]} rotation={[0, 0, (Math.PI / 5) * k]}>
                <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.3} />
              </Box>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------ Basketball -------------------------- */
function BasketballHero() {
  const tex = useBasketballTextures();
  return (
    <Sphere args={[1.2, 128, 128]} castShadow>
      <meshPhysicalMaterial
        map={tex.map}
        bumpMap={tex.bumpMap}
        bumpScale={0.08}
        roughness={0.82}
        clearcoat={0.25}
        clearcoatRoughness={0.6}
      />
    </Sphere>
  );
}

/* ------------------------------ Tennis ------------------------------ */
function TennisHero() {
  const tex = useTennisTextures();
  return (
    <group>
      <Sphere args={[1.0, 128, 128]} castShadow>
        <meshPhysicalMaterial
          map={tex.map}
          bumpMap={tex.bumpMap}
          bumpScale={0.05}
          roughness={0.95}
          sheen={1}
          sheenColor="#d9f99d"
          sheenRoughness={0.7}
        />
      </Sphere>
      {/* racket behind */}
      <group position={[0.2, -0.4, -1.4]} rotation={[0, 0, 0.55]}>
        <Torus args={[0.95, 0.08, 24, 64]} castShadow>
          <meshPhysicalMaterial color="#06b6d4" metalness={0.85} roughness={0.15} clearcoat={1} />
        </Torus>
        {/* strings */}
        {Array.from({ length: 14 }).map((_, i) => (
          <Box key={`h${i}`} args={[1.8, 0.005, 0.005]} position={[0, -0.9 + i * 0.135, 0]}>
            <meshBasicMaterial color="#f4f4f5" />
          </Box>
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <Box key={`v${i}`} args={[0.005, 1.8, 0.005]} position={[-0.9 + i * 0.135, 0, 0]}>
            <meshBasicMaterial color="#f4f4f5" />
          </Box>
        ))}
        <Cylinder args={[0.07, 0.08, 1.6, 24]} position={[0, -1.6, 0]}>
          <meshPhysicalMaterial color="#0f172a" metalness={0.3} roughness={0.5} />
        </Cylinder>
        {/* grip tape */}
        <Cylinder args={[0.085, 0.085, 0.9, 24]} position={[0, -2.1, 0]}>
          <meshStandardMaterial color="#dc2626" roughness={0.9} />
        </Cylinder>
      </group>
    </group>
  );
}

/* ------------------------------ Boxing ------------------------------ */
function BoxingHero() {
  return (
    <group rotation={[0, 0.3, 0.2]}>
      {/* main hand area */}
      <Sphere args={[1.15, 64, 64]} scale={[1, 1.05, 0.95]} castShadow>
        <meshPhysicalMaterial color="#dc2626" roughness={0.45} clearcoat={1} clearcoatRoughness={0.25} sheen={0.5} sheenColor="#fca5a5" />
      </Sphere>
      {/* knuckle ridge */}
      <Torus args={[0.6, 0.07, 24, 48]} position={[0, 0.05, 0.85]} rotation={[1.2, 0, 0]}>
        <meshPhysicalMaterial color="#7f1d1d" roughness={0.45} clearcoat={0.8} />
      </Torus>
      {/* wrist cuff */}
      <Cylinder args={[0.62, 0.7, 0.8, 48]} position={[0, -1.15, 0]} castShadow>
        <meshPhysicalMaterial color="#7f1d1d" roughness={0.55} clearcoat={0.6} />
      </Cylinder>
      {/* stitched seam */}
      <Torus args={[0.7, 0.02, 12, 64]} position={[0, -1.55, 0]}>
        <meshStandardMaterial color="#fafafa" />
      </Torus>
      {/* thumb */}
      <Sphere args={[0.4, 32, 32]} position={[0.9, -0.05, 0.25]} scale={[1, 1.15, 0.9]} castShadow>
        <meshPhysicalMaterial color="#dc2626" roughness={0.45} clearcoat={1} clearcoatRoughness={0.2} />
      </Sphere>
      {/* logo plate */}
      <RoundedBox args={[0.5, 0.18, 0.05]} radius={0.04} position={[0, -1.1, 0.7]}>
        <meshPhysicalMaterial color="#fafafa" metalness={0.3} roughness={0.3} />
      </RoundedBox>
    </group>
  );
}

/* ------------------------------ Cricket ----------------------------- */
function CricketHero() {
  const ballTex = useCricketBallTextures();
  return (
    <group>
      {/* willow bat */}
      <group rotation={[0, 0, 0.25]} position={[-0.2, 0.1, 0]}>
        <RoundedBox args={[0.55, 2.0, 0.18]} radius={0.05} smoothness={4} castShadow>
          <meshPhysicalMaterial color="#fde68a" roughness={0.5} clearcoat={0.4} sheen={0.6} sheenColor="#fef3c7" />
        </RoundedBox>
        {/* spine on back */}
        <Box args={[0.12, 1.7, 0.06]} position={[0, 0, -0.12]}>
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </Box>
        {/* shoulder */}
        <Cylinder args={[0.1, 0.1, 1.05, 24]} position={[0, 1.45, 0]}>
          <meshPhysicalMaterial color="#1f2937" roughness={0.55} clearcoat={0.3} />
        </Cylinder>
        {/* grip */}
        <Cylinder args={[0.12, 0.12, 0.75, 24]} position={[0, 1.65, 0]}>
          <meshStandardMaterial color="#dc2626" roughness={0.9} />
        </Cylinder>
      </group>
      {/* ball */}
      <Sphere args={[0.34, 64, 64]} position={[0.95, -0.6, 0.35]} castShadow>
        <meshPhysicalMaterial
          map={ballTex.map}
          bumpMap={ballTex.bumpMap}
          bumpScale={0.02}
          roughness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </Sphere>
    </group>
  );
}

/* ------------------------------ Am. football ------------------------ */
function AmFootHero() {
  const tex = useAmFootballTextures();
  return (
    <group rotation={[0.2, 0.4, 0.35]}>
      <Sphere args={[0.9, 64, 64]} scale={[1.8, 0.88, 0.88]} castShadow>
        <meshPhysicalMaterial
          map={tex.map}
          bumpMap={tex.bumpMap}
          bumpScale={0.04}
          roughness={0.55}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
        />
      </Sphere>
    </group>
  );
}

/* ------------------------------ Baseball ---------------------------- */
function BaseballHero() {
  const tex = useBaseballTextures();
  return (
    <Sphere args={[1.05, 128, 128]} castShadow>
      <meshPhysicalMaterial
        map={tex.map}
        bumpMap={tex.bumpMap}
        bumpScale={0.03}
        roughness={0.5}
        clearcoat={0.6}
        clearcoatRoughness={0.25}
      />
    </Sphere>
  );
}

/** Subtle volumetric backdrop tinted to sport theme. */
export function HeroBackdrop({ color }: { color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.08; });
  return (
    <Sphere ref={ref} args={[8, 64, 64]} position={[0, 0, -5]}>
      <MeshDistortMaterial color={color} distort={0.3} speed={0.5} transparent opacity={0.14} />
    </Sphere>
  );
}

/** Optional translucent glass shard accent (premium feel). */
export function GlassAccent({ color }: { color: string }) {
  return (
    <RoundedBox args={[0.6, 1.4, 0.12]} radius={0.06} position={[2.2, -1.0, 0.5]} rotation={[0, 0.4, 0.2]}>
      <MeshTransmissionMaterial
        color={color}
        thickness={0.5}
        roughness={0.05}
        transmission={1}
        ior={1.4}
        chromaticAberration={0.02}
        backside
      />
    </RoundedBox>
  );
}
