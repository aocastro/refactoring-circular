import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Tags, TrendingUp, TrendingDown, Wallet, Search, TableIcon, CalendarIcon, Check } from "lucide-react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControls from "@/components/shared/PaginationControls";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Conta {
  id: number;
  descricao: string;
  categoria: string;
  vencimento: string;
  valor: number;
  status: "Pendente" | "Pago" | "Atrasado" | "Recebido";
}

interface FinCategoria {
  id: number;
  nome: string;
  tipo: "Despesa" | "Receita";
  cor: string;
}

interface FinanceiroContentProps {
  defaultTab?: string;
  onSectionChange?: (section: string) => void;
}

const initialContasPagar: Conta[] = [
  { id: 1, descricao: "Aluguel da Loja", categoria: "Infraestrutura", vencimento: "10/04/2026", valor: 3500, status: "Pendente" },
  { id: 2, descricao: "Fornecedor - Camisetas", categoria: "Fornecedores", vencimento: "15/04/2026", valor: 4200, status: "Pendente" },
  { id: 3, descricao: "Conta de Luz", categoria: "Infraestrutura", vencimento: "05/04/2026", valor: 450, status: "Pago" },
  { id: 4, descricao: "Marketing Social", categoria: "Marketing", vencimento: "01/04/2026", valor: 1500, status: "Atrasado" },
];

