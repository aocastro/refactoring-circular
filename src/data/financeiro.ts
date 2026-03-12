import type { CashFlowEntry, PaymentMethod, RecentPayment, ESGMonthly } from "@/types";

export const cashFlowData: CashFlowEntry[] = [
  { month: "Jul", entrada: 8200, saida: 4100 },
  { month: "Ago", entrada: 9100, saida: 4800 },
  { month: "Set", entrada: 7800, saida: 3900 },
  { month: "Out", entrada: 10500, saida: 5200 },
  { month: "Nov", entrada: 11200, saida: 5800 },
  { month: "Dez", entrada: 12450, saida: 6100 },
];

export const paymentMethods: PaymentMethod[] = [
  { name: "PIX", value: 42, color: "hsl(180, 100%, 50%)" },
  { name: "Cartão Crédito", value: 28, color: "hsl(270, 80%, 60%)" },
  { name: "Cartão Débito", value: 18, color: "hsl(150, 80%, 45%)" },
  { name: "Dinheiro", value: 12, color: "hsl(0, 0%, 55%)" },
];

export const recentPayments: RecentPayment[] = [
  { id: 1, desc: "Venda #1247 — Vestido Floral", value: "R$ 89,90", type: "entrada", method: "PIX", date: "Hoje, 14:30" },
  { id: 2, desc: "Pagamento Consignante — Ana Paula", value: "R$ 340,00", type: "saida", method: "Transferência", date: "Hoje, 10:00" },
  { id: 3, desc: "Venda #1246 — Jaqueta Jeans", value: "R$ 159,00", type: "entrada", method: "Cartão Crédito", date: "Ontem, 18:45" },
  { id: 4, desc: "Fornecedor — Cabides Eco", value: "R$ 85,00", type: "saida", method: "PIX", date: "Ontem, 15:30" },
  { id: 5, desc: "Venda #1245 — Bolsa Retrô", value: "R$ 210,00", type: "entrada", method: "Cartão Débito", date: "22/12, 16:00" },
  { id: 6, desc: "Aluguel Loja", value: "R$ 2.800,00", type: "saida", method: "Boleto", date: "20/12, 09:00" },
  { id: 7, desc: "Venda #1244 — Tênis Vintage", value: "R$ 120,00", type: "entrada", method: "Dinheiro", date: "20/12, 14:20" },
];

export const esgMonthly: ESGMonthly[] = [
  { month: "Jul", co2: 48, agua: 31200, pecas: 65 },
  { month: "Ago", co2: 55, agua: 35800, pecas: 72 },
  { month: "Set", co2: 42, agua: 28900, pecas: 58 },
  { month: "Out", co2: 68, agua: 42100, pecas: 89 },
  { month: "Nov", co2: 72, agua: 46200, pecas: 94 },
  { month: "Dez", co2: 76, agua: 50700, pecas: 102 },
];
