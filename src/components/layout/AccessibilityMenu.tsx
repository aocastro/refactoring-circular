import { Contrast, Eye, RotateCcw, Type, Waves } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/hooks/use-accessibility";

const colorFilterOptions = [
  { value: "none", label: "Padrão" },
  { value: "achromatopsia", label: "Acromatopsia" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
] as const;

type ColorFilter = "none" | "achromatopsia" | "protanopia" | "deuteranopia" | "tritanopia";

export const AccessibilityControlsInline = () => {
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
  const colorFilterId = useId();

  return (
    <div className="space-y-4 text-sm">
      <section aria-labelledby="a11y-font-size-hdr">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Type className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 id="a11y-font-size-hdr" className="font-medium">Tamanho da fonte</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={decreaseFontSize} aria-label="Diminuir fonte">A-</Button>
          <div className="flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-center text-muted-foreground" aria-live="polite">{fontSize}px</div>
          <Button type="button" variant="outline" size="sm" onClick={increaseFontSize} aria-label="Aumentar fonte">A+</Button>
        </div>
      </section>

      <section aria-labelledby="a11y-contrast-hdr">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Contrast className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 id="a11y-contrast-hdr" className="font-medium">Contraste</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant={contrastMode === "default" ? "default" : "outline"} size="sm" aria-pressed={contrastMode === "default"} onClick={() => setContrastMode("default")}>Padrão</Button>
          <Button type="button" variant={contrastMode === "high" ? "default" : "outline"} size="sm" aria-pressed={contrastMode === "high"} onClick={() => setContrastMode("high")}>Alto</Button>
        </div>
      </section>

      <section aria-labelledby="a11y-motion-hdr">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Waves className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 id="a11y-motion-hdr" className="font-medium">Movimento</h3>
        </div>
        <Button type="button" variant={reducedMotion ? "default" : "outline"} size="sm" className="w-full" aria-pressed={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}>
          {reducedMotion ? "Redução ativada" : "Reduzir animações"}
        </Button>
      </section>

      <section aria-labelledby="a11y-colors-hdr">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Eye className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 id="a11y-colors-hdr" className="font-medium">Filtros visuais</h3>
        </div>
        <label className="sr-only" htmlFor={colorFilterId}>Filtro de cor</label>
        <select
          id={colorFilterId}
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value as ColorFilter)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {colorFilterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </section>

      <Button type="button" variant="ghost" size="sm" className="w-full" onClick={resetAccessibility}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Restaurar padrão
      </Button>
    </div>
  );
};
