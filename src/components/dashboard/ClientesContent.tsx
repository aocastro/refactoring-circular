import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Search, Plus, Download, Eye, ShoppingBag, DollarSign, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import KpiCard from "@/components/shared/KpiCard";
import { exportToCSV } from "@/lib/export";
import { mockClientes as initialClientes, mockPurchaseHistory } from "@/data/clientes";
import type { Cliente } from "@/data/clientes";
import type { KpiItem } from "@/types";
import { toast } from "sonner";

const ClientesContent = () => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cpf: "" });

  const filtered = useMemo(() => {
    return clientes.filter((c) => {
      const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, clientes]);

  const totalClientes = clientes.length;
  const ativos = clientes.filter((c) => c.status === "Ativo").length;
  const totalRevenue = clientes.reduce((a, c) => a + c.totalSpent, 0);
  const totalPurchases = clientes.reduce((a, c) => a + c.totalPurchases, 0);
  const avgTicket = totalPurchases > 0 ? Math.round(totalRevenue / totalPurchases) : 0;

  const kpis: KpiItem[] = [
    { label: "Total de Clientes", value: totalClientes, icon: Users },
    { label: "Clientes Ativos", value: ativos, icon: UserCheck, positive: true, change: `${Math.round((ativos / totalClientes) * 100)}%` },
    { label: "Receita Total", value: `R$ ${totalRevenue.toLocaleString("pt-BR")}`, icon: DollarSign },
    { label: "Ticket Médio", value: `R$ ${avgTicket}`, icon: ShoppingBag },
  ];

  const clienteHistory = selectedCliente ? mockPurchaseHistory.filter((p) => p.clienteId === selectedCliente.id) : [];

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nome e e-mail são obrigatórios.");
      return;
    }
    const now = new Date();
    const newCliente: Cliente = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone || "(00) 00000-0000",
      totalPurchases: 0,
      totalSpent: 0,
      lastPurchase: "-",
      since: `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`,
      status: "Ativo",
    };
    setClientes((prev) => [newCliente, ...prev]);
    setForm({ name: "", email: "", phone: "", cpf: "" });
    setShowAddDialog(false);
    toast.success(`Cliente ${form.name} cadastrado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Clientes</h1>
          <p className="text-muted-foreground text-sm">Gestão de clientes e histórico de compras</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border" onClick={() => exportToCSV(clientes.map((c) => ({ Nome: c.name, Email: c.email, Telefone: c.phone, Compras: c.totalPurchases, "Total Gasto": c.totalSpent, Status: c.status })), "clientes")}>
            <Download className="h-4 w-4 mr-2" />Exportar
          </Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-secondary border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cliente</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Telefone</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Compras</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Total Gasto</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Última Compra</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">Nenhum cliente encontrado.</td></tr>
              ) : filtered.map((c) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">{c.name.charAt(0)}</div>
                      <div>
                        <p className="text-foreground font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">Desde {c.since}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{c.email}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{c.phone}</td>
                  <td className="py-3 px-4 text-center font-bold text-foreground">{c.totalPurchases}</td>
                  <td className="py-3 px-4 text-right text-foreground hidden sm:table-cell">R$ {c.totalSpent.toLocaleString("pt-BR")}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{c.lastPurchase}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${c.status === "Ativo" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCliente(c)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cliente Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">Novo Cliente</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome *</Label><Input placeholder="Nome completo" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>E-mail *</Label><Input type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>Telefone</Label><Input placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>CPF</Label><Input placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={handleAdd}>Cadastrar Cliente</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cliente Detail Dialog */}
      <Dialog open={!!selectedCliente} onOpenChange={(open) => !open && setSelectedCliente(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Histórico — {selectedCliente?.name}</DialogTitle>
          </DialogHeader>
          {selectedCliente && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Total de Compras</p>
                  <p className="text-lg font-bold text-foreground">{selectedCliente.totalPurchases}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Total Gasto</p>
                  <p className="text-lg font-bold text-foreground">R$ {selectedCliente.totalSpent.toLocaleString("pt-BR")}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Compras Recentes</h4>
                {clienteHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma compra registrada.</p>
                ) : (
                  <div className="space-y-2">
                    {clienteHistory.map((p) => (
                      <div key={p.id} className="p-3 rounded-lg border border-border bg-card">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-muted-foreground">{p.date} · {p.payment}</p>
                            <p className="text-sm text-foreground mt-0.5">{p.items.join(", ")}</p>
                          </div>
                          <p className="text-sm font-bold text-foreground">R$ {p.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientesContent;
