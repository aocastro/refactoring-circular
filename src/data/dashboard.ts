import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Leaf,
  Droplets,
} from "lucide-react";
import type { KpiItem, MonthlyValue, CategoryValue, RecentSale, ABCValue, ABCProductValue } from "@/types";

export type DashboardPeriod = "hoje" | "mensal" | "trimestral" | "semestral" | "anual";

export const dashboardKpisByPeriod: Record<DashboardPeriod, KpiItem[]> = {
  hoje: [
    { label: "Receita de Hoje", value: "R$ 845,00", change: "+5%", icon: DollarSign, positive: true, period: "Hoje", target: "relatorios" },
    { label: "Vendas", value: "12", change: "+2", icon: ShoppingBag, positive: true, period: "Hoje", target: "venda-pedidos" },
    { label: "Ticket Médio", value: "R$ 70,41", change: "-1%", icon: TrendingUp, positive: false, period: "Hoje", target: "relatorios" },
    { label: "Consignantes Ativos", value: "2", change: "+1", icon: Users, positive: true, period: "Atual", target: "consignantes" },
    { label: "CO₂ Evitado", value: "12 kg", change: "+2%", icon: Leaf, positive: true, period: "Hoje", target: "relatorios" },
    { label: "Água Economizada", value: "7.800 L", change: "+3%", icon: Droplets, positive: true, period: "Hoje", target: "relatorios" },
  ],
  mensal: [
    { label: "Receita do Mês", value: "R$ 12.450", change: "+12%", icon: DollarSign, positive: true, period: "Mensal", target: "relatorios" },
    { label: "Vendas", value: "87", change: "+8%", icon: ShoppingBag, positive: true, period: "Mensal", target: "venda-pedidos" },
    { label: "Ticket Médio", value: "R$ 143", change: "+3%", icon: TrendingUp, positive: true, period: "Mensal", target: "relatorios" },
    { label: "Consignantes Ativos", value: "23", change: "+2", icon: Users, positive: true, period: "Atual", target: "consignantes" },
    { label: "CO₂ Evitado", value: "361 kg", change: "+15%", icon: Leaf, positive: true, period: "Mensal", target: "relatorios" },
    { label: "Água Economizada", value: "234.900 L", change: "+12%", icon: Droplets, positive: true, period: "Mensal", target: "relatorios" },
  ],
  trimestral: [
    { label: "Receita do Trimestre", value: "R$ 38.600", change: "+18%", icon: DollarSign, positive: true, period: "Trimestral", target: "relatorios" },
    { label: "Vendas", value: "245", change: "+15%", icon: ShoppingBag, positive: true, period: "Trimestral", target: "venda-pedidos" },
    { label: "Ticket Médio", value: "R$ 157,55", change: "+5%", icon: TrendingUp, positive: true, period: "Trimestral", target: "relatorios" },
    { label: "Consignantes Ativos", value: "48", change: "+10", icon: Users, positive: true, period: "Atual", target: "consignantes" },
    { label: "CO₂ Evitado", value: "1.083 kg", change: "+22%", icon: Leaf, positive: true, period: "Trimestral", target: "relatorios" },
    { label: "Água Economizada", value: "704.700 L", change: "+20%", icon: Droplets, positive: true, period: "Trimestral", target: "relatorios" },
  ],
  semestral: [
    { label: "Receita do Semestre", value: "R$ 75.200", change: "+25%", icon: DollarSign, positive: true, period: "Semestral", target: "relatorios" },
    { label: "Vendas", value: "482", change: "+20%", icon: ShoppingBag, positive: true, period: "Semestral", target: "venda-pedidos" },
    { label: "Ticket Médio", value: "R$ 156,01", change: "+4%", icon: TrendingUp, positive: true, period: "Semestral", target: "relatorios" },
    { label: "Consignantes Ativos", value: "72", change: "+15", icon: Users, positive: true, period: "Atual", target: "consignantes" },
    { label: "CO₂ Evitado", value: "2.166 kg", change: "+28%", icon: Leaf, positive: true, period: "Semestral", target: "relatorios" },
    { label: "Água Economizada", value: "1.409.400 L", change: "+25%", icon: Droplets, positive: true, period: "Semestral", target: "relatorios" },
  ],
  anual: [
    { label: "Receita Anual", value: "R$ 148.500", change: "+35%", icon: DollarSign, positive: true, period: "Anual", target: "relatorios" },
    { label: "Vendas", value: "945", change: "+30%", icon: ShoppingBag, positive: true, period: "Anual", target: "venda-pedidos" },
    { label: "Ticket Médio", value: "R$ 157,14", change: "+6%", icon: TrendingUp, positive: true, period: "Anual", target: "relatorios" },
    { label: "Consignantes Ativos", value: "115", change: "+25", icon: Users, positive: true, period: "Atual", target: "consignantes" },
    { label: "CO₂ Evitado", value: "4.332 kg", change: "+45%", icon: Leaf, positive: true, period: "Anual", target: "relatorios" },
    { label: "Água Economizada", value: "2.818.800 L", change: "+40%", icon: Droplets, positive: true, period: "Anual", target: "relatorios" },
  ],
};

