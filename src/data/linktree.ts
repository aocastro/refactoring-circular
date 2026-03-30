export interface LinkItem {
  id: number;
  titulo: string;
  url: string;
  cliques: number;
  ativo: boolean;
}

export interface LinktreeConfig {
  id: number;
  slug: string;
  links: LinkItem[];
  profileImage: string;
  backgroundImage: string;
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

export const initialLinktrees: LinktreeConfig[] = [
  {
    id: 1,
    slug: "fashion-store",
    links: [
      { id: 1, titulo: "Loja Online", url: "https://fashionstore.com", cliques: 1240, ativo: true },
      { id: 2, titulo: "Instagram", url: "https://instagram.com/fashionstore", cliques: 890, ativo: true },
      { id: 3, titulo: "WhatsApp", url: "https://wa.me/5511999999999", cliques: 567, ativo: true },
      { id: 4, titulo: "Blog", url: "https://fashionstore.com/blog", cliques: 234, ativo: true },
      { id: 5, titulo: "Promoções", url: "https://fashionstore.com/promos", cliques: 456, ativo: false },
    ],
    profileImage: "",
    backgroundImage: "",
    backgroundColor: "#f3f4f6",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
  }
];
