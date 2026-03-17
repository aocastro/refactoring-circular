import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ContrastMode = "default" | "high";
type ColorFilter = "none" | "achromatopsia" | "protanopia" | "deuteranopia" | "tritanopia";

interface AccessibilityContextType {
  fontSize: number;
  contrastMode: ContrastMode;
  reducedMotion: boolean;
  colorFilter: ColorFilter;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetAccessibility: () => void;
  setContrastMode: (mode: ContrastMode) => void;
  setReducedMotion: (enabled: boolean) => void;
  setColorFilter: (filter: ColorFilter) => void;
}

const FONT_MIN = 14;
const FONT_MAX = 20;
const FONT_STEP = 1;

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<number>(() => {
    const stored = Number(localStorage.getItem("a11y-font-size"));
    return Number.isFinite(stored) && stored >= FONT_MIN && stored <= FONT_MAX ? stored : 16;
  });
  const [contrastMode, setContrastMode] = useState<ContrastMode>(() => {
    const stored = localStorage.getItem("a11y-contrast");
    return stored === "high" ? "high" : "default";
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const stored = localStorage.getItem("a11y-reduced-motion");
    return stored === "true";
  });
  const [colorFilter, setColorFilter] = useState<ColorFilter>(() => {
    const stored = localStorage.getItem("a11y-color-filter") as ColorFilter | null;
    return stored && ["none", "achromatopsia", "protanopia", "deuteranopia", "tritanopia"].includes(stored)
      ? stored
      : "none";
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--user-font-size", `${fontSize}px`);
    document.documentElement.dataset.contrast = contrastMode;
    document.documentElement.dataset.motion = reducedMotion ? "reduced" : "default";
    document.documentElement.style.filter = colorFilter === "none" ? "none" : `url(#${colorFilter})`;

    localStorage.setItem("a11y-font-size", String(fontSize));
    localStorage.setItem("a11y-contrast", contrastMode);
    localStorage.setItem("a11y-reduced-motion", String(reducedMotion));
    localStorage.setItem("a11y-color-filter", colorFilter);
  }, [fontSize, contrastMode, reducedMotion, colorFilter]);

  const value = useMemo(
    () => ({
      fontSize,
      contrastMode,
      reducedMotion,
      colorFilter,
      increaseFontSize: () => setFontSize((size) => Math.min(size + FONT_STEP, FONT_MAX)),
      decreaseFontSize: () => setFontSize((size) => Math.max(size - FONT_STEP, FONT_MIN)),
      resetAccessibility: () => {
        setFontSize(16);
        setContrastMode("default");
        setReducedMotion(false);
        setColorFilter("none");
      },
      setContrastMode,
      setReducedMotion,
      setColorFilter,
    }),
    [fontSize, contrastMode, reducedMotion, colorFilter],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }

  return context;
}