export const revenueData: MonthlyValue[] = [
  { month: "Jul", value: 8200 },
  { month: "Ago", value: 9100 },
  { month: "Set", value: 7800 },
  { month: "Out", value: 10500 },
  { month: "Nov", value: 11200 },
  { month: "Dez", value: 12450 },
];

export const salesByCategory: CategoryValue[] = [
  { category: "Roupas", value: 42 },
  { category: "Acessórios", value: 18 },
  { category: "Calçados", value: 15 },
  { category: "Bolsas", value: 12 },
];

export const recentSales: RecentSale[] = [
  { id: 1, item: "Vestido Floral Vintage", price: "R$ 89,90", date: "Hoje, 14:30", status: "Pago" },
  { id: 2, item: "Jaqueta Jeans Upcycled", price: "R$ 159,00", date: "Hoje, 11:15", status: "Pago" },
  { id: 3, item: "Bolsa de Couro Retrô", price: "R$ 210,00", date: "Ontem, 18:45", status: "Pendente" },
  { id: 4, item: "Tênis Vintage Adidas", price: "R$ 120,00", date: "Ontem, 09:20", status: "Pago" },
  { id: 5, item: "Colar Artesanal Boho", price: "R$ 45,00", date: "22/12, 16:00", status: "Pago" },
];

export const abcData: ABCValue[] = [
  { subcategory: "Vestidos", value: 45, category: "A" },
  { subcategory: "Bolsas", value: 35, category: "A" },
  { subcategory: "Jaquetas", value: 12, category: "B" },
  { subcategory: "Sapatos", value: 5, category: "C" },
  { subcategory: "Acessórios", value: 3, category: "C" },
];

export const abcProductsData: ABCProductValue[] = [
  { product: "Vestido Floral Vintage", value: 25, revenue: 3112, category: "A" },
  { product: "Bolsa de Couro Retrô", value: 20, revenue: 2490, category: "A" },
  { product: "Jaqueta Jeans Upcycled", value: 15, revenue: 1867, category: "B" },
  { product: "Tênis Vintage Adidas", value: 10, revenue: 1245, category: "B" },
  { product: "Colar Artesanal Boho", value: 8, revenue: 996, category: "C" },
  { product: "Camisa de Seda 90s", value: 7, revenue: 871, category: "C" },
  { product: "Calça Levi's 501", value: 5, revenue: 622, category: "C" },
  { product: "Óculos de Sol Vintage", value: 4, revenue: 498, category: "C" },
  { product: "Cinto de Couro Western", value: 4, revenue: 498, category: "C" },
  { product: "Lenço Estampado", value: 2, revenue: 249, category: "C" },
];

export interface SubStockProduct {
  product: import("@/types").Product;
  quantity: number;
  position: string;
}

export interface SubStock {
  id: number;
  name: string;
  location: string;
  capacity: number;
  responsible: string;
  status: "Ativo" | "Inativo";
  products: SubStockProduct[];
}

import { mockProducts } from "@/data/products";

export const initialSubStocks: SubStock[] = [
  {
    id: 1, name: "Arara Principal", location: "Loja - Térreo", capacity: 60, responsible: "Maria", status: "Ativo",
    products: [
      { product: mockProducts[0], quantity: 3, position: "Seção A" },
      { product: mockProducts[1], quantity: 2, position: "Seção A" },
      { product: mockProducts[5], quantity: 5, position: "Seção B" },
      { product: mockProducts[6], quantity: 4, position: "Seção C" },
    ],
  },
  {
    id: 2, name: "Vitrine Frontal", location: "Loja - Entrada", capacity: 15, responsible: "Ana", status: "Ativo",
    products: [
      { product: mockProducts[2], quantity: 1, position: "Manequim 1" },
      { product: mockProducts[3], quantity: 1, position: "Manequim 2" },
    ],
  },
  {
    id: 3, name: "Estoque Reserva", location: "Depósito - Subsolo", capacity: 200, responsible: "Carlos", status: "Ativo",
    products: [
      { product: mockProducts[4], quantity: 15, position: "Prateleira A1" },
      { product: mockProducts[7], quantity: 12, position: "Prateleira A2" },
      { product: mockProducts[8], quantity: 8, position: "Prateleira B1" },
      { product: mockProducts[9], quantity: 10, position: "Prateleira B2" },
      { product: mockProducts[10], quantity: 5, position: "Prateleira C1" },
      { product: mockProducts[11], quantity: 7, position: "Prateleira C2" },
      { product: mockProducts[12], quantity: 6, position: "Prateleira D1" },
      { product: mockProducts[13], quantity: 10, position: "Prateleira D2" },
    ],
  },
  {
    id: 4, name: "Arara Promoções", location: "Loja - Fundo", capacity: 40, responsible: "Juliana", status: "Ativo",
    products: [
      { product: mockProducts[14], quantity: 5, position: "Cesto 1" },
      { product: mockProducts[15], quantity: 5, position: "Cesto 2" },
    ],
  },
  {
    id: 5, name: "Pop-up Store Centro", location: "Externo - Shopping", capacity: 25, responsible: "Pedro", status: "Inativo",
    products: [],
  },
];
