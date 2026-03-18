/**
 * Template theme system — defines visual styles per template.
 * Each theme provides CSS custom properties + Tailwind class overrides.
 */

export interface TemplateTheme {
  id: string;
  name: string;
  /** Google Fonts import URL (loaded dynamically) */
  fontUrl?: string;
  /** CSS variable overrides applied via inline style on the root container */
  cssVars: Record<string, string>;
  /** Extra classes on the storefront root */
  rootClass: string;
  /** Header style classes */
  headerClass: string;
  /** Category pill — active */
  pillActiveClass: string;
  /** Category pill — inactive */
  pillClass: string;
  /** Product card overrides */
  cardClass: string;
  /** Section heading style */
  headingClass: string;
  /** Banner border radius */
  bannerClass: string;
  /** Footer */
  footerClass: string;
  /** Logo emoji override */
  logo?: string;
}

export const templateThemes: Record<string, TemplateTheme> = {
  minimal: {
    id: "minimal",
    name: "Minimalista",
    fontUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap",
    cssVars: {
      "--store-bg": "#fafafa",
      "--store-card": "#ffffff",
      "--store-text": "#1a1a1a",
      "--store-muted": "#888888",
      "--store-accent": "#1a1a1a",
      "--store-accent-fg": "#ffffff",
      "--store-border": "#e5e5e5",
      "--store-font-display": "'Playfair Display', serif",
      "--store-font-body": "'DM Sans', sans-serif",
    },
    rootClass: "text-[var(--store-text)]",
    headerClass: "bg-white/95 border-[var(--store-border)]",
    pillActiveClass: "bg-[var(--store-accent)] text-[var(--store-accent-fg)]",
    pillClass: "bg-gray-100 text-[var(--store-muted)] hover:text-[var(--store-text)]",
    cardClass: "border-[var(--store-border)] bg-[var(--store-card)] rounded-none hover:shadow-lg",
    headingClass: "tracking-tight",
    bannerClass: "rounded-none",
    footerClass: "border-[var(--store-border)]",
  },

  bold: {
    id: "bold",
    name: "Bold & Vibrante",
    fontUrl: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600&display=swap",
    cssVars: {
      "--store-bg": "#fffbe6",
      "--store-card": "#ffffff",
      "--store-text": "#1a1a1a",
      "--store-muted": "#666666",
      "--store-accent": "#ff4500",
      "--store-accent-fg": "#ffffff",
      "--store-border": "#ffd700",
      "--store-font-display": "'Archivo Black', sans-serif",
      "--store-font-body": "'Inter', sans-serif",
    },
    rootClass: "text-[var(--store-text)]",
    headerClass: "bg-[#ff4500]/95 text-white border-[#ff4500]",
    pillActiveClass: "bg-[#ff4500] text-white",
    pillClass: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    cardClass: "border-2 border-[var(--store-border)] bg-[var(--store-card)] rounded-2xl hover:shadow-xl hover:-translate-y-1",
    headingClass: "uppercase tracking-widest",
    bannerClass: "rounded-2xl",
    footerClass: "border-[#ffd700] bg-[#ff4500]/5",
  },

  classic: {
    id: "classic",
    name: "Clássico Elegante",
    fontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;700&display=swap",
    cssVars: {
      "--store-bg": "#fdf8f0",
      "--store-card": "#ffffff",
      "--store-text": "#2c2420",
      "--store-muted": "#8a7e72",
      "--store-accent": "#8b6f47",
      "--store-accent-fg": "#ffffff",
      "--store-border": "#e8ddd0",
      "--store-font-display": "'Cormorant Garamond', serif",
      "--store-font-body": "'Lato', sans-serif",
    },
    rootClass: "text-[var(--store-text)]",
    headerClass: "bg-[#fdf8f0]/95 border-[var(--store-border)]",
    pillActiveClass: "bg-[var(--store-accent)] text-[var(--store-accent-fg)]",
    pillClass: "bg-[#f3ece0] text-[var(--store-muted)] hover:text-[var(--store-text)]",
    cardClass: "border-[var(--store-border)] bg-[var(--store-card)] rounded-lg hover:shadow-md",
    headingClass: "italic",
    bannerClass: "rounded-lg",
    footerClass: "border-[var(--store-border)] bg-[#fdf8f0]",
  },

  modern: {
    id: "modern",
    name: "Moderno Escuro",
    fontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap",
    cssVars: {
      "--store-bg": "#0a0a0f",
      "--store-card": "#15151e",
      "--store-text": "#e8e8ef",
      "--store-muted": "#6b6b80",
      "--store-accent": "#8b5cf6",
      "--store-accent-fg": "#ffffff",
      "--store-border": "#2a2a3a",
      "--store-font-display": "'Space Grotesk', sans-serif",
      "--store-font-body": "'Space Grotesk', sans-serif",
    },
    rootClass: "text-[var(--store-text)]",
    headerClass: "bg-[#0a0a0f]/95 border-[var(--store-border)] backdrop-blur-md",
    pillActiveClass: "bg-[var(--store-accent)] text-white",
    pillClass: "bg-[#1e1e2e] text-[var(--store-muted)] hover:text-[var(--store-text)]",
    cardClass: "border-[var(--store-border)] bg-[var(--store-card)] rounded-xl hover:border-[var(--store-accent)]/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    headingClass: "tracking-tight",
    bannerClass: "rounded-xl",
    footerClass: "border-[var(--store-border)] bg-[#0a0a0f]",
  },

  colorful: {
    id: "colorful",
    name: "Colorido & Divertido",
    fontUrl: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600&display=swap",
    cssVars: {
      "--store-bg": "#fef7ff",
      "--store-card": "#ffffff",
      "--store-text": "#2d1b4e",
      "--store-muted": "#7c6896",
      "--store-accent": "#e040fb",
      "--store-accent-fg": "#ffffff",
      "--store-border": "#f0d4ff",
      "--store-font-display": "'Fredoka', sans-serif",
      "--store-font-body": "'Nunito', sans-serif",
    },
    rootClass: "text-[var(--store-text)]",
    headerClass: "bg-gradient-to-r from-pink-50 to-purple-50 border-[var(--store-border)]",
    pillActiveClass: "bg-gradient-to-r from-[#e040fb] to-[#7c4dff] text-white",
    pillClass: "bg-pink-50 text-[var(--store-muted)] hover:bg-purple-50",
    cardClass: "border-[var(--store-border)] bg-[var(--store-card)] rounded-3xl hover:shadow-xl hover:shadow-purple-200/50",
    headingClass: "",
    bannerClass: "rounded-3xl",
    footerClass: "border-[var(--store-border)] bg-gradient-to-r from-pink-50 to-purple-50",
  },

  eco: {
    id: "eco",
    name: "Eco-Friendly",
    fontUrl: "https://fonts.googleapis.com/css2?family=Bitter:wght@400;600;700&family=Source+Sans+3:wght@400;600&display=swap",
    cssVars: {
      "--store-bg": "#f5f0e8",
      "--store-card": "#faf7f0",
      "--store-text": "#2d3a2d",
      "--store-muted": "#6b7a6b",
      "--store-accent": "#4a7c59",
      "--store-accent-fg": "#ffffff",
      "--store-border": "#c8d8c0",
      "--store-font-display": "'Bitter', serif",
      "--store-font-body": "'Source Sans 3', sans-serif",
    },
    rootClass: "text-[var(--store-text)]",
    headerClass: "bg-[#f5f0e8]/95 border-[var(--store-border)]",
    pillActiveClass: "bg-[var(--store-accent)] text-[var(--store-accent-fg)]",
    pillClass: "bg-[#e8e0d0] text-[var(--store-muted)] hover:text-[var(--store-text)]",
    cardClass: "border-[var(--store-border)] bg-[var(--store-card)] rounded-xl hover:shadow-md",
    headingClass: "",
    bannerClass: "rounded-xl",
    footerClass: "border-[var(--store-border)] bg-[#f5f0e8]",
    logo: "🌿",
  },

  luxury: {
    id: "luxury",
    name: "Luxo Dourado",
    fontUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Montserrat:wght@300;400;600&display=swap",
    cssVars: {
      "--store-bg": "#0c0c0c",
      "--store-card": "#1a1a1a",
      "--store-text": "#e8d5b0",
      "--store-muted": "#8a7a60",
      "--store-accent": "#c9a54e",
      "--store-accent-fg": "#0c0c0c",
      "--store-border": "#2a2418",
      "--store-font-display": "'Cinzel', serif",
      "--store-font-body": "'Montserrat', sans-serif",
    },
    rootClass: "text-[var(--store-text)]",
    headerClass: "bg-[#0c0c0c]/95 border-[#2a2418] backdrop-blur-md",
    pillActiveClass: "bg-gradient-to-r from-[#c9a54e] to-[#e8d5b0] text-[#0c0c0c] font-semibold",
    pillClass: "bg-[#1a1a1a] text-[var(--store-muted)] hover:text-[var(--store-text)] border border-[#2a2418]",
    cardClass: "border-[#2a2418] bg-[var(--store-card)] rounded-none hover:border-[#c9a54e]/50 hover:shadow-[0_0_20px_rgba(201,165,78,0.1)]",
    headingClass: "uppercase tracking-[0.2em]",
    bannerClass: "rounded-none",
    footerClass: "border-[#2a2418] bg-[#0c0c0c]",
    logo: "💎",
  },

  tech: {
    id: "tech",
    name: "Tech Startup",
    fontUrl: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;600;700&display=swap",
    cssVars: {
      "--store-bg": "#080c18",
      "--store-card": "#0f1628",
      "--store-text": "#c8d6f0",
      "--store-muted": "#5a6a8a",
      "--store-accent": "#00b4ff",
      "--store-accent-fg": "#080c18",
      "--store-border": "#1a2540",
      "--store-font-display": "'Orbitron', sans-serif",
      "--store-font-body": "'Rajdhani', sans-serif",
    },
    rootClass: "text-[var(--store-text)]",
    headerClass: "bg-[#080c18]/95 border-[var(--store-border)] backdrop-blur-md",
    pillActiveClass: "bg-[var(--store-accent)] text-[var(--store-accent-fg)] font-bold",
    pillClass: "bg-[#0f1628] text-[var(--store-muted)] hover:text-[var(--store-text)] border border-[#1a2540]",
    cardClass: "border-[var(--store-border)] bg-[var(--store-card)] rounded-xl hover:border-[#00b4ff]/40 hover:shadow-[0_0_25px_rgba(0,180,255,0.12)]",
    headingClass: "uppercase tracking-wider",
    bannerClass: "rounded-xl",
    footerClass: "border-[var(--store-border)] bg-[#080c18]",
    logo: "⚡",
  },
};

/** Returns the theme for a given template id, falling back to a default */
export function getTemplateTheme(templateId?: string | null): TemplateTheme | null {
  if (!templateId) return null;
  return templateThemes[templateId] ?? null;
}
