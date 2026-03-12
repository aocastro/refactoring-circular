import type { Consignante, Contract, RangeFilter } from "@/types";

export const mockConsignantes: Consignante[] = [
  { id: 1, name: "Ana Paula Ferreira", items: 12, sold: 8, pending: "R$ 340,00", pendingValue: 340, status: "Ativo", since: "Mar/2025" },
  { id: 2, name: "Carlos Eduardo Silva", items: 25, sold: 18, pending: "R$ 890,00", pendingValue: 890, status: "Ativo", since: "Jan/2025" },
  { id: 3, name: "Fernanda Oliveira", items: 7, sold: 3, pending: "R$ 120,00", pendingValue: 120, status: "Ativo", since: "Jun/2025" },
  { id: 4, name: "Juliana Mendonça", items: 15, sold: 15, pending: "R$ 0,00", pendingValue: 0, status: "Pago", since: "Fev/2025" },
  { id: 5, name: "Roberto Santos", items: 30, sold: 22, pending: "R$ 1.250,00", pendingValue: 1250, status: "Ativo", since: "Nov/2024" },
  { id: 6, name: "Mariana Costa", items: 9, sold: 5, pending: "R$ 210,00", pendingValue: 210, status: "Ativo", since: "Ago/2025" },
];

export const mockContracts: Contract[] = [
  { id: 1, consignante: "Ana Paula Ferreira", items: 5, date: "15/12/2025", split: "60/40", status: "Vigente" },
  { id: 2, consignante: "Carlos Eduardo Silva", items: 10, date: "02/12/2025", split: "50/50", status: "Vigente" },
  { id: 3, consignante: "Roberto Santos", items: 8, date: "28/11/2025", split: "55/45", status: "Vigente" },
  { id: 4, consignante: "Fernanda Oliveira", items: 7, date: "10/12/2025", split: "60/40", status: "Vigente" },
  { id: 5, consignante: "Juliana Mendonça", items: 15, date: "01/11/2025", split: "50/50", status: "Encerrado" },
];

export const consignanteStatusOptions = ["Todos", "Ativo", "Pago"];

export const pendingRanges: RangeFilter[] = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Sem pendência", min: 0, max: 0 },
  { label: "Até R$ 200", min: 0.01, max: 200 },
  { label: "R$ 200–500", min: 200, max: 500 },
  { label: "Acima de R$ 500", min: 500, max: Infinity },
];
