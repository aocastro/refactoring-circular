import type { Product } from "@/types";

export interface StoreInfo {
  slug: string;
  name: string;
  description: string;
  logo: string;
  banners: string[];
  categories: string[];
}

export const mockStore: StoreInfo = {
  slug: "fashion-store",
  name: "Fashion Store",
  description: "Moda circular com peças únicas e sustentáveis",
  logo: "👗",
  banners: [
    "https://democircular.u-shar.com.br/api/uploads/1770665292462.webp",
    "https://democircular.u-shar.com.br/api/uploads/1770665292252.webp",
    "https://democircular.u-shar.com.br/api/uploads/1770665293362.webp",
  ],
  categories: ["Roupas", "Calçados", "Acessórios", "Bolsas"],
};

export const storeProducts: (Product & { highlight?: boolean; discount?: number; originalPrice?: number })[] = [
  { id: 101, name: "Saia Longa Colorida", sku: "SLC-101", category: "Roupas", size: "M", condition: "Excelente", price: 180, status: "Disponível", image: "👗", highlight: true },
  { id: 102, name: "Saia Longa Estampada", sku: "SLE-102", category: "Roupas", size: "P", condition: "Excelente", price: 150, status: "Disponível", image: "👗" },
  { id: 103, name: "Camisa Polo Masculina Mr. Kitsu", sku: "CPM-103", category: "Roupas", size: "G", condition: "Bom", price: 100, status: "Disponível", image: "👔" },
  { id: 104, name: "Tênis Adidas Gazelle Branco e Azul", sku: "TAG-104", category: "Calçados", size: "42", condition: "Excelente", price: 320, status: "Disponível", image: "👟", discount: 9, originalPrice: 350 },
  { id: 105, name: "Casaco de Pele Sintética Marrom", sku: "CPS-105", category: "Roupas", size: "G", condition: "Excelente", price: 500, status: "Disponível", image: "🧥", highlight: true },
  { id: 106, name: "Casaco de Lã com Detalhes de Pelagem", sku: "CLP-106", category: "Roupas", size: "G", condition: "Excelente", price: 500, status: "Disponível", image: "🧥" },
  { id: 107, name: "Boné Ferrari e Puma", sku: "BFP-107", category: "Acessórios", size: "Único", condition: "Novo", price: 150, status: "Disponível", image: "🧢" },
  { id: 108, name: "Vestido Curto Casual", sku: "VCC-108", category: "Roupas", size: "M", condition: "Bom", price: 5, status: "Disponível", image: "👗" },
  { id: 109, name: "Camiseta Básica Preta", sku: "CBP-109", category: "Roupas", size: "M", condition: "Bom", price: 50, status: "Disponível", image: "👕" },
  { id: 110, name: "Tênis Patrick Ewing 33 HI", sku: "TPE-110", category: "Calçados", size: "43", condition: "Excelente", price: 609, status: "Disponível", image: "👟", highlight: true },
  { id: 111, name: "Casaco de Pelo Verde", sku: "CPV-111", category: "Roupas", size: "M", condition: "Excelente", price: 299, status: "Disponível", image: "🧥", highlight: true },
  { id: 112, name: "Boné New Era 59FIFTY", sku: "BNE-112", category: "Acessórios", size: "Único", condition: "Excelente", price: 150, status: "Disponível", image: "🧢" },
  { id: 113, name: "Saia Jeans Estilo Militar", sku: "SJM-113", category: "Roupas", size: "P", condition: "Bom", price: 120, status: "Disponível", image: "👗", highlight: true },
  { id: 114, name: "Camiseta Rogéria", sku: "CR-114", category: "Roupas", size: "M", condition: "Bom", price: 100, status: "Disponível", image: "👕" },
  { id: 115, name: "Bermuda Jeans Estonada com Bordado", sku: "BJE-115", category: "Roupas", size: "G", condition: "Bom", price: 150, status: "Disponível", image: "👖" },
  { id: 116, name: "Sapatilha x", sku: "SX-116", category: "Calçados", size: "37", condition: "Bom", price: 100, status: "Disponível", image: "👠", discount: 17, originalPrice: 120 },
  { id: 117, name: "Vestido Colorido de Verão", sku: "VCV-117", category: "Roupas", size: "M", condition: "Excelente", price: 80, status: "Disponível", image: "👗", highlight: true },
  { id: 118, name: "Gorro de Lã com Pom Pom", sku: "GLP-118", category: "Acessórios", size: "Único", condition: "Novo", price: 50, status: "Disponível", image: "🧶" },
  { id: 119, name: "Top Cropped Preto com Detalhes em Strass", sku: "TCP-119", category: "Roupas", size: "P", condition: "Excelente", price: 100, status: "Disponível", image: "👚" },
  { id: 120, name: "Calça Casual Verde Oliva", sku: "CCV-120", category: "Roupas", size: "G", condition: "Bom", price: 99.9, status: "Disponível", image: "👖", highlight: true },
  { id: 121, name: "Tênis Contrast John John Masculino", sku: "TCJ-121", category: "Calçados", size: "42", condition: "Excelente", price: 149.9, status: "Disponível", image: "👟", discount: 12, originalPrice: 169.9, highlight: true },
];
