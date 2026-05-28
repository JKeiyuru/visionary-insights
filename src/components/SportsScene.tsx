import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus, Cylinder, Box, MeshDistortMaterial, Environment, Stars, Sparkles as DreiSparkles } from "@react-three/drei";
import { useRef, Suspense } from "react";
import type { Mesh, Group } from "three";

function SoccerBall({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.4;
      ref.current.rotation.y += dt * 0.6;
    }
  });
  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.4}>
      <Sphere ref={ref} position={position} args={[0.7, 32, 32]}>
        <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.15} />
      </Sphere>
    </Float>
  );
}

function Basketball({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.8; });
  return (
    <Float speed={2} rotationIntensity={0.7} floatIntensity={1.6}>
      <Sphere ref={ref} position={position} args={[0.6, 32, 32]}>
        <meshStandardMaterial color="#ea580c" roughness={0.6} metalness={0.1} emissive="#7c2d12" emissiveIntensity={0.2} />
      </Sphere>
    </Float>
  );
}

function TennisBall({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.x += dt * 1.2; });
  return (
    <Float speed={2.4} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere ref={ref} position={position} args={[0.4, 32, 32]}>
        <MeshDistortMaterial color="#d9f99d" distort={0.08} speed={1.5} roughness={0.7} emissive="#a3e635" emissiveIntensity={0.25} />
      </Sphere>
    </Float>
  );
}

function Baseball({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 0.5; });
  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.2}>
      <Sphere ref={ref} position={position} args={[0.45, 32, 32]}>
        <meshStandardMaterial color="#fafaf9" roughness={0.5} />
      </Sphere>
    </Float>
  );
}

function F1Wheel({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 2.4; });
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={1}>
      <group ref={ref} position={position}>
        <Torus args={[0.55, 0.2, 16, 48]}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
        </Torus>
        <Torus args={[0.38, 0.04, 12, 32]}>
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
        </Torus>
      </group>
    </Float>
  );
}

function HockeyPuck({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 1.6; });
  return (
    <Float speed={1.3} rotationIntensity={0.4} floatIntensity={1.1}>
      <Cylinder ref={ref} position={position} args={[0.45, 0.45, 0.18, 32]}>
        <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.3} />
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
      <Sphere ref={ref} position={position} args={[0.45, 32, 32]} scale={[1.6, 0.85, 0.85]}>
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
        <Cylinder args={[0.32, 0.22, 0.5, 24]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} emissive="#f59e0b" emissiveIntensity={0.3} />
        </Cylinder>
        <Box args={[0.5, 0.08, 0.5]} position={[0, -0.22, 0]}>
          <meshStandardMaterial color="#92400e" metalness={0.8} roughness={0.3} />
        </Box>
      </group>
    </Float>
  );
}

export function SportsScene({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.1} />
          <pointLight position={[-4, -2, -3]} intensity={0.9} color="#d946ef" />
          <pointLight position={[4, 3, -2]} intensity={0.9} color="#06b6d4" />
          <pointLight position={[0, -4, 2]} intensity={0.5} color="#a3e635" />

          <Stars radius={40} depth={30} count={800} factor={2} fade speed={1} />
          <DreiSparkles count={40} scale={8} size={2} speed={0.4} color="#06b6d4" />

          <SoccerBall position={[-2.6, 0.8, 0]} />
          <Basketball position={[2.4, -0.4, -0.5]} />
          <TennisBall position={[1.7, 1.6, 0.6]} />
          <Baseball position={[-1.8, -1.5, 0.4]} />
          <F1Wheel position={[0.4, 0.3, -0.9]} />
          <HockeyPuck position={[-0.6, 1.9, -0.4]} />
          <RugbyBall position={[2.7, 1.2, -0.6]} />
          <TrophyShape position={[-2.2, -1.9, -0.2]} />

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
