// ─── Admin Dashboard KPIs ───────────────────────
export const adminKpis = {
  totalLojas: 247,
  lojasAtivas: 218,
  totalUsuarios: 1842,
  mrrAtual: 48750,
  mrrAnterior: 44200,
  churnRate: 3.2,
  ticketMedio: 197.5,
  novasLojasMes: 14,
};

export const adminMrrHistory = [
  { month: "Jul", value: 32400 },
  { month: "Ago", value: 35100 },
  { month: "Set", value: 38200 },
  { month: "Out", value: 41800 },
  { month: "Nov", value: 44200 },
  { month: "Dez", value: 48750 },
];

// ─── Planos ─────────────────────────────────────
export interface AdminPlan {
  id: number;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  subscribers: number;
  features: string[];
  status: "ativo" | "inativo";
}

export const adminPlans: AdminPlan[] = [
  { id: 1, name: "Starter", priceMonthly: 49, priceYearly: 470, subscribers: 82, features: ["1 loja", "100 produtos", "Suporte email"], status: "ativo" },
  { id: 2, name: "Essential", priceMonthly: 99, priceYearly: 950, subscribers: 94, features: ["3 lojas", "500 produtos", "Suporte chat", "PDV"], status: "ativo" },
  { id: 3, name: "Growth", priceMonthly: 199, priceYearly: 1910, subscribers: 48, features: ["10 lojas", "Ilimitado", "Suporte prioritário", "PDV", "Blog"], status: "ativo" },
  { id: 4, name: "Scale", priceMonthly: 399, priceYearly: 3830, subscribers: 18, features: ["Ilimitado", "API", "Suporte 24/7", "White-label"], status: "ativo" },
  { id: 5, name: "Executive", priceMonthly: 799, priceYearly: 7670, subscribers: 5, features: ["Tudo do Scale", "Gerente dedicado", "SLA 99.9%"], status: "ativo" },
];

// ─── Lojas ──────────────────────────────────────
export interface AdminStore {
  id: number;
  name: string;
  owner: string;
  email: string;
  plan: string;
  status: "ativa" | "suspensa" | "pendente";
  createdAt: string;
  revenue: number;
  products: number;
}

export const adminStores: AdminStore[] = [
  { id: 1, name: "Fashion Store", owner: "Maria Silva", email: "maria@email.com", plan: "Growth", status: "ativa", createdAt: "2024-08-15", revenue: 12450, products: 89 },
  { id: 2, name: "Vintage Corner", owner: "João Santos", email: "joao@email.com", plan: "Essential", status: "ativa", createdAt: "2024-09-02", revenue: 8900, products: 45 },
  { id: 3, name: "Eco Brechó", owner: "Ana Paula", email: "ana@email.com", plan: "Starter", status: "ativa", createdAt: "2024-10-10", revenue: 3200, products: 32 },
  { id: 4, name: "Reuse & Style", owner: "Carlos Lima", email: "carlos@email.com", plan: "Scale", status: "ativa", createdAt: "2024-07-20", revenue: 28700, products: 234 },
  { id: 5, name: "Second Hand SP", owner: "Fernanda Alves", email: "fer@email.com", plan: "Growth", status: "suspensa", createdAt: "2024-11-05", revenue: 1500, products: 18 },
  { id: 6, name: "Circular Shop", owner: "Pedro Costa", email: "pedro@email.com", plan: "Essential", status: "pendente", createdAt: "2025-01-12", revenue: 0, products: 5 },
  { id: 7, name: "GreenWear", owner: "Lucia Mendes", email: "lucia@email.com", plan: "Starter", status: "ativa", createdAt: "2024-12-01", revenue: 4100, products: 67 },
  { id: 8, name: "Brechó da Vila", owner: "Roberto Dias", email: "rob@email.com", plan: "Growth", status: "ativa", createdAt: "2024-06-18", revenue: 15800, products: 156 },
];

// ─── Usuários ───────────────────────────────────
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "lojista" | "consignante";
  status: "ativo" | "inativo" | "bloqueado";
  lastLogin: string;
  stores: number;
}

