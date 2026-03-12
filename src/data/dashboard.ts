import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Leaf,
  Droplets,
} from "lucide-react";
import type { KpiItem, MonthlyValue, CategoryValue, RecentSale } from "@/types";

export const dashboardKpis: KpiItem[] = [
  { label: "Receita do Mês", value: "R$ 12.450", change: "+12%", icon: DollarSign, positive: true },
  { label: "Vendas", value: "87", change: "+8%", icon: ShoppingBag, positive: true },
  { label: "Ticket Médio", value: "R$ 143", change: "+3%", icon: TrendingUp, positive: true },
  { label: "Consignantes Ativos", value: "23", change: "+2", icon: Users, positive: true },
  { label: "CO₂ Evitado", value: "361 kg", change: "+15%", icon: Leaf, positive: true },
  { label: "Água Economizada", value: "234.900 L", change: "+12%", icon: Droplets, positive: true },
];

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
