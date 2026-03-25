import type { Product, PDVSale, RangeFilter } from "@/types";

export const mockProducts: Product[] = [
  { id: 1, name: "Vestido Floral Vintage", sku: "VFV-001", category: "Roupas", size: "M", condition: "Excelente", price: 89.9, status: "Disponível", image: "👗" },
  { id: 2, name: "Jaqueta Jeans Upcycled", sku: "JJU-002", category: "Roupas", size: "G", condition: "Bom", price: 159.0, status: "Disponível", image: "🧥" },
  { id: 3, name: "Bolsa de Couro Retrô", sku: "BCR-003", category: "Bolsas", size: "Único", condition: "Excelente", price: 210.0, status: "Reservado", image: "👜" },
  { id: 4, name: "Tênis Vintage Adidas", sku: "TVA-004", category: "Calçados", size: "40", condition: "Bom", price: 120.0, status: "Vendido", image: "👟" },
  { id: 5, name: "Colar Artesanal Boho", sku: "CAB-005", category: "Acessórios", size: "Único", condition: "Novo", price: 45.0, status: "Disponível", image: "📿" },
  { id: 6, name: "Camisa Hawaiana 90s", sku: "CH9-006", category: "Roupas", size: "GG", condition: "Bom", price: 65.0, status: "Disponível", image: "👔" },
  { id: 7, name: "Saia Midi Plissada", sku: "SMP-007", category: "Roupas", size: "P", condition: "Excelente", price: 78.0, status: "Disponível", image: "👗" },
  { id: 8, name: "Óculos Retrô Ray-Ban", sku: "ORR-008", category: "Acessórios", size: "Único", condition: "Excelente", price: 195.0, status: "Reservado", image: "🕶️" },
];

export const mockPDVSales: PDVSale[] = [
  { id: 1, time: "14:30", items: 2, total: "R$ 248,90", payment: "PIX", customer: "Cliente avulso" },
  { id: 2, time: "13:15", items: 1, total: "R$ 159,00", payment: "Cartão Crédito", customer: "Ana Paula" },
  { id: 3, time: "11:45", items: 3, total: "R$ 312,00", payment: "Dinheiro", customer: "Cliente avulso" },
  { id: 4, time: "10:20", items: 1, total: "R$ 89,90", payment: "Cartão Débito", customer: "Fernanda S." },
  { id: 5, time: "09:05", items: 2, total: "R$ 185,00", payment: "PIX", customer: "Juliana M." },
];

export const productCategories = ["Todos", "Roupas", "Acessórios", "Calçados", "Bolsas"];
export const productStatuses = ["Todos", "Disponível", "Reservado", "Vendido", "sacolinha"];

export const priceRanges: RangeFilter[] = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Até R$ 50", min: 0, max: 50 },
  { label: "R$ 50–100", min: 50, max: 100 },
  { label: "R$ 100–200", min: 100, max: 200 },
  { label: "Acima de R$ 200", min: 200, max: Infinity },
];
