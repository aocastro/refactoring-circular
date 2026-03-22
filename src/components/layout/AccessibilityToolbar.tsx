import { useEffect } from "react";
import { useAccessibility } from "@/hooks/use-accessibility";

/**
 * Now only renders the SVG color-filter definitions and skip-link.
 * The accessibility button and panel moved to Navbar.
 */
const AccessibilityToolbar = () => {
  const { colorFilter } = useAccessibility();

  useEffect(() => {
    document.documentElement.style.filter = colorFilter === "none" ? "none" : `url(#${colorFilter})`;
  }, [colorFilter]);

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
    </>
  );
};

export default AccessibilityToolbar;
