import { Link, useLocation } from "react-router-dom";
import React from "react";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessibilityControls } from "./AccessibilityControls";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
          <AccessibilityControls />

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
          <AccessibilityControls />
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
