import api from "@/api/axios";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Send, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DataTable from "@/components/shared/DataTable";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { type Ticket, type TicketStatus, type TicketCategory } from "@/data/suporte";
import { toast } from "sonner";

const statusConfig: Record<TicketStatus, { label: string; variant: "default" | "secondary" | "outline"; icon: React.ReactNode }> = {
  aberto: { label: "Aberto", variant: "default", icon: <AlertCircle className="h-3.5 w-3.5" /> },
  em_andamento: { label: "Em andamento", variant: "secondary", icon: <Clock className="h-3.5 w-3.5" /> },
  resolvido: { label: "Resolvido", variant: "outline", icon: <CheckCircle className="h-3.5 w-3.5" /> },
};

const columns = [
  { key: "subject", label: "Assunto" },
  { key: "category", label: "Categoria", hideOn: "sm" as const },
  { key: "status", label: "Status" },
  { key: "lastUpdate", label: "Última Atualização", hideOn: "md" as const },
  { key: "actions", label: "" },
];

const SuporteContent = () => {
  const [loadingData, setLoadingData] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mockTickets, setMockTickets] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_mockTickets = await api.get('/api/suporte/tickets');
        setMockTickets(res_mockTickets.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);



  // Only show tickets belonging to the current user (mocked as owner "Maria Silva")
  const currentUser = "Maria Silva";
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets.filter(t => t.owner === currentUser));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketCategory, setNewTicketCategory] = useState<TicketCategory | "">("");
  const [newTicketMessage, setNewTicketMessage] = useState("");

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase());
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
              lastUpdate: "Agora",
              messages: [...t.messages, { from: currentUser, role: "lojista" as const, text: replyText, time: "Agora" }],
            }
          : t
      )
    );
    setReplyText("");
    toast.success("Mensagem enviada!");
  };

  const handleCreateTicket = () => {
    if (!newTicketSubject || !newTicketCategory || !newTicketMessage) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const newTicket: Ticket = {
      id: Date.now(),
      subject: newTicketSubject,
      category: newTicketCategory as TicketCategory,
      store: "Sua Loja",
      owner: currentUser,
      status: "aberto",
      priority: "média",
      createdAt: "Agora",
      lastUpdate: "Agora",
      messages: [{ from: currentUser, role: "lojista", text: newTicketMessage, time: "Agora" }]
    };

    setTickets([newTicket, ...tickets]);
    setIsNewTicketOpen(false);
    setNewTicketSubject("");
    setNewTicketCategory("");
    setNewTicketMessage("");
    toast.success("Chamado aberto com sucesso!");
  };

  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Suporte</h2>
          <p className="text-sm text-muted-foreground">Abra chamados e acompanhe suas solicitações de atendimento.</p>
        </div>
        <Button onClick={() => setIsNewTicketOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Chamado
        </Button>
      </header>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por assunto..."
        filters={[{
          key: "status", label: "Status",
          options: ["Todos", "aberto", "em_andamento", "resolvido"],
          value: statusFilter, onChange: setStatusFilter,
        }]}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Nenhum chamado encontrado."
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
                        <span className="text-sm font-medium text-foreground">{ticket.subject}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {ticket.category}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={cfg.variant} className="flex w-fit items-center gap-1">{cfg.icon}{cfg.label}</Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {ticket.lastUpdate}
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
                          <div key={mi} className={`rounded-lg p-3 text-sm ${msg.role === "lojista" ? "ml-6 bg-primary/5 border border-primary/10" : "mr-6 bg-card border border-border"}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-medium ${msg.role === "lojista" ? "text-primary" : "text-foreground"}`}>
                                {msg.from} {msg.role === "admin" && "(Suporte Circular)"}
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
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => sendReply(ticket.id)} disabled={!replyText.trim()}>
                              <Send className="mr-1 h-3.5 w-3.5" />Enviar Mensagem
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
      </motion.div>

      {/* New Ticket Modal */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Abrir Novo Chamado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                placeholder="Ex: Dúvida sobre integração de pagamento"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={newTicketCategory} onValueChange={(val) => setNewTicketCategory(val as TicketCategory)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dúvida">Dúvida</SelectItem>
                  <SelectItem value="Problema Técnico">Problema Técnico</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Sugestão">Sugestão</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Descreva detalhadamente sua solicitação..."
                className="min-h-[100px]"
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateTicket}>Enviar Chamado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuporteContent;
