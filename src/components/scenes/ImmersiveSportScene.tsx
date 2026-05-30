import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Stars, Sparkles, Float } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { SportHeroObject, HeroBackdrop } from "./SportHeroObject";
import type { SportConfig } from "./sportConfig";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives the camera based on scroll progress through the chapter section.
 */
function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  useEffect(() => {
    // Smooth dolly: pull in then orbit
    const t = progress;
    const z = 6 - t * 3; // 6 -> 3
    const y = Math.sin(t * Math.PI) * 0.8;
    const x = Math.sin(t * Math.PI * 2) * 1.2;
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  }, [progress, camera]);
  return null;
}

export function ImmersiveSportScene({ sport }: { sport: SportConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !sceneRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          setProgress(self.progress);
          const idx = Math.min(sport.chapters.length - 1, Math.floor(self.progress * sport.chapters.length));
          setActiveChapter(idx);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [sport.chapters.length]);

  return (
    <div ref={containerRef} className="relative" style={{ height: `${sport.chapters.length * 100}vh` }}>
      {/* Pinned 3D scene */}
      <div ref={sceneRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-4, 2, -3]} intensity={1.2} color={sport.primary} />
          <pointLight position={[4, -2, -2]} intensity={1} color={sport.accent} />
          <Stars radius={50} depth={30} count={1500} factor={2.5} fade speed={1} />
          <Sparkles count={80} scale={10} size={2.5} speed={0.4} color={sport.accent} />
          <HeroBackdrop color={sport.primary} />
          <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
            <SportHeroObject slug={sport.slug} progress={progress} />
          </Float>
          <CameraRig progress={progress} />
          <Environment preset="city" />
        </Canvas>

        {/* Overlaid chapter HUD */}
        <div className="pointer-events-none absolute inset-0 flex">
          {/* Left: chapter text */}
          <div className="flex-1 flex items-center px-6 sm:px-16">
            <motion.div
              key={activeChapter}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: sport.accent }} />
                Chapter {activeChapter + 1} / {sport.chapters.length}
              </div>
              <h2 className="mt-4 font-display text-4xl sm:text-6xl font-semibold leading-[1.05]"
                  style={{ background: `linear-gradient(90deg, ${sport.primary}, ${sport.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {sport.chapters[activeChapter].title}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-foreground/85 max-w-md">
                {sport.chapters[activeChapter].body}
              </p>
              {sport.chapters[activeChapter].metric && (
                <div className="mt-6 inline-flex items-baseline gap-3 rounded-2xl border border-border bg-card/70 backdrop-blur px-4 py-3">
                  <span className="font-display text-3xl font-semibold" style={{ color: sport.accent }}>
                    {sport.chapters[activeChapter].metric!.value}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {sport.chapters[activeChapter].metric!.label}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: progress rail */}
          <div className="hidden md:flex flex-col items-end justify-center gap-3 px-10">
            {sport.chapters.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-widest transition ${i === activeChapter ? "text-foreground" : "text-muted-foreground/60"}`}>
                  {String(i + 1).padStart(2, "0")} · {c.title.replace(".", "")}
                </span>
                <span className={`h-px transition-all`} style={{
                  width: i === activeChapter ? 60 : 24,
                  background: i === activeChapter ? sport.accent : "currentColor",
                  opacity: i === activeChapter ? 1 : 0.3,
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/40">
          <div className="h-full transition-[width]" style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${sport.primary}, ${sport.accent})`,
          }} />
        </div>
      </div>
    </div>
  );
}
