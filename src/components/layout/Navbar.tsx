import { Link, useLocation } from "react-router-dom";
import React from "react";
import logo from "@/assets/logo.png";
import { A11yIcon } from "@/components/icons/A11yIcon";
import { useState } from "react";
import { Menu, X, Sun, Moon, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAccessibility } from "@/hooks/use-accessibility";
import { AccessibilityControlsInline } from "./AccessibilityMenu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useAccessibility();

  const links = [
    { label: "Home", href: "/" },
    { label: "Planos de Loja", href: "/planos" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass" role="banner">
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" aria-label="Ir para a página inicial da Circular u-Shar">
          <img src={logo} alt="Circular u-Shar" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-lg text-foreground">
            Circular <span className="text-accent text-sm">u-Shar</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={location.pathname === link.href ? "page" : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          {/* Zoom controls */}
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

          {/* Accessibility menu */}
          <div className="relative">
            <button
              onClick={() => setA11yOpen((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              aria-label={a11yOpen ? "Fechar menu de acessibilidade" : "Abrir menu de acessibilidade"}
              aria-expanded={a11yOpen}
              aria-controls="a11y-header-panel"
              title="Acessibilidade"
            >
              <A11yIcon className="h-5 w-5 text-current" aria-hidden="true" />
            </button>

            {a11yOpen && (
              <div
                id="a11y-header-panel"
                role="dialog"
                aria-label="Menu de acessibilidade"
                aria-modal="false"
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground rounded-lg">
            <Link to="/planos">Abrir minha loja</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={decreaseFontSize}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Diminuir fonte"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={increaseFontSize}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Aumentar fonte"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setA11yOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label={a11yOpen ? "Fechar menu de acessibilidade" : "Abrir menu de acessibilidade"}
          >
            <A11yIcon className="h-5 w-5 text-current" aria-hidden="true" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile a11y panel */}
      {a11yOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl px-5 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200" aria-label="Menu de acessibilidade">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <A11yIcon className="h-5 w-5 text-current" aria-hidden="true" />
              <h2 className="font-display text-sm font-semibold text-foreground">Acessibilidade</h2>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Fechar" onClick={() => setA11yOpen(false)}>
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <AccessibilityControlsInline />
        </div>
      )}

      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden glass border-t border-border px-4 py-4 space-y-3" aria-label="Menu móvel">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={location.pathname === link.href ? "page" : undefined}
              className="block text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="flex-1 bg-gradient-primary text-primary-foreground">
              <Link to="/planos">Abrir loja</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
