import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Sun, Moon, X } from "lucide-react";
import { A11yIcon } from "@/components/icons/A11yIcon";
import { AccessibilityControlsInline } from "./AccessibilityMenu";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

interface AccessibilityControlsProps {
  className?: string;
}

export const AccessibilityControls = ({ className = "" }: AccessibilityControlsProps) => {
  const [a11yOpen, setA11yOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useAccessibility();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setA11yOpen(false);
      }
    };

    if (a11yOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [a11yOpen]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={decreaseFontSize}
        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`Diminuir fonte (atual: ${fontSize}px)`}
        title="Diminuir fonte"
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      <button
        onClick={increaseFontSize}
        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`Aumentar fonte (atual: ${fontSize}px)`}
        title="Aumentar fonte"
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setA11yOpen((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          aria-label={a11yOpen ? "Fechar menu de acessibilidade" : "Abrir menu de acessibilidade"}
          aria-expanded={a11yOpen}
          title="Acessibilidade"
        >
          <A11yIcon className="h-5 w-5 text-current" aria-hidden="true" />
        </button>

        {a11yOpen && (
          <div
            ref={menuRef}
            role="dialog"
            aria-label="Menu de acessibilidade"
            className="absolute top-full right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border/50 bg-background/90 p-5 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 z-50 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <A11yIcon className="h-5 w-5 text-current" aria-hidden="true" />
                <h2 className="font-display text-sm font-semibold text-foreground">Acessibilidade</h2>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setA11yOpen(false)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <AccessibilityControlsInline />
          </div>
        )}
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
};
