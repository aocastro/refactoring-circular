export type TicketStatus = "aberto" | "em_andamento" | "resolvido";
export type TicketPriority = "baixa" | "média" | "alta" | "urgente";
export type TicketCategory = "Dúvida" | "Problema Técnico" | "Financeiro" | "Sugestão" | "Outros";

export interface TicketMessage {
  from: string;
  role: "lojista" | "admin";
  text: string;
  time: string;
}

export interface Ticket {
  id: number;
  subject: string;
  category: TicketCategory;
  store: string;
  owner: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  lastUpdate: string;
  messages: TicketMessage[];
}

export const mockTickets: Ticket[] = [
  {
    id: 1001,
    subject: "Problema com integração de pagamento",
    category: "Problema Técnico",
    store: "Fashion Store",
    owner: "Maria Silva",
    status: "aberto",
    priority: "alta",
    createdAt: "Hoje, 13:40",
    lastUpdate: "Hoje, 13:40",
    messages: [
      { from: "Maria Silva", role: "lojista", text: "Ao tentar processar pagamentos via PIX, o sistema retorna erro 500. Já tentei limpar cache.", time: "13:40" },
    ],
  },
  {
    id: 1002,
    subject: "Solicitação de upgrade de plano",
    category: "Financeiro",
    store: "Vintage Corner",
    owner: "João Santos",
    status: "em_andamento",
    priority: "média",
    createdAt: "Ontem, 10:00",
    lastUpdate: "Hoje, 09:15",
    messages: [
      { from: "João Santos", role: "lojista", text: "Gostaria de migrar do Essential para o Growth. Como funciona a cobrança proporcional?", time: "10:00" },
      { from: "Admin Master", role: "admin", text: "Olá João! A migração é proporcional ao período restante. Vou calcular o valor e enviar a proposta.", time: "09:15" },
    ],
  },
  {
    id: 1003,
    subject: "Relatório ESG não carrega",
    category: "Problema Técnico",
    store: "Eco Brechó",
    owner: "Ana Paula",
    status: "resolvido",
    priority: "baixa",
    createdAt: "22/12, 08:30",
    lastUpdate: "22/12, 14:00",
    messages: [
      { from: "Ana Paula", role: "lojista", text: "A página de relatórios ESG fica em loading infinito.", time: "08:30" },
      { from: "Admin Master", role: "admin", text: "Identificamos o problema. Era um timeout no cálculo de CO₂. Já foi corrigido.", time: "14:00" },
    ],
  },
  {
    id: 1004,
    subject: "Dúvida sobre funcionalidade SmartLock",
    category: "Dúvida",
    store: "Reuse & Style",
    owner: "Carlos Lima",
    status: "aberto",
    priority: "média",
    createdAt: "Hoje, 11:20",
    lastUpdate: "Hoje, 11:20",
    messages: [
      { from: "Carlos Lima", role: "lojista", text: "Como configurar o SmartLock para reservas automáticas com prazo de 48h?", time: "11:20" },
    ],
  },
  {
    id: 1005,
    subject: "Erro ao importar produtos em massa",
    category: "Problema Técnico",
    store: "Brechó da Vila",
    owner: "Roberto Dias",
    status: "em_andamento",
    priority: "urgente",
    createdAt: "Ontem, 16:00",
    lastUpdate: "Hoje, 08:30",
    messages: [
      { from: "Roberto Dias", role: "lojista", text: "Upload de CSV com 500 produtos falha na linha 234. Erro de formato.", time: "16:00" },
      { from: "Admin Master", role: "admin", text: "Roberto, verificamos que o campo 'preço' na linha 234 tem vírgula ao invés de ponto. Pode corrigir e tentar novamente?", time: "08:30" },
    ],
  },
];

export const adminSuporteKpis = {
  totalTickets: 1245,
  resolvidosHoje: 18,
  tempoMedioResposta: "45 min",
  satisfacao: "98%",
  novosHoje: 12,
  emAndamento: 45,
};

export const adminTicketsVolume = [
  { day: "Seg", tickets: 45 },
  { day: "Ter", tickets: 52 },
  { day: "Qua", tickets: 38 },
  { day: "Qui", tickets: 65 },
  { day: "Sex", tickets: 48 },
  { day: "Sáb", tickets: 25 },
  { day: "Dom", tickets: 18 },
];

export const adminTicketsByCategory = [
  { name: "Dúvida", value: 35, color: "#8b5cf6" },
  { name: "Problema Técnico", value: 45, color: "#ec4899" },
  { name: "Financeiro", value: 15, color: "#eab308" },
  { name: "Outros", value: 5, color: "#94a3b8" },
];