const FinanceiroContent = ({ defaultTab = "visao-geral", onSectionChange }: FinanceiroContentProps) => {
  // Estados para "Contas a Pagar"
  const [contasPagar, setContasPagar] = useState<Conta[]>(initialContasPagar);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [monthFilter, setMonthFilter] = useState("Todos");
  const [sortKey, setSortKey] = useState<keyof Conta | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Estados para Modal Nova Conta
  const [isNovaContaOpen, setIsNovaContaOpen] = useState(false);
  const [novaContaData, setNovaContaData] = useState({
    descricao: "",
    valor: "",
    categoria: "",
    vencimento: new Date(),
    fornecedor: "",
    nomeManual: "",
    observacoes: "",
    repetir: false,
    frequencia: "Mensal",
    parcelas: "1"
  });

  const itemsPerPage = 5;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key as keyof Conta);
      setSortDirection("asc");
    }
  };

  const handleBaixaConta = (id: number) => {
    setContasPagar(contasPagar.map(conta =>
      conta.id === id ? { ...conta, status: "Pago" } : conta
    ));
  };

  const handleSalvarNovaConta = () => {
    if (!novaContaData.descricao || !novaContaData.valor || !novaContaData.categoria) return;

    const count = novaContaData.repetir ? parseInt(novaContaData.parcelas) || 1 : 1;
    const newContas: Conta[] = [];

    for (let i = 0; i < count; i++) {
      // Simples lógica de acréscimo de meses para repetição (apenas para demonstração)
      const date = new Date(novaContaData.vencimento);
      if (novaContaData.repetir && novaContaData.frequencia === "Mensal") {
        date.setMonth(date.getMonth() + i);
      }

      newContas.push({
        id: Math.max(...contasPagar.map(c => c.id), 0) + i + 1,
        descricao: count > 1 ? `${novaContaData.descricao} (${i+1}/${count})` : novaContaData.descricao,
        categoria: novaContaData.categoria,
        vencimento: format(date, "dd/MM/yyyy"),
        valor: parseFloat(novaContaData.valor.replace(",", ".")),
        status: "Pendente"
      });
    }

    setContasPagar([...contasPagar, ...newContas]);
    setIsNovaContaOpen(false);
    setNovaContaData({
      descricao: "", valor: "", categoria: "", vencimento: new Date(),
      fornecedor: "", nomeManual: "", observacoes: "", repetir: false,
      frequencia: "Mensal", parcelas: "1"
    });
  };

  const filteredContas = useMemo(() => {
    return contasPagar.filter(conta => {
      const matchesSearch = conta.descricao.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "Todos" || conta.status === statusFilter;
      const matchesMonth = monthFilter === "Todos" || conta.vencimento.includes(monthFilter); // Basic check for demo
      return matchesSearch && matchesStatus && matchesMonth;
    }).sort((a, b) => {
      if (!sortKey) return 0;

      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [contasPagar, searchQuery, statusFilter, monthFilter, sortKey, sortDirection]);

  const { paginatedItems, totalPages, safePage } = usePagination(filteredContas, itemsPerPage, currentPage);
  const [selectedMonth, setSelectedMonth] = useState("Maio 2026");
  const [saldoInicialInput, setSaldoInicialInput] = useState("10000.00");
  const saldoInicial = parseFloat(saldoInicialInput) || 0;

  // Mocked calculations based on current month selection
  const aPagarPrevisao = 4500.00;
  const aReceberPrevisao = 8200.00;
  const jaPagoRealizado = 3200.00;
  const jaRecebidoRealizado = 5400.00;

  const saldoPrevisto = saldoInicial + aReceberPrevisao + jaRecebidoRealizado - aPagarPrevisao - jaPagoRealizado;
  const saldoReal = saldoInicial + jaRecebidoRealizado - jaPagoRealizado;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-2xl font-bold text-foreground sr-only">Financeiro</h2>
        <p className="text-sm text-muted-foreground">Gerencie suas contas a pagar, a receber e categorias.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-end bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
        <div className="w-full sm:w-64 space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Mês de Referência</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Março 2026">Março 2026</SelectItem>
              <SelectItem value="Abril 2026">Abril 2026</SelectItem>
              <SelectItem value="Maio 2026">Maio 2026</SelectItem>
              <SelectItem value="Junho 2026">Junho 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-64 space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Saldo Inicial (R$)</label>
          <Input
            type="number"
            value={saldoInicialInput}
            onChange={(e) => setSaldoInicialInput(e.target.value)}
            placeholder="0.00"
            className="font-mono"
          />
        </div>
      </div>

      <Tabs value={defaultTab} onValueChange={(value) => {
        if (onSectionChange) {
          onSectionChange(
            value === "visao-geral" ? "financeiro-visao-geral" :
            value === "contas-pagar" ? "financeiro-pagar" :
            value === "contas-receber" ? "financeiro-receber" : "financeiro-categorias"
          );
        }
      }} className="w-full" aria-label="Seções do financeiro">
        <TabsList className="border border-border bg-secondary flex flex-wrap h-auto">
          <TabsTrigger value="visao-geral" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none">
            <DollarSign className="mr-2 h-4 w-4" />Visão Geral
          </TabsTrigger>
          <TabsTrigger value="contas-pagar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none">
            <ArrowDownCircle className="mr-2 h-4 w-4" />Contas a Pagar
          </TabsTrigger>
          <TabsTrigger value="contas-receber" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none">
            <ArrowUpCircle className="mr-2 h-4 w-4" />Contas a Receber
          </TabsTrigger>
          <TabsTrigger value="categorias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none">
            <Tags className="mr-2 h-4 w-4" />Categorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">A PAGAR (PREVISÃO)</p>
                  <p className="text-2xl font-display font-bold text-destructive mt-1">R$ {aPagarPrevisao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <TrendingDown className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">A RECEBER (PREVISÃO)</p>
                  <p className="text-2xl font-display font-bold text-success mt-1">R$ {aReceberPrevisao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">JÁ PAGO (REALIZADO)</p>
                  <p className="text-2xl font-display font-bold text-destructive mt-1">R$ {jaPagoRealizado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <ArrowDownCircle className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">JÁ RECEBIDO (REALIZADO)</p>
                  <p className="text-2xl font-display font-bold text-success mt-1">R$ {jaRecebidoRealizado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                  <ArrowUpCircle className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SALDO PREVISTO</p>
                  <p className="text-2xl font-display font-bold text-foreground mt-1">R$ {saldoPrevisto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-xl border border-border bg-primary text-primary-foreground p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-foreground/80">SALDO REAL</p>
                  <p className="text-2xl font-display font-bold mt-1">R$ {saldoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-4">Previsão vs Realizado (Mês Atual)</h3>
              <div className="h-[300px] w-full min-w-0 overflow-x-auto">
                <div className="min-w-[400px] h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { tipo: "Receitas", previsao: aReceberPrevisao, realizado: jaRecebidoRealizado },
                      { tipo: "Despesas", previsao: aPagarPrevisao, realizado: jaPagoRealizado }
                    ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="tipo" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(value) => `R$${value/1000}k`} />
                      <Tooltip cursor={{ fill: "hsl(var(--muted))" }} formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                      <Bar dataKey="previsao" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Previsão" />
                      <Bar dataKey="realizado" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Realizado" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-4">Despesas por Categoria</h3>
              <div className="h-[300px] w-full min-w-0 overflow-x-auto">
                <div className="min-w-[400px] h-full flex flex-col sm:flex-row items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Fornecedores", value: 6500 },
                          { name: "Salários", value: 4200 },
                          { name: "Marketing", value: 1500 },
                          { name: "Impostos", value: 2000 },
                          { name: "Outros", value: 650 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          "hsl(var(--chart-1))",
                          "hsl(var(--chart-2))",
                          "hsl(var(--chart-3))",
                          "hsl(var(--chart-4))",
                          "hsl(var(--chart-5))",
                        ].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 px-4">
                    {[
                      { name: "Fornecedores", color: "bg-chart-1" },
                      { name: "Salários", color: "bg-chart-2" },
                      { name: "Marketing", color: "bg-chart-3" },
                      { name: "Impostos", color: "bg-chart-4" },
                      { name: "Outros", color: "bg-chart-5" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="contas-pagar" className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Contas a Pagar</h3>
              <p className="text-sm text-muted-foreground">Gerencie suas obrigações financeiras.</p>
            </div>
            <Dialog open={isNovaContaOpen} onOpenChange={setIsNovaContaOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Conta</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Nova Despesa</DialogTitle>
                  <DialogDescription>
                    Preencha os dados abaixo para registrar uma nova conta a pagar.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input id="descricao" placeholder="Ex: Conta de Luz" value={novaContaData.descricao} onChange={(e) => setNovaContaData({...novaContaData, descricao: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input id="valor" placeholder="0,00" value={novaContaData.valor} onChange={(e) => setNovaContaData({...novaContaData, valor: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={novaContaData.categoria} onValueChange={(v) => setNovaContaData({...novaContaData, categoria: v})}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                          <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Impostos">Impostos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <Label className="mb-2">Vencimento</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {novaContaData.vencimento ? format(novaContaData.vencimento, "dd/MM/yyyy") : <span>Selecione a data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={novaContaData.vencimento} onSelect={(d) => d && setNovaContaData({...novaContaData, vencimento: d})} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fornecedor">Associar Fornecedor (Opcional)</Label>
                      <Select value={novaContaData.fornecedor} onValueChange={(v) => setNovaContaData({...novaContaData, fornecedor: v})}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="forn_1">Fornecedor A</SelectItem>
                          <SelectItem value="forn_2">Fornecedor B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomeManual">Nome Manual (Opcional)</Label>
                      <Input id="nomeManual" placeholder="Ex: João Silva" value={novaContaData.nomeManual} onChange={(e) => setNovaContaData({...novaContaData, nomeManual: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea id="observacoes" placeholder="Detalhes adicionais..." value={novaContaData.observacoes} onChange={(e) => setNovaContaData({...novaContaData, observacoes: e.target.value})} />
                  </div>

                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <Switch id="repetir" checked={novaContaData.repetir} onCheckedChange={(c) => setNovaContaData({...novaContaData, repetir: c})} />
                    <Label htmlFor="repetir" className="font-medium">Repetir essa conta?</Label>
                  </div>

                  {novaContaData.repetir && (
                    <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-md">
                      <div className="space-y-2">
                        <Label htmlFor="frequencia">Frequência</Label>
                        <Select value={novaContaData.frequencia} onValueChange={(v) => setNovaContaData({...novaContaData, frequencia: v})}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Diário">Diário</SelectItem>
                            <SelectItem value="Semanal">Semanal</SelectItem>
                            <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                            <SelectItem value="Mensal">Mensal</SelectItem>
                            <SelectItem value="Trimestral">Trimestral</SelectItem>
                            <SelectItem value="Semestral">Semestral</SelectItem>
                            <SelectItem value="Anual">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parcelas">Número de parcelas</Label>
                        <Input id="parcelas" type="number" min="1" value={novaContaData.parcelas} onChange={(e) => setNovaContaData({...novaContaData, parcelas: e.target.value})} />
                      </div>
                    </div>
                  )}

                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNovaContaOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSalvarNovaConta}>Salvar Despesa</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border border-border">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por descrição..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 w-full"
                />
              </div>

              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos os Status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <Select value={monthFilter} onValueChange={(value) => { setMonthFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mês de Referência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos os Meses</SelectItem>
                    <SelectItem value="/01/">Janeiro</SelectItem>
                    <SelectItem value="/02/">Fevereiro</SelectItem>
                    <SelectItem value="/03/">Março</SelectItem>
                    <SelectItem value="/04/">Abril</SelectItem>
                    <SelectItem value="/05/">Maio</SelectItem>
                    <SelectItem value="/06/">Junho</SelectItem>
                    <SelectItem value="/07/">Julho</SelectItem>
                    <SelectItem value="/08/">Agosto</SelectItem>
                    <SelectItem value="/09/">Setembro</SelectItem>
                    <SelectItem value="/10/">Outubro</SelectItem>
                    <SelectItem value="/11/">Novembro</SelectItem>
                    <SelectItem value="/12/">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 border border-border rounded-md p-1 bg-secondary/20">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <TableIcon className="h-4 w-4 mr-2" /> Tabela
              </Button>
              <Button
                variant={viewMode === "calendar" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="h-8 px-3"
              >
                <CalendarIcon className="h-4 w-4 mr-2" /> Calendário
              </Button>
            </div>
          </div>

          {viewMode === "table" ? (
            <>
          <DataTable<Conta>
            columns={[
              { key: "descricao", label: "Descrição", sortable: true },
              { key: "categoria", label: "Categoria", hideOn: "sm", sortable: true },
              { key: "vencimento", label: "Vencimento", sortable: true },
              { key: "valor", label: "Valor", sortable: true },
              { key: "status", label: "Status", sortable: true },
              { key: "acoes", label: "Ações", align: "right" },
            ]}
            data={paginatedItems}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            renderRow={(conta) => (
              <tr key={conta.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3 font-medium text-foreground">{conta.descricao}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{conta.categoria}</td>
                <td className="px-4 py-3 text-muted-foreground">{conta.vencimento}</td>
                <td className="px-4 py-3 font-medium">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={conta.status === "Pago" ? "bg-success/10 text-success" : conta.status === "Atrasado" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
                    {conta.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {conta.status !== "Pago" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-success" onClick={() => handleBaixaConta(conta.id)} title="Dar baixa">
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            )}
          />

          <PaginationControls
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredContas.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
          </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border rounded-xl p-6">
              <div className="flex justify-center border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow-sm bg-background"
                  locale={ptBR}
                  modifiers={{
                    hasExpense: contasPagar.map(c => parse(c.vencimento, "dd/MM/yyyy", new Date())),
                  }}
                  modifiersStyles={{
                    hasExpense: { fontWeight: 'bold', textDecoration: 'underline', color: 'hsl(var(--destructive))' }
                  }}
                />
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Despesas para {selectedDate ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Nenhuma data selecionada"}
                </h4>

                <div className="space-y-3">
                  {selectedDate ? (
                    contasPagar.filter(c => c.vencimento === format(selectedDate, "dd/MM/yyyy")).length > 0 ? (
                      contasPagar.filter(c => c.vencimento === format(selectedDate, "dd/MM/yyyy")).map(conta => (
                        <div key={conta.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border rounded-lg bg-secondary/10">
                          <div>
                            <p className="font-medium text-foreground">{conta.descricao}</p>
                            <p className="text-xs text-muted-foreground">{conta.categoria}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-2 sm:mt-0">
                            <span className="font-semibold text-destructive">
                              R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                            <Badge variant="outline" className={conta.status === "Pago" ? "bg-success/10 text-success" : conta.status === "Atrasado" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
                              {conta.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma despesa para esta data.</p>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">Selecione uma data no calendário para ver as despesas.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="contas-receber" className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Contas a Receber</h3>
              <p className="text-sm text-muted-foreground">Acompanhe suas receitas pendentes e recebidas.</p>
            </div>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Receita</Button>
          </div>
          <DataTable<Conta>
            columns={[
              { key: "descricao", label: "Descrição" },
              { key: "categoria", label: "Categoria", hideOn: "sm" },
              { key: "vencimento", label: "Recebimento" },
              { key: "valor", label: "Valor" },
              { key: "status", label: "Status" },
              { key: "acoes", label: "Ações", align: "right" },
            ]}
            data={[
              { id: 1, descricao: "Vendas Online (Cartão)", categoria: "Vendas", vencimento: "12/04/2026", valor: 8500, status: "Pendente" },
              { id: 2, descricao: "Vendas PDV (Pix)", categoria: "Vendas", vencimento: "10/04/2026", valor: 3200, status: "Recebido" },
              { id: 3, descricao: "Marketplace X", categoria: "Plataformas", vencimento: "15/04/2026", valor: 4100, status: "Pendente" },
              { id: 4, descricao: "Parceria Influenciador", categoria: "Parcerias", vencimento: "05/04/2026", valor: 1200, status: "Recebido" },
            ]}
            renderRow={(conta) => (
              <tr key={conta.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3 font-medium text-foreground">{conta.descricao}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{conta.categoria}</td>
                <td className="px-4 py-3 text-muted-foreground">{conta.vencimento}</td>
                <td className="px-4 py-3 font-medium text-success">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={conta.status === "Recebido" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                    {conta.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </TabsContent>

        <TabsContent value="categorias" className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Categorias Financeiras</h3>
              <p className="text-sm text-muted-foreground">Gerencie as categorias de receitas e despesas.</p>
            </div>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Categoria</Button>
          </div>
          <DataTable<FinCategoria>
            columns={[
              { key: "nome", label: "Nome" },
              { key: "tipo", label: "Tipo" },
              { key: "cor", label: "Cor de Exibição" },
              { key: "acoes", label: "Ações", align: "right" },
            ]}
            data={[
              { id: 1, nome: "Fornecedores", tipo: "Despesa", cor: "bg-chart-1" },
              { id: 2, nome: "Salários", tipo: "Despesa", cor: "bg-chart-2" },
              { id: 3, nome: "Vendas", tipo: "Receita", cor: "bg-success" },
              { id: 4, nome: "Marketing", tipo: "Despesa", cor: "bg-chart-3" },
              { id: 5, nome: "Infraestrutura", tipo: "Despesa", cor: "bg-chart-4" },
              { id: 6, nome: "Parcerias", tipo: "Receita", cor: "bg-primary" },
            ]}
            renderRow={(cat) => (
              <tr key={cat.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3 font-medium text-foreground">{cat.nome}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={cat.tipo === "Receita" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                    {cat.tipo}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full ${cat.cor}`} />
                    <span className="text-sm text-muted-foreground">{cat.cor.replace("bg-", "")}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceiroContent;
