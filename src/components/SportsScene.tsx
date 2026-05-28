import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus, MeshDistortMaterial, Environment } from "@react-three/drei";
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
        <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.1} />
      </Sphere>
    </Float>
  );
}

function Basketball({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.8;
  });
  return (
    <Float speed={2} rotationIntensity={0.7} floatIntensity={1.6}>
      <Sphere ref={ref} position={position} args={[0.65, 32, 32]}>
        <meshStandardMaterial color="#ea580c" roughness={0.6} metalness={0.05} />
      </Sphere>
    </Float>
  );
}

function TennisBall({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.x += dt * 1.2;
  });
  return (
    <Float speed={2.4} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere ref={ref} position={position} args={[0.45, 32, 32]}>
        <MeshDistortMaterial color="#d9f99d" distort={0.1} speed={1.5} roughness={0.7} />
      </Sphere>
    </Float>
  );
}

function Baseball({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.5;
  });
  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.2}>
      <Sphere ref={ref} position={position} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="#fafaf9" roughness={0.5} />
      </Sphere>
    </Float>
  );
}

function F1Wheel({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 2.2;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={1}>
      <group ref={ref} position={position}>
        <Torus args={[0.6, 0.22, 16, 48]}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
        </Torus>
        <Torus args={[0.42, 0.05, 12, 32]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.7} />
        </Torus>
      </group>
    </Float>
  );
}

export function SportsScene({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-4, -2, -3]} intensity={0.6} color="#10b981" />
          <pointLight position={[4, 3, -2]} intensity={0.6} color="#2563eb" />
          <SoccerBall position={[-2.4, 0.6, 0]} />
          <Basketball position={[2.2, -0.5, -0.5]} />
          <TennisBall position={[1.5, 1.5, 0.5]} />
          <Baseball position={[-1.6, -1.4, 0.3]} />
          <F1Wheel position={[0.3, 0.2, -0.8]} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
