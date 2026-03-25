import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Store, ChevronDown, ChevronUp, Send, Users, ShieldAlert, BarChart3, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import FilterToolbar from "@/components/shared/FilterToolbar";
import DataTable from "@/components/shared/DataTable";
import PaginationControls from "@/components/shared/PaginationControls";
import { usePagination } from "@/hooks/use-pagination";
import { useEffect } from "react";
import KpiCard from "@/components/shared/KpiCard";
import { toast } from "sonner";
import { mockTickets, adminSuporteKpis, adminTicketsVolume, adminTicketsByCategory, type Ticket, type TicketStatus, type TicketPriority } from "@/data/suporte";

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

const columns = [
  { key: "subject", label: "Ticket" },
  { key: "store", label: "Loja / Usuário", hideOn: "sm" as const },
  { key: "priority", label: "Prioridade", hideOn: "md" as const },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const AdminSuporteContent = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.store.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, 10, page);

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
          <p className="text-sm text-muted-foreground">Gerencie solicitações dos lojistas e acompanhe métricas de atendimento</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">{openCount} abertos agora</Badge>
          <Badge variant="secondary">{inProgressCount} em andamento</Badge>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Novos Hoje" value={adminSuporteKpis.novosHoje} icon={AlertCircle} delay={0.1} />
        <KpiCard label="Resolvidos Hoje" value={adminSuporteKpis.resolvidosHoje} icon={CheckCircle} delay={0.2} positive={true} />
        <KpiCard label="Tempo Médio" value={adminSuporteKpis.tempoMedioResposta} icon={Clock} delay={0.3} />
        <KpiCard label="Satisfação" value={adminSuporteKpis.satisfacao} icon={TrendingUp} delay={0.4} positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base font-semibold">Volume de Tickets (7 dias)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={adminTicketsVolume}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <RechartsTooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
                <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base font-semibold">Tickets por Categoria</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={adminTicketsByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false} stroke="hsl(var(--background))" strokeWidth={2}>
                  {adminTicketsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DataTable
          columns={columns}
          data={paginatedItems}
          emptyMessage="Nenhum ticket encontrado."
          renderRow={(ticket: Ticket) => {
            const cfg = statusConfig[ticket.status];
            const expanded = expandedId === ticket.id;

            return (
              <React.Fragment key={ticket.id}>
              <tr className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-muted-foreground mr-2">#{ticket.id}</span>
                        <span className="text-sm text-foreground">{ticket.subject}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 text-xs"><Store className="h-3 w-3" />{ticket.store}</span>
                      <span className="flex items-center gap-1 text-xs"><User className="h-3 w-3" />{ticket.owner}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm md:table-cell">
                    <span className={`font-medium text-xs ${priorityColor[ticket.priority]}`}>{ticket.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={cfg.variant} className="flex w-fit items-center gap-1">{cfg.icon}{cfg.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setExpandedId(expanded ? null : ticket.id)}>
                      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </td>
                </tr>
                {expanded && (
                  <tr>
                    <td colSpan={columns.length} className="px-4 pb-4 pt-2 border-b border-border bg-muted/20">
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
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          }}
        />
        <PaginationControls
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </motion.div>
    </div>
  );
};

export default AdminSuporteContent;
