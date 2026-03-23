export interface EditorBlock {
  id: string;
  type: "banner-carousel" | "product-grid" | "esg-impact" | "text" | "image-gallery" | "video" | "newsletter" | "testimonials" | "cta" | "about" | "contact";
  visible: boolean;
  content: Record<string, string>;
  styles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    padding: string;
  };
}

export interface StoreLayout {
  blocks: EditorBlock[];
}

export const FONT_OPTIONS = [
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Lora", value: "'Lora', serif" },
  { label: "Oswald", value: "'Oswald', sans-serif" },
];

export const PADDING_OPTIONS = [
  { label: "Pequeno", value: "1rem 1.5rem" },
  { label: "Médio", value: "2rem 1.5rem" },
  { label: "Grande", value: "3rem 1.5rem" },
  { label: "Extra Grande", value: "4rem 1.5rem" },
];

export const DEFAULT_BLOCKS: EditorBlock[] = [
  {
    id: "hero",
    type: "banner-carousel",
    visible: true,
    content: {
      title: "Banners Principais",
    },
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "0",
    },
  },
  {
    id: "new-arrivals",
    type: "product-grid",
    visible: true,
    content: {
      title: "Lançamentos",
      listType: "new",
    },
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1.0rem",
    },
  },
  {
    id: "featured",
    type: "product-grid",
    visible: true,
    content: {
      title: "Produtos em Destaque",
      listType: "featured",
    },
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1.0rem",
    },
  },
  {
    id: "impact",
    type: "esg-impact",
    visible: true,
    content: {
      title: "Nosso Impacto",
    },
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1.0rem",
    },
  },
];
