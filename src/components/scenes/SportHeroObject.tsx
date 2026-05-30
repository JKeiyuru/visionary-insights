import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Cylinder, Torus, Box, RoundedBox, MeshDistortMaterial } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { SportSlug } from "./sportConfig";

/**
 * One procedural 3D hero per sport. Each is a small group designed to look
 * recognisable at hero scale while keeping bundle size near zero (no GLTF).
 * `progress` (0..1) lets parent scroll-trigger drive deformation/rotation.
 */
export function SportHeroObject({ slug, progress = 0 }: { slug: SportSlug; progress?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * (0.25 + progress * 0.6);
    ref.current.rotation.x = Math.sin(progress * Math.PI) * 0.25;
    const s = 1 + progress * 0.15;
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

function SoccerHero() {
  return (
    <group>
      <Sphere args={[1.2, 64, 64]}>
        <meshStandardMaterial color="#fafafa" roughness={0.5} metalness={0.05} />
      </Sphere>
      {/* hex panel hint via slight wireframe overlay */}
      <Sphere args={[1.205, 12, 12]}>
        <meshBasicMaterial color="#0a0a0a" wireframe />
      </Sphere>
    </group>
  );
}

function F1Hero() {
  const wheel = useRef<Mesh>(null);
  useFrame((_, dt) => { if (wheel.current) wheel.current.rotation.z -= dt * 3; });
  return (
    <group>
      {/* chassis */}
      <RoundedBox args={[2.4, 0.35, 1.0]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.25} />
      </RoundedBox>
      {/* nose */}
      <Box args={[1.0, 0.18, 0.4]} position={[1.4, 0, 0]}>
        <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.4} />
      </Box>
      {/* front wing */}
      <Box args={[0.1, 0.05, 1.4]} position={[1.7, -0.05, 0]}>
        <meshStandardMaterial color="#fafafa" />
      </Box>
      {/* rear wing */}
      <Box args={[0.1, 0.55, 1.2]} position={[-1.1, 0.4, 0]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.3} />
      </Box>
      {/* halo */}
      <Torus args={[0.32, 0.04, 16, 32]} position={[0.2, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.9} />
      </Torus>
      {/* wheels */}
      {[[0.9, 0.6], [0.9, -0.6], [-0.7, 0.6], [-0.7, -0.6]].map(([x, z], i) => (
        <group key={i} position={[x, -0.2, z]}>
          <Cylinder ref={i === 0 ? wheel : null} args={[0.32, 0.32, 0.22, 24]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

function BasketballHero() {
  return (
    <group>
      <Sphere args={[1.15, 64, 64]}>
        <meshStandardMaterial color="#ea580c" roughness={0.85} />
      </Sphere>
      {/* seams */}
      <Torus args={[1.16, 0.018, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1a0a05" />
      </Torus>
      <Torus args={[1.16, 0.018, 8, 64]}>
        <meshStandardMaterial color="#1a0a05" />
      </Torus>
    </group>
  );
}

function TennisHero() {
  return (
    <group>
      <Sphere args={[0.95, 64, 64]}>
        <meshStandardMaterial color="#bef264" roughness={0.95} emissive="#65a30d" emissiveIntensity={0.15} />
      </Sphere>
      {/* white seam */}
      <Torus args={[0.96, 0.025, 8, 64]} rotation={[0.4, 0.2, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Torus>
      {/* racket behind */}
      <group position={[0, 0, -1.1]} rotation={[0, 0, 0.4]}>
        <Torus args={[0.85, 0.07, 16, 48]}>
          <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.2} />
        </Torus>
        <Cylinder args={[0.06, 0.06, 1.4, 16]} position={[0, -1.4, 0]}>
          <meshStandardMaterial color="#0f172a" />
        </Cylinder>
      </group>
    </group>
  );
}

function BoxingHero() {
  return (
    <group>
      {/* glove (rounded form) */}
      <Sphere args={[1.1, 32, 32]} scale={[1, 1.05, 0.95]}>
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </Sphere>
      <Cylinder args={[0.55, 0.65, 0.7, 32]} position={[0, -1.1, 0]}>
        <meshStandardMaterial color="#7f1d1d" roughness={0.5} />
      </Cylinder>
      {/* thumb */}
      <Sphere args={[0.35, 24, 24]} position={[0.85, -0.15, 0.15]} scale={[1, 1.1, 0.9]}>
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </Sphere>
    </group>
  );
}

function CricketHero() {
  return (
    <group>
      {/* bat */}
      <Box args={[0.45, 1.8, 0.12]}>
        <meshStandardMaterial color="#fde68a" roughness={0.6} />
      </Box>
      {/* handle */}
      <Cylinder args={[0.08, 0.08, 1.0, 16]} position={[0, 1.4, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      {/* ball */}
      <Sphere args={[0.32, 32, 32]} position={[0.9, -0.4, 0.3]}>
        <meshStandardMaterial color="#b91c1c" roughness={0.6} />
      </Sphere>
    </group>
  );
}

function AmFootHero() {
  return (
    <group>
      <Sphere args={[0.9, 48, 48]} scale={[1.7, 0.85, 0.85]}>
        <meshStandardMaterial color="#7c2d12" roughness={0.55} />
      </Sphere>
      {/* white laces band */}
      <Box args={[0.6, 0.07, 0.02]} position={[0, 0, 0.78]}>
        <meshStandardMaterial color="#fafafa" />
      </Box>
      {[-0.2, -0.05, 0.1, 0.25].map((x) => (
        <Box key={x} args={[0.04, 0.18, 0.02]} position={[x, 0, 0.79]}>
          <meshStandardMaterial color="#fafafa" />
        </Box>
      ))}
    </group>
  );
}

function BaseballHero() {
  return (
    <group>
      <Sphere args={[1.05, 64, 64]}>
        <meshStandardMaterial color="#fafaf9" roughness={0.6} />
      </Sphere>
      {/* red stitches */}
      <Torus args={[1.06, 0.022, 8, 64]} rotation={[0.6, 0, 0]}>
        <meshStandardMaterial color="#dc2626" />
      </Torus>
      <Torus args={[1.06, 0.022, 8, 64]} rotation={[-0.6, 0, 0]}>
        <meshStandardMaterial color="#dc2626" />
      </Torus>
    </group>
  );
}

/** Subtle volumetric backdrop tinted to sport theme. */
export function HeroBackdrop({ color }: { color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.1; });
  return (
    <Sphere ref={ref} args={[6, 32, 32]} position={[0, 0, -4]}>
      <MeshDistortMaterial color={color} distort={0.35} speed={0.6} transparent opacity={0.12} />
    </Sphere>
  );
}
