import type { LucideIcon } from "lucide-react";

// ─── KPI ─────────────────────────────────────────
export interface KpiItem {
  label: string;
  value: string | number;
  change?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Allow string names from mock API
  positive?: boolean;
  period?: string;
  target?: string;
}

// ─── Products ────────────────────────────────────
export type ProductStatus = "Disponível" | "Reservado" | "Vendido" | "sacolinha";
export type ProductCondition = "Novo" | "Excelente" | "Bom" | "Regular";

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  size: string;
  condition: ProductCondition;
  price: number;
  status: ProductStatus;
  image: string;
  stock?: number;
  supplier?: string;
  brand?: string;
  createdAt?: string;
}

// ─── PDV Sales ───────────────────────────────────
export interface PDVSale {
  id: number;
  time: string;
  items: number;
  total: string;
  payment: string;
  customer: string;
}

// ─── Sacolinhas ──────────────────────────────────
export type BagStatus = "Montando" | "Pronta p/ Retirada" | "Com o Cliente" | "Devolvida" | "Vendida Parcial" | "Vendida Total" | "Cancelada" | string;

export interface BagItem {
  product: Product;
  quantity: number;
  returned?: boolean;
  sold?: boolean;
}

export interface Bag {
  id: number;
  code: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  items: BagItem[];
  total: number;
  status: BagStatus;
  createdAt: string;
  trialDays: number;
  returnDate: string;
  notes: string;
  logistics?: 'Retirada' | 'Entrega';
}

// ─── Dashboard Sales ─────────────────────────────
export interface RecentSale {
  id: number;
  item: string;
  price: string;
  date: string;
  status: "Pago" | "Pendente";
}

// ─── Revenue / Charts ────────────────────────────
export interface MonthlyValue {
  month: string;
  value: number;
}

export interface CategoryValue {
  category: string;
  value: number;
}

export interface ABCValue {
  subcategory: string;
  value: number;
  category: "A" | "B" | "C";
}

export interface ABCProductValue {
  product: string;
  value: number;
  revenue: number;
  category: "A" | "B" | "C";
}

// ─── Consignação ─────────────────────────────────
export type ConsignanteStatus = "Ativo" | "Pago";

export interface Consignante {
  id: number;
  name: string;
  items: number;
  sold: number;
  pending: string;
  pendingValue: number;
  status: ConsignanteStatus;
  since: string;
}

export type ContractStatus = "Vigente" | "Encerrado";

export interface Contract {
  id: number;
  consignante: string;
  items: number;
  date: string;
  split: string;
  status: ContractStatus;
}

// ─── Financeiro ──────────────────────────────────
export interface CashFlowEntry {
  month: string;
  entrada: number;
  saida: number;
}

export interface PaymentMethod {
  name: string;
  value: number;
  color: string;
}

export type PaymentType = "entrada" | "saida";

export interface RecentPayment {
  id: number;
  desc: string;
  value: string;
  type: PaymentType;
  method: string;
  date: string;
}

export interface ESGMonthly {
  month: string;
  co2: number;
  agua: number;
  pecas: number;
}

// ─── Notifications ───────────────────────────────
export type NotificationType = "sale" | "payment" | "goal";

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

// ─── Filters ─────────────────────────────────────
export interface RangeFilter {
  label: string;
  min: number;
  max: number;
}

// ─── Table Column ────────────────────────────────
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  hideOn?: "sm" | "md" | "lg";
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
}
