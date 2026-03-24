import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Store, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { toast } from "sonner";

type TicketStatus = "aberto" | "em_andamento" | "resolvido";
type TicketPriority = "baixa" | "média" | "alta" | "urgente";

interface Ticket {
  id: number;
  subject: string;
  store: string;
  owner: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  lastUpdate: string;
  messages: { from: string; role: "lojista" | "admin"; text: string; time: string }[];
}

const initialTickets: Ticket[] = [
  {
    id: 1001, subject: "Problema com integração de pagamento", store: "Fashion Store", owner: "Maria Silva",
    status: "aberto", priority: "alta", createdAt: "Hoje, 13:40", lastUpdate: "Hoje, 13:40",
    messages: [
      { from: "Maria Silva", role: "lojista", text: "Ao tentar processar pagamentos via PIX, o sistema retorna erro 500. Já tentei limpar cache.", time: "13:40" },
    ],
  },
  {
    id: 1002, subject: "Solicitação de upgrade de plano", store: "Vintage Corner", owner: "João Santos",
    status: "em_andamento", priority: "média", createdAt: "Ontem, 10:00", lastUpdate: "Hoje, 09:15",
    messages: [
      { from: "João Santos", role: "lojista", text: "Gostaria de migrar do Essential para o Growth. Como funciona a cobrança proporcional?", time: "10:00" },
      { from: "Admin Master", role: "admin", text: "Olá João! A migração é proporcional ao período restante. Vou calcular o valor e enviar a proposta.", time: "09:15" },
    ],
  },
  {
    id: 1003, subject: "Relatório ESG não carrega", store: "Eco Brechó", owner: "Ana Paula",
    status: "resolvido", priority: "baixa", createdAt: "22/12, 08:30", lastUpdate: "22/12, 14:00",
    messages: [
      { from: "Ana Paula", role: "lojista", text: "A página de relatórios ESG fica em loading infinito.", time: "08:30" },
      { from: "Admin Master", role: "admin", text: "Identificamos o problema. Era um timeout no cálculo de CO₂. Já foi corrigido.", time: "14:00" },
    ],
  },
  {
    id: 1004, subject: "Dúvida sobre funcionalidade SmartLock", store: "Reuse & Style", owner: "Carlos Lima",
    status: "aberto", priority: "média", createdAt: "Hoje, 11:20", lastUpdate: "Hoje, 11:20",
    messages: [
      { from: "Carlos Lima", role: "lojista", text: "Como configurar o SmartLock para reservas automáticas com prazo de 48h?", time: "11:20" },
    ],
  },
  {
    id: 1005, subject: "Erro ao importar produtos em massa", store: "Brechó da Vila", owner: "Roberto Dias",
    status: "em_andamento", priority: "urgente", createdAt: "Ontem, 16:00", lastUpdate: "Hoje, 08:30",
    messages: [
      { from: "Roberto Dias", role: "lojista", text: "Upload de CSV com 500 produtos falha na linha 234. Erro de formato.", time: "16:00" },
      { from: "Admin Master", role: "admin", text: "Roberto, verificamos que o campo 'preço' na linha 234 tem vírgula ao invés de ponto. Pode corrigir e tentar novamente?", time: "08:30" },
    ],
  },
];

const statusConfig: Record<TicketStatus, { label: string; variant: "default" | "secondary" | "outline"; icon: React.ReactNode }> = {
  aberto: { label: "Aberto", variant: "default", icon: <AlertCircle className="h-3.5 w-3.5" /> },
  em_andamento: { label: "Em andamento", variant: "secondary", icon: <Clock className="h-3.5 w-3.5" /> },
  resolvido: { label: "Resolvido", variant: "outline", icon: <CheckCircle className="h-3.5 w-3.5" /> },
};

const priorityColor: Record<TicketPriority, string> = {
  baixa: "text-muted-foreground",
  média: "text-blue-500",
  alta: "text-amber-500",
  urgente: "text-destructive",
};

const AdminSuporteContent = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.store.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sendReply = (ticketId: number) => {
    if (!replyText.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "em_andamento" as TicketStatus,
              lastUpdate: "Agora",
              messages: [...t.messages, { from: "Admin Master", role: "admin" as const, text: replyText, time: "Agora" }],
            }
          : t
      )
    );
    setReplyText("");
    toast.success("Resposta enviada!");
  };

  const resolveTicket = (ticketId: number) => {
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: "resolvido" as TicketStatus, lastUpdate: "Agora" } : t));
    toast.success("Ticket resolvido!");
  };

  const openCount = tickets.filter((t) => t.status === "aberto").length;
  const inProgressCount = tickets.filter((t) => t.status === "em_andamento").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Suporte / Tickets</h2>
          <p className="text-sm text-muted-foreground">Gerencie solicitações dos lojistas</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">{openCount} abertos</Badge>
          <Badge variant="secondary">{inProgressCount} em andamento</Badge>
        </div>
      </header>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por assunto ou loja..."
        filters={[{
          key: "status", label: "Status",
          options: ["Todos", "aberto", "em_andamento", "resolvido"],
          value: statusFilter, onChange: setStatusFilter,
        }]}
      />

      <div className="space-y-3">
        {filtered.map((ticket, i) => {
          const cfg = statusConfig[ticket.status];
          const expanded = expandedId === ticket.id;

          return (
            <motion.div key={ticket.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={expanded ? "ring-1 ring-primary/20" : ""}>
                <CardContent className="p-0">
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : ticket.id)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">#{ticket.id}</span>
                          <span className="text-sm text-foreground">{ticket.subject}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Store className="h-3 w-3" />{ticket.store}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{ticket.owner}</span>
                          <span className={`font-medium ${priorityColor[ticket.priority]}`}>{ticket.priority}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={cfg.variant} className="flex items-center gap-1">{cfg.icon}{cfg.label}</Badge>
                      {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {expanded && (
                    <div className="border-t border-border px-4 pb-4 pt-3">
                      <div className="space-y-3">
                        {ticket.messages.map((msg, mi) => (
                          <div key={mi} className={`rounded-lg p-3 text-sm ${msg.role === "admin" ? "ml-6 bg-primary/5 border border-primary/10" : "mr-6 bg-muted"}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-medium ${msg.role === "admin" ? "text-primary" : "text-foreground"}`}>
                                {msg.from} {msg.role === "admin" && "(Admin)"}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                            </div>
                            <p className="mt-1 text-foreground">{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      {ticket.status !== "resolvido" && (
                        <div className="mt-4 space-y-2">
                          <Textarea
                            placeholder="Escreva uma resposta..."
                            value={expandedId === ticket.id ? replyText : ""}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[80px] resize-none"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => sendReply(ticket.id)} disabled={!replyText.trim()}>
                              <Send className="mr-1 h-3.5 w-3.5" />Responder
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => resolveTicket(ticket.id)}>
                              <CheckCircle className="mr-1 h-3.5 w-3.5" />Marcar como resolvido
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">Nenhum ticket encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSuporteContent;
