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

// ─── Churn & LTV ────────────────────────────────
export const adminChurnHistory = [
  { month: "Jul", churn: 4.8, newStores: 18, cancelled: 9 },
  { month: "Ago", churn: 4.2, newStores: 22, cancelled: 8 },
  { month: "Set", churn: 3.9, newStores: 20, cancelled: 7 },
  { month: "Out", churn: 3.6, newStores: 25, cancelled: 8 },
  { month: "Nov", churn: 3.5, newStores: 19, cancelled: 6 },
  { month: "Dez", churn: 3.2, newStores: 14, cancelled: 5 },
];

export const adminLtvByPlan = [
  { plan: "Starter", ltv: 588, avgMonths: 12, color: "hsl(var(--chart-1))" },
  { plan: "Essential", ltv: 1584, avgMonths: 16, color: "hsl(var(--chart-2))" },
  { plan: "Growth", ltv: 4776, avgMonths: 24, color: "hsl(var(--chart-3))" },
  { plan: "Scale", ltv: 11172, avgMonths: 28, color: "hsl(var(--chart-4))" },
  { plan: "Executive", ltv: 27972, avgMonths: 35, color: "hsl(var(--chart-5))" },
];

// ─── Planos ─────────────────────────────────────
export interface AdminPlan {
  id: number;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  subscribers: number;
  features: string[];
  permissions: string[];
  status: "ativo" | "inativo";
}

export const adminPlans: AdminPlan[] = [
  { id: 1, name: "Starter", priceMonthly: 49, priceYearly: 470, subscribers: 82, features: ["1 loja", "100 produtos", "Suporte email"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios"] },
  { id: 2, name: "Essential", priceMonthly: 99, priceYearly: 950, subscribers: 94, features: ["3 lojas", "500 produtos", "Suporte chat", "PDV"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios", "pdv", "relatorios", "cupons"] },
  { id: 3, name: "Growth", priceMonthly: 199, priceYearly: 1910, subscribers: 48, features: ["10 lojas", "Ilimitado", "Suporte prioritário", "PDV", "Blog"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios", "pdv", "relatorios", "cupons", "blog", "inventario", "financeiro", "servicos"] },
  { id: 4, name: "Scale", priceMonthly: 399, priceYearly: 3830, subscribers: 18, features: ["Ilimitado", "API", "Suporte 24/7", "White-label"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios", "pdv", "relatorios", "cupons", "blog", "inventario", "financeiro", "servicos", "consignantes", "fornecedores", "newsletter", "meu-linktree", "lojas"] },
  { id: 5, name: "Executive", priceMonthly: 799, priceYearly: 7670, subscribers: 5, features: ["Tudo do Scale", "Gerente dedicado", "SLA 99.9%"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios", "pdv", "relatorios", "cupons", "blog", "inventario", "financeiro", "servicos", "consignantes", "fornecedores", "newsletter", "meu-linktree", "lojas"] },
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
  trialEnd?: string;
  storeUrl?: string;
  integrations?: string[];
  clients?: number;
}

export const adminStores: AdminStore[] = [
  { id: 1, name: "Fashion Store", owner: "Maria Silva", email: "maria@email.com", plan: "Growth", status: "ativa", createdAt: "2024-08-15", revenue: 12450, products: 89, storeUrl: "https://fashionstore.ushar.com", integrations: ["PagBank", "Instagram"], clients: 1200 },
  { id: 2, name: "Vintage Corner", owner: "João Santos", email: "joao@email.com", plan: "Essential", status: "ativa", createdAt: "2024-09-02", revenue: 8900, products: 45, storeUrl: "https://vintagecorner.ushar.com", integrations: ["PagBank", "Melhor Envio"], clients: 450 },
  { id: 3, name: "Eco Brechó", owner: "Ana Paula", email: "ana@email.com", plan: "Starter", status: "ativa", createdAt: "2024-10-10", revenue: 3200, products: 32, storeUrl: "https://ecobrecho.ushar.com", integrations: [], clients: 85 },
  { id: 4, name: "Reuse & Style", owner: "Carlos Lima", email: "carlos@email.com", plan: "Scale", status: "ativa", createdAt: "2024-07-20", revenue: 28700, products: 234, storeUrl: "https://reusestyle.ushar.com", integrations: ["PagBank", "Melhor Envio", "Instagram"], clients: 3400 },
  { id: 5, name: "Second Hand SP", owner: "Fernanda Alves", email: "fer@email.com", plan: "Growth", status: "suspensa", createdAt: "2024-11-05", revenue: 1500, products: 18, storeUrl: "https://secondhandsp.ushar.com", integrations: ["PagBank"], clients: 120 },
  { id: 6, name: "Circular Shop", owner: "Pedro Costa", email: "pedro@email.com", plan: "Essential", status: "pendente", createdAt: "2025-01-12", revenue: 0, products: 5, trialEnd: "2025-01-26", storeUrl: "https://circularshop.ushar.com", integrations: [], clients: 0 },
  { id: 7, name: "GreenWear", owner: "Lucia Mendes", email: "lucia@email.com", plan: "Starter", status: "ativa", createdAt: "2024-12-01", revenue: 4100, products: 67, storeUrl: "https://greenwear.ushar.com", integrations: ["Melhor Envio"], clients: 210 },
  { id: 8, name: "Brechó da Vila", owner: "Roberto Dias", email: "rob@email.com", plan: "Growth", status: "ativa", createdAt: "2024-06-18", revenue: 15800, products: 156, storeUrl: "https://brechodavila.ushar.com", integrations: ["PagBank", "Instagram"], clients: 890 },
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

// ─── NPS ────────────────────────────────────────

export interface NPSResponse {
  id: number;
  score: number;
  comment: string;
  user: string;
  store: string;
  date: string;
  status: "novo" | "analisado" | "contatado";
}

export const adminNpsStats = {
  score: 68,
  totalResponses: 124,
  promoters: 75, // 60%
  passives: 35, // 28%
  detractors: 14, // 11%
};

export const adminNpsHistory = [
  { month: "Jul", score: 55 },
  { month: "Ago", score: 58 },
  { month: "Set", score: 62 },
  { month: "Out", score: 65 },
  { month: "Nov", score: 67 },
  { month: "Dez", score: 68 },
];

export const adminNpsResponses: NPSResponse[] = [
  { id: 1, score: 10, comment: "Plataforma excelente, o PDV e o SmartLock mudaram meu negócio.", user: "Carlos Lima", store: "Reuse & Style", date: "Hoje, 10:30", status: "novo" },
  { id: 2, score: 9, comment: "Muito boa, só queria mais relatórios na versão Essential.", user: "João Santos", store: "Vintage Corner", date: "Ontem, 15:20", status: "novo" },
  { id: 3, score: 6, comment: "Funciona, mas às vezes o sistema fica lento na hora do checkout.", user: "Maria Silva", store: "Fashion Store", date: "Ontem, 11:45", status: "analisado" },
  { id: 4, score: 3, comment: "Faltam integrações e o suporte demora a responder.", user: "Fernanda Alves", store: "Second Hand SP", date: "22/12, 09:15", status: "contatado" },
  { id: 5, score: 10, comment: "Gosto muito do relatório de ESG, me ajuda a vender mais.", user: "Ana Paula", store: "Eco Brechó", date: "21/12, 14:00", status: "analisado" },
  { id: 6, score: 8, comment: "Atende bem, mas tem curva de aprendizado.", user: "Roberto Dias", store: "Brechó da Vila", date: "20/12, 16:30", status: "analisado" },
];
