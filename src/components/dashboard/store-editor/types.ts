export interface EditorBlock {
  id: string;
  type: "hero-banner" | "text" | "image-gallery" | "video" | "newsletter" | "products" | "testimonials" | "cta" | "about" | "contact";
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
    type: "hero-banner",
    visible: true,
    content: {
      title: "Bem-vindo à nossa loja",
      subtitle: "Descubra produtos incríveis com preços imperdíveis",
      buttonText: "Ver Produtos",
      imageUrl: "",
    },
    styles: {
      backgroundColor: "#8b5cf6",
      textColor: "#ffffff",
      accentColor: "#a78bfa",
      fontFamily: "'Space Grotesk', sans-serif",
      padding: "3rem 1.5rem",
    },
  },
  {
    id: "about",
    type: "about",
    visible: true,
    content: {
      title: "Sobre Nós",
      description: "Somos apaixonados por moda circular e sustentabilidade. Cada peça conta uma história.",
    },
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "gallery",
    type: "image-gallery",
    visible: true,
    content: {
      title: "Galeria",
      image1: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      image2: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop",
      image3: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      image4: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop",
    },
    styles: {
      backgroundColor: "#f9fafb",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "products",
    type: "products",
    visible: true,
    content: {
      title: "Produtos em Destaque",
      subtitle: "Os mais procurados da semana",
    },
    styles: {
      backgroundColor: "#f9fafb",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "video",
    type: "video",
    visible: true,
    content: {
      title: "Conheça Nossa História",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Assista ao vídeo e descubra como a moda circular pode transformar o mundo.",
    },
    styles: {
      backgroundColor: "#1a1a1a",
      textColor: "#ffffff",
      accentColor: "#8b5cf6",
      fontFamily: "'Space Grotesk', sans-serif",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "testimonials",
    type: "testimonials",
    visible: true,
    content: {
      title: "O que nossos clientes dizem",
    },
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "newsletter",
    type: "newsletter",
    visible: true,
    content: {
      title: "Fique por dentro!",
      subtitle: "Receba novidades e ofertas exclusivas direto no seu e-mail.",
      buttonText: "Inscrever-se",
      placeholder: "Seu melhor e-mail",
    },
    styles: {
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
      accentColor: "#c4b5fd",
      fontFamily: "'Space Grotesk', sans-serif",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "cta",
    type: "cta",
    visible: true,
    content: {
      title: "Não perca nossas ofertas!",
      subtitle: "Cadastre-se e receba 10% de desconto na primeira compra",
      buttonText: "Cadastrar",
    },
    styles: {
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
      accentColor: "#c4b5fd",
      fontFamily: "'Space Grotesk', sans-serif",
      padding: "2rem 1.5rem",
    },
  },
  {
    id: "contact",
    type: "contact",
    visible: true,
    content: {
      title: "Fale Conosco",
      description: "Estamos aqui para ajudar. Entre em contato!",
      email: "contato@minhaloja.com",
      phone: "(11) 99999-9999",
    },
    styles: {
      backgroundColor: "#f3f4f6",
      textColor: "#1a1a1a",
      accentColor: "#8b5cf6",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem 1.5rem",
    },
  },
];
