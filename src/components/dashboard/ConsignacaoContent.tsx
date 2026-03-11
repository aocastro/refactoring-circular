import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Users,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Filter,
  X,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/lib/export";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockConsignantes = [
  { id: 1, name: "Ana Paula Ferreira", items: 12, sold: 8, pending: "R$ 340,00", pendingValue: 340, status: "Ativo", since: "Mar/2025" },
  { id: 2, name: "Carlos Eduardo Silva", items: 25, sold: 18, pending: "R$ 890,00", pendingValue: 890, status: "Ativo", since: "Jan/2025" },
  { id: 3, name: "Fernanda Oliveira", items: 7, sold: 3, pending: "R$ 120,00", pendingValue: 120, status: "Ativo", since: "Jun/2025" },
  { id: 4, name: "Juliana Mendonça", items: 15, sold: 15, pending: "R$ 0,00", pendingValue: 0, status: "Pago", since: "Fev/2025" },
  { id: 5, name: "Roberto Santos", items: 30, sold: 22, pending: "R$ 1.250,00", pendingValue: 1250, status: "Ativo", since: "Nov/2024" },
  { id: 6, name: "Mariana Costa", items: 9, sold: 5, pending: "R$ 210,00", pendingValue: 210, status: "Ativo", since: "Ago/2025" },
];

const mockContracts = [
  { id: 1, consignante: "Ana Paula Ferreira", items: 5, date: "15/12/2025", split: "60/40", status: "Vigente" },
  { id: 2, consignante: "Carlos Eduardo Silva", items: 10, date: "02/12/2025", split: "50/50", status: "Vigente" },
  { id: 3, consignante: "Roberto Santos", items: 8, date: "28/11/2025", split: "55/45", status: "Vigente" },
  { id: 4, consignante: "Fernanda Oliveira", items: 7, date: "10/12/2025", split: "60/40", status: "Vigente" },
  { id: 5, consignante: "Juliana Mendonça", items: 15, date: "01/11/2025", split: "50/50", status: "Encerrado" },
];

const statusOptions = ["Todos", "Ativo", "Pago"];
const pendingRanges = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Sem pendência", min: 0, max: 0 },
  { label: "Até R$ 200", min: 0.01, max: 200 },
  { label: "R$ 200–500", min: 200, max: 500 },
  { label: "Acima de R$ 500", min: 500, max: Infinity },
];

const ConsignacaoContent = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [pendingFilter, setPendingFilter] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = [statusFilter, pendingFilter].filter(f => f !== "Todos").length;

  const filtered = useMemo(() => {
    const range = pendingRanges.find(p => p.label === pendingFilter) || pendingRanges[0];
    return mockConsignantes.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
      let matchPending = true;
      if (pendingFilter === "Sem pendência") {
        matchPending = c.pendingValue === 0;
      } else if (pendingFilter !== "Todos") {
        matchPending = c.pendingValue >= range.min && c.pendingValue <= range.max;
      }
      return matchSearch && matchStatus && matchPending;
    });
  }, [search, statusFilter, pendingFilter]);

  const clearFilters = () => {
    setStatusFilter("Todos");
    setPendingFilter("Todos");
    setSearch("");
  };

  const totalPending = mockConsignantes.reduce((acc, c) => acc + c.pendingValue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Consignação</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus consignantes e contratos</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Consignantes", value: mockConsignantes.length, icon: Users },
          { label: "Contratos Ativos", value: mockContracts.filter(c => c.status === "Vigente").length, icon: FileText },
          { label: "Pagamento Pendente", value: `R$ ${totalPending.toFixed(2).replace(".", ",")}`, icon: DollarSign },
          { label: "Itens Consignados", value: mockConsignantes.reduce((a, c) => a + c.items, 0), icon: Clock },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold font-display text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Consignantes */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Consignantes</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar consignante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border sm:w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border shrink-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center mr-1">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Filtros Avançados</h4>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-accent hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Limpar filtros
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Valor Pendente</label>
                <Select value={pendingFilter} onValueChange={setPendingFilter}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingRanges.map(p => <SelectItem key={p.label} value={p.label}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Consignante</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Itens</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Vendidos</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Pendente</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Nenhum consignante encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-foreground font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">Desde {c.since}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground hidden sm:table-cell">{c.items}</td>
                      <td className="py-3 px-4 text-foreground hidden md:table-cell">{c.sold}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{c.pending}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          c.status === "Ativo" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
                        }`}>
                          {c.status === "Ativo" ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contracts */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Contratos Recentes</h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Consignante</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Itens</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Data</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Divisão</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-foreground">{contract.consignante}</td>
                    <td className="py-3 px-4 text-foreground hidden sm:table-cell">{contract.items}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{contract.date}</td>
                    <td className="py-3 px-4 text-foreground font-mono text-xs">{contract.split}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        contract.status === "Vigente" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {contract.status === "Vigente" ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsignacaoContent;
