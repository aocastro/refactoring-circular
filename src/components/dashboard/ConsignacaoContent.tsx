import api from "@/api/axios";
import { useState, useEffect, useMemo } from "react";
import { Plus, Users, FileText, DollarSign, Clock, CheckCircle, AlertCircle, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { consignanteStatusOptions, pendingRanges } from "@/data/consignacao";
import { getStatusColor } from "@/lib/status-colors";
import { exportToCSV } from "@/lib/export";
import type { KpiItem } from "@/types";
import { toast } from "sonner";

const ConsignacaoContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialConsignantes, setInitialConsignantes] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mockContracts, setMockContracts] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_initialConsignantes = await api.get('/api/consignacao/consignantes');
        setInitialConsignantes(res_initialConsignantes.data);
        const res_mockContracts = await api.get('/api/consignacao/contracts');
        setMockContracts(res_mockContracts.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);



  const [consignantes, setConsignantes] = useState(initialConsignantes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [pendingFilter, setPendingFilter] = useState("Todos");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", comissao: "50/50" });

  const filtered = useMemo(() => {
    const range = pendingRanges.find((p) => p.label === pendingFilter) || pendingRanges[0];
    return consignantes.filter((c) => {
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
  }, [search, statusFilter, pendingFilter, consignantes]);

  const totalPending = consignantes.reduce((acc, c) => acc + c.pendingValue, 0);

  const kpis: KpiItem[] = [
    { label: "Consignantes", value: consignantes.length, icon: Users },
    { label: "Contratos Ativos", value: mockContracts.filter((c) => c.status === "Vigente").length, icon: FileText },
    { label: "Pagamento Pendente", value: `R$ ${totalPending.toFixed(2).replace(".", ",")}`, icon: DollarSign },
    { label: "Itens Consignados", value: consignantes.reduce((a, c) => a + c.items, 0), icon: Clock },
  ];

  const handleAdd = () => {
    if (!form.name.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }
    const now = new Date();
    const newConsignante = {
      id: Date.now(),
      name: form.name,
      items: 0,
      sold: 0,
      pending: "R$ 0,00",
      pendingValue: 0,
      status: "Ativo" as const,
      since: `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`,
    };
    setConsignantes((prev) => [newConsignante, ...prev]);
    setForm({ name: "", email: "", phone: "", comissao: "50/50" });
    setShowAddDialog(false);
    toast.success(`Consignante ${form.name} cadastrado com sucesso!`);
  };



  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Consignação</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus consignantes e contratos</p>
        </div>
        <Button variant="outline" size="sm" className="border-border" onClick={() => exportToCSV(consignantes.map((c) => ({ Nome: c.name, Itens: c.items, Vendidos: c.sold, Pendente: c.pending, Status: c.status, Desde: c.since })), "consignantes")}>
          <Download className="h-4 w-4 mr-2" />Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Consignantes</h3>
        <FilterToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar consignante..."
          filters={[
            { key: "status", label: "Status", options: consignanteStatusOptions, value: statusFilter, onChange: setStatusFilter },
            { key: "pending", label: "Valor Pendente", options: pendingRanges.map((p) => p.label), value: pendingFilter, onChange: setPendingFilter },
          ]}
          actions={
            <Button size="sm" className="bg-gradient-primary text-primary-foreground shrink-0" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />Novo
            </Button>
          }
        />

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
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhum consignante encontrado.</td></tr>
                ) : filtered.map((c) => (
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
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(c.status)}`}>
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
                ))}
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
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(contract.status)}`}>
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

      {/* Add Consignante Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">Novo Consignante</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome *</Label><Input placeholder="Nome do consignante" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>E-mail</Label><Input type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>Telefone</Label><Input placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>Divisão de Comissão</Label><Input placeholder="50/50" value={form.comissao} onChange={(e) => setForm((p) => ({ ...p, comissao: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={handleAdd}>Cadastrar Consignante</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsignacaoContent;
