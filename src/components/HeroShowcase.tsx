import { lazy, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows, MeshReflectorMaterial, Sparkles, OrbitControls } from "@react-three/drei";
import { SportHeroObject } from "@/components/scenes/SportHeroObject";
import type { SportSlug } from "@/components/scenes/sportConfig";

/**
 * Cinematic hero scene — multiple sports objects on a reflective floor with
 * studio lighting. Used on landing + dashboard hero strips.
 */
function HeroSceneInner({ sports = ["soccer", "formula1", "basketball"] as SportSlug[], compact = false }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, compact ? 1.2 : 1.8, compact ? 6.5 : 7.5], fov: 38 }}
      gl={{ antialias: true, toneMappingExposure: 1.1 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 6]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]}>
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
      </directionalLight>
      <pointLight position={[-6, 3, -4]} intensity={1.6} color="#3b82f6" />
      <pointLight position={[6, 2, -3]} intensity={1.4} color="#ef4444" />
      <pointLight position={[0, 4, 5]} intensity={0.9} color="#fbbf24" />

      {sports.map((s, i) => {
        const spread = sports.length === 1 ? 0 : 2.6;
        const x = (i - (sports.length - 1) / 2) * spread;
        return (
          <Float key={s} speed={1 + i * 0.2} rotationIntensity={0.3} floatIntensity={0.6}>
            <group position={[x, 0, 0]} scale={0.75}>
              <SportHeroObject slug={s} progress={0.2} />
            </group>
          </Float>
        );
      })}

      <Sparkles count={60} scale={12} size={2} speed={0.3} color="#fbbf24" />

      {/* polished floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1.2}
          mixStrength={50}
          roughness={0.85}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#06070d"
          metalness={0.6}
          mirror={0.55}
        />
      </mesh>
      <ContactShadows position={[0, -1.58, 0]} opacity={0.65} scale={20} blur={2.6} far={6} />

      <Environment preset="studio" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} minPolarAngle={Math.PI / 2.6} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}

export function HeroShowcase(props: { sports?: SportSlug[]; compact?: boolean; className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={props.className} />;
  return (
    <div className={props.className}>
      <Suspense fallback={<div className="h-full w-full" />}>
        <HeroSceneInner sports={props.sports} compact={props.compact} />
      </Suspense>
    </div>
  );
}

export const LazyHeroShowcase = lazy(() => Promise.resolve({ default: HeroShowcase }));