export const adminUsers: AdminUser[] = [
  { id: 1, name: "Maria Silva", email: "maria@email.com", role: "lojista", status: "ativo", lastLogin: "Hoje, 14:30", stores: 2 },
  { id: 2, name: "João Santos", email: "joao@email.com", role: "lojista", status: "ativo", lastLogin: "Hoje, 10:00", stores: 1 },
  { id: 3, name: "Ana Paula", email: "ana@email.com", role: "consignante", status: "ativo", lastLogin: "Ontem, 18:00", stores: 0 },
  { id: 4, name: "Carlos Lima", email: "carlos@email.com", role: "lojista", status: "ativo", lastLogin: "Hoje, 09:15", stores: 3 },
  { id: 5, name: "Admin Master", email: "admin@ushar.com", role: "admin", status: "ativo", lastLogin: "Agora", stores: 0 },
  { id: 6, name: "Fernanda Alves", email: "fer@email.com", role: "lojista", status: "bloqueado", lastLogin: "15/12/2024", stores: 1 },
  { id: 7, name: "Pedro Costa", email: "pedro@email.com", role: "lojista", status: "inativo", lastLogin: "01/01/2025", stores: 1 },
];

// ─── Financeiro da Plataforma ───────────────────
export const adminFinancial = {
  revenueTotal: 292500,
  revenueMes: 48750,
  comissoesPendentes: 12400,
  taxaConversao: 4.8,
};

export const adminRevenueByPlan = [
  { plan: "Starter", value: 4018, color: "hsl(var(--chart-1))" },
  { plan: "Essential", value: 9306, color: "hsl(var(--chart-2))" },
  { plan: "Growth", value: 9552, color: "hsl(var(--chart-3))" },
  { plan: "Scale", value: 7182, color: "hsl(var(--chart-4))" },
  { plan: "Executive", value: 3995, color: "hsl(var(--chart-5))" },
];

export const adminMonthlyRevenue = [
  { month: "Jul", receita: 32400, custos: 12800 },
  { month: "Ago", receita: 35100, custos: 13200 },
  { month: "Set", receita: 38200, custos: 13800 },
  { month: "Out", receita: 41800, custos: 14500 },
  { month: "Nov", receita: 44200, custos: 15100 },
  { month: "Dez", receita: 48750, custos: 15800 },
];

// ─── ESG / Impacto Ambiental ────────────────────
export const adminEsg = {
  co2Evitado: 1240,
  aguaEconomizada: 890000,
  pecasCirculadas: 15420,
  lojasESG: 142,
};

export const adminEsgMonthly = [
  { month: "Jul", co2: 148, agua: 112000, pecas: 1850 },
  { month: "Ago", co2: 165, agua: 128000, pecas: 2100 },
  { month: "Set", co2: 178, agua: 135000, pecas: 2340 },
  { month: "Out", co2: 205, agua: 152000, pecas: 2780 },
  { month: "Nov", co2: 228, agua: 168000, pecas: 3020 },
  { month: "Dez", co2: 248, agua: 185000, pecas: 3330 },
];

// ─── Blockchain ─────────────────────────────────
export interface BlockchainTransaction {
  id: string;
  type: "mint" | "transfer" | "verify";
  description: string;
  hash: string;
  timestamp: string;
  status: "confirmado" | "pendente" | "falhou";
  store: string;
}

export const blockchainStats = {
  totalTokens: 4820,
  transacoesMes: 342,
  certificadosEmitidos: 1890,
  lojasBlockchain: 86,
};

export const blockchainTransactions: BlockchainTransaction[] = [
  { id: "TX-001", type: "mint", description: "Certificado de autenticidade — Bolsa Vintage", hash: "0x1a2b3c...f4e5d6", timestamp: "Hoje, 14:30", status: "confirmado", store: "Fashion Store" },
  { id: "TX-002", type: "verify", description: "Verificação de origem — Jaqueta Jeans", hash: "0x7g8h9i...k0l1m2", timestamp: "Hoje, 11:00", status: "confirmado", store: "Vintage Corner" },
  { id: "TX-003", type: "transfer", description: "Transferência de propriedade — Tênis Retrô", hash: "0x3n4o5p...q6r7s8", timestamp: "Ontem, 16:45", status: "pendente", store: "Eco Brechó" },
  { id: "TX-004", type: "mint", description: "NFT de rastreabilidade — Coleção Eco", hash: "0x9t0u1v...w2x3y4", timestamp: "Ontem, 10:20", status: "confirmado", store: "Reuse & Style" },
  { id: "TX-005", type: "verify", description: "Selo de sustentabilidade — Lote #45", hash: "0x5z6a7b...c8d9e0", timestamp: "22/12, 14:00", status: "falhou", store: "GreenWear" },
];
