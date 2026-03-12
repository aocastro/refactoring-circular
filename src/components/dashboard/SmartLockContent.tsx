import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Plus, AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import type { KpiItem } from "@/types";

interface SmartLockItem {
  id: number;
  product: string;
  sku: string;
  lockType: "Trava Magnética" | "Tag RF" | "Cabo de Aço";
  status: "Ativo" | "Liberado" | "Alarme";
  assignedAt: string;
  location: string;
}

const initialLocks: SmartLockItem[] = [
  { id: 1, product: "Vestido Floral Vintage", sku: "VFV-001", lockType: "Trava Magnética", status: "Ativo", assignedAt: "10/03/2026", location: "Arara A1" },
  { id: 2, product: "Jaqueta Jeans Upcycled", sku: "JJU-002", lockType: "Tag RF", status: "Ativo", assignedAt: "09/03/2026", location: "Arara B2" },
  { id: 3, product: "Bolsa de Couro Retrô", sku: "BCR-003", lockType: "Cabo de Aço", status: "Liberado", assignedAt: "08/03/2026", location: "Vitrine" },
  { id: 4, product: "Tênis Vintage Adidas", sku: "TVA-004", lockType: "Tag RF", status: "Alarme", assignedAt: "07/03/2026", location: "Prateleira C" },
  { id: 5, product: "Colar Artesanal Boho", sku: "CAB-005", lockType: "Trava Magnética", status: "Ativo", assignedAt: "11/03/2026", location: "Expositor" },
];

const lockStatusColor = (s: string) => {
  switch (s) {
    case "Ativo": return "bg-primary/10 text-primary";
    case "Liberado": return "bg-muted text-muted-foreground";
    case "Alarme": return "bg-destructive/10 text-destructive";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const SmartLockContent = () => {
  const [locks, setLocks] = useState(initialLocks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ product: "", sku: "", lockType: "Trava Magnética", location: "" });

  const filtered = locks.filter((l) => {
    const matchSearch = l.product.toLowerCase().includes(search.toLowerCase()) || l.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const kpis: KpiItem[] = [
    { label: "Travas Ativas", value: locks.filter((l) => l.status === "Ativo").length, icon: Lock },
    { label: "Liberadas", value: locks.filter((l) => l.status === "Liberado").length, icon: Unlock },
    { label: "Alarmes", value: locks.filter((l) => l.status === "Alarme").length, icon: AlertTriangle },
    { label: "Total", value: locks.length, icon: Shield },
  ];

  const handleAdd = () => {
    if (!form.product || !form.sku) return;
    setLocks((prev) => [...prev, {
      id: Date.now(),
      product: form.product,
      sku: form.sku,
      lockType: form.lockType as SmartLockItem["lockType"],
      status: "Ativo",
      assignedAt: new Date().toLocaleDateString("pt-BR"),
      location: form.location,
    }]);
    setForm({ product: "", sku: "", lockType: "Trava Magnética", location: "" });
    setDialogOpen(false);
  };

  const toggleStatus = (id: number) => {
    setLocks((prev) => prev.map((l) => l.id === id ? { ...l, status: l.status === "Ativo" ? "Liberado" : "Ativo" } : l));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">SmartLock</h1>
        <p className="text-muted-foreground text-sm">Gerencie travas e etiquetas de segurança dos produtos</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por produto ou SKU..."
        filters={[
          { key: "status", label: "Status", options: ["Todos", "Ativo", "Liberado", "Alarme"], value: statusFilter, onChange: setStatusFilter },
        ]}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" /> Nova Trava
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Atribuir Trava</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Produto</Label><Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder="Nome do produto" /></div>
                <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU-000" /></div>
                <div><Label>Tipo de Trava</Label>
                  <Select value={form.lockType} onValueChange={(v) => setForm({ ...form, lockType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trava Magnética">Trava Magnética</SelectItem>
                      <SelectItem value="Tag RF">Tag RF</SelectItem>
                      <SelectItem value="Cabo de Aço">Cabo de Aço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Localização</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Arara, vitrine..." /></div>
                <Button onClick={handleAdd} className="w-full bg-gradient-primary text-primary-foreground">Atribuir Trava</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Produto</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">SKU</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Tipo</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Local</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lock) => (
                <motion.tr key={lock.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{lock.product}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell font-mono text-xs">{lock.sku}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{lock.lockType}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{lock.location}</td>
                  <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${lockStatusColor(lock.status)}`}>{lock.status}</span></td>
                  <td className="py-3 px-4 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toggleStatus(lock.id)}>
                      {lock.status === "Ativo" ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </Button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhuma trava encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmartLockContent;
