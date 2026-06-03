import { useEffect, useState } from "react";

/**
 * Responsive viewport hook.
 * Breakpoints:
 *   mobile  : < 640
 *   tablet  : 640 - 1023
 *   desktop : 1024 - 1535
 *   wide    : >= 1536  (large/curved/ultrawide screens)
 */
export type Viewport = {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  /** true for phones AND tablets (< 1024) */
  isHandheld: boolean;
};

const DEFAULT: Viewport = {
  width: 1280,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isWide: false,
  isHandheld: false,
};

function compute(width: number): Viewport {
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024 && width < 1536;
  const isWide = width >= 1536;
  return { width, isMobile, isTablet, isDesktop, isWide, isHandheld: isMobile || isTablet };
}

export function useViewport(): Viewport {
  const [v, setV] = useState<Viewport>(DEFAULT);
  useEffect(() => {
    function onResize() {
      setV(compute(window.innerWidth));
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return v;
}

/** Pick a value per breakpoint. Falls back left-to-right. */
export function pick<T>(v: Viewport, opts: { mobile?: T; tablet?: T; desktop?: T; wide?: T; base: T }): T {
  if (v.isMobile && opts.mobile !== undefined) return opts.mobile;
  if (v.isTablet && opts.tablet !== undefined) return opts.tablet;
  if (v.isDesktop && opts.desktop !== undefined) return opts.desktop;
  if (v.isWide && opts.wide !== undefined) return opts.wide;
  return opts.base;
}
