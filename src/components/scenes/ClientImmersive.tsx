import { lazy, Suspense, useEffect, useState } from "react";
import type { SportConfig } from "./sportConfig";

const ImmersiveSportScene = lazy(() =>
  import("./ImmersiveSportScene").then((m) => ({ default: m.ImmersiveSportScene })),
);

export function ClientImmersive({ sport }: { sport: SportConfig }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="h-screen grid place-items-center text-muted-foreground text-sm">
        Loading {sport.name} experience…
      </div>
    );
  }
  return (
    <Suspense fallback={<div className="h-screen grid place-items-center text-muted-foreground text-sm">Loading…</div>}>
      <ImmersiveSportScene sport={sport} />
    </Suspense>
  );
}
