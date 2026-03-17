import { useEffect, useId, useState } from "react";
import { Contrast, Eye, Menu, RotateCcw, Type, Waves, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/hooks/use-accessibility";

const colorFilterOptions = [
  { value: "none", label: "Padrão" },
  { value: "achromatopsia", label: "Acromatopsia" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
] as const;

type AccessibilityControlsProps = {
  colorFilterId: string;
  onCloseMobile?: () => void;
};

const AccessibilityControls = ({ colorFilterId, onCloseMobile }: AccessibilityControlsProps) => {
  const {
    fontSize,
    contrastMode,
    reducedMotion,
    colorFilter,
    increaseFontSize,
    decreaseFontSize,
    resetAccessibility,
    setContrastMode,
    setReducedMotion,
    setColorFilter,
  } = useAccessibility();

  return (
    <div className="space-y-4 text-sm">
      <section aria-labelledby="a11y-font-size">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Type className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 id="a11y-font-size" className="font-medium">Tamanho da fonte</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={decreaseFontSize} aria-label="Diminuir fonte">
            A-
          </Button>
          <div className="flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-center text-muted-foreground" aria-live="polite">
            {fontSize}px
          </div>
          <Button type="button" variant="outline" size="sm" onClick={increaseFontSize} aria-label="Aumentar fonte">
            A+
          </Button>
        </div>
      </section>

      <section aria-labelledby="a11y-contrast">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Contrast className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 id="a11y-contrast" className="font-medium">Contraste</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={contrastMode === "default" ? "default" : "outline"}
            size="sm"
            aria-pressed={contrastMode === "default"}
            onClick={() => setContrastMode("default")}
          >
            Padrão
          </Button>
          <Button
            type="button"
            variant={contrastMode === "high" ? "default" : "outline"}
            size="sm"
            aria-pressed={contrastMode === "high"}
            onClick={() => setContrastMode("high")}
          >
            Alto
          </Button>
        </div>
      </section>

      <section aria-labelledby="a11y-motion">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Waves className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 id="a11y-motion" className="font-medium">Movimento</h3>
        </div>
        <Button
          type="button"
          variant={reducedMotion ? "default" : "outline"}
          size="sm"
          className="w-full"
          aria-pressed={reducedMotion}
          onClick={() => setReducedMotion(!reducedMotion)}
        >
          {reducedMotion ? "Redução ativada" : "Reduzir animações"}
        </Button>
      </section>

      <section aria-labelledby="a11y-colors">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Eye className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 id="a11y-colors" className="font-medium">Filtros visuais</h3>
        </div>
        <label className="sr-only" htmlFor={colorFilterId}>Filtro de cor</label>
        <select
          id={colorFilterId}
          value={colorFilter}
          onChange={(event) => setColorFilter(event.target.value as typeof colorFilter)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {colorFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <Button type="button" variant="ghost" size="sm" className="w-full" onClick={resetAccessibility}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Restaurar padrão
      </Button>

      {onCloseMobile && (
        <Button type="button" variant="outline" size="sm" className="w-full xl:hidden" onClick={onCloseMobile}>
          Fechar menu
        </Button>
      )}
    </div>
  );
};

const AccessibilityToolbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopFilterId = useId();
  const mobileFilterId = useId();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" className="absolute pointer-events-none">
        <defs>
          <filter id="achromatopsia">
            <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0 0 0 1 0" />
          </filter>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <aside
        aria-label="Ferramentas de acessibilidade"
        className="fixed right-4 top-20 z-50 hidden w-72 rounded-2xl border border-border bg-card/95 p-4 shadow-card backdrop-blur xl:block"
      >
        <div className="mb-4 flex items-center gap-2">
          <Eye className="h-4 w-4 text-accent" aria-hidden="true" />
          <h2 className="font-display text-sm font-semibold text-foreground">Acessibilidade</h2>
        </div>
        <AccessibilityControls colorFilterId={desktopFilterId} />
      </aside>

      <div className="fixed bottom-4 right-4 z-50 xl:hidden">
        <Button
          type="button"
          size="icon"
          className="h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground shadow-card"
          aria-label={mobileOpen ? "Fechar menu de acessibilidade" : "Abrir menu de acessibilidade"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-accessibility-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </Button>

        {mobileOpen && (
          <div
            id="mobile-accessibility-menu"
            role="dialog"
            aria-label="Menu móvel de acessibilidade"
            aria-modal="false"
            className="absolute bottom-16 right-0 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card/95 p-4 shadow-card backdrop-blur"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="font-display text-sm font-semibold text-foreground">Acessibilidade</h2>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <AccessibilityControls colorFilterId={mobileFilterId} onCloseMobile={() => setMobileOpen(false)} />
          </div>
        )}
      </div>
    </>
  );
};

export default AccessibilityToolbar;
