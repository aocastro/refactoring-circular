import { useState } from "react";
import { motion } from "framer-motion";
import { Warehouse, Plus, Edit, Trash2, Package, MapPin, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import type { KpiItem } from "@/types";

interface SubStock {
  id: number;
  name: string;
  location: string;
  totalItems: number;
  capacity: number;
  responsible: string;
  status: "Ativo" | "Inativo";
}

const initialSubStocks: SubStock[] = [
  { id: 1, name: "Arara Principal", location: "Loja - Térreo", totalItems: 45, capacity: 60, responsible: "Maria", status: "Ativo" },
  { id: 2, name: "Vitrine Frontal", location: "Loja - Entrada", totalItems: 12, capacity: 15, responsible: "Ana", status: "Ativo" },
  { id: 3, name: "Estoque Reserva", location: "Depósito - Subsolo", totalItems: 120, capacity: 200, responsible: "Carlos", status: "Ativo" },
  { id: 4, name: "Arara Promoções", location: "Loja - Fundo", totalItems: 30, capacity: 40, responsible: "Juliana", status: "Ativo" },
  { id: 5, name: "Pop-up Store Centro", location: "Externo - Shopping", totalItems: 0, capacity: 25, responsible: "Pedro", status: "Inativo" },
];

const SubestoquesContent = () => {
  const [subStocks, setSubStocks] = useState(initialSubStocks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", capacity: "", responsible: "" });

  const filtered = subStocks.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalItems = subStocks.reduce((a, b) => a + b.totalItems, 0);
  const totalCapacity = subStocks.reduce((a, b) => a + b.capacity, 0);

  const kpis: KpiItem[] = [
    { label: "Subestoques", value: subStocks.filter((s) => s.status === "Ativo").length, icon: Warehouse },
    { label: "Itens Alocados", value: totalItems, icon: Package },
    { label: "Capacidade Total", value: totalCapacity, icon: MapPin },
    { label: "Ocupação", value: `${Math.round((totalItems / totalCapacity) * 100)}%`, icon: ArrowRightLeft },
  ];

  const handleAdd = () => {
    if (!form.name) return;
    setSubStocks((prev) => [...prev, {
      id: Date.now(),
      name: form.name,
      location: form.location,
      totalItems: 0,
      capacity: parseInt(form.capacity) || 50,
      responsible: form.responsible,
      status: "Ativo",
    }]);
    setForm({ name: "", location: "", capacity: "", responsible: "" });
    setDialogOpen(false);
  };

  const handleRemove = (id: number) => setSubStocks((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Subestoques</h1>
        <p className="text-muted-foreground text-sm">Gerencie os pontos de armazenamento e distribuição de produtos</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar subestoque..."
        filters={[
          { key: "status", label: "Status", options: ["Todos", "Ativo", "Inativo"], value: statusFilter, onChange: setStatusFilter },
        ]}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Novo Subestoque</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo Subestoque</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Arara A1" /></div>
                <div><Label>Localização</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: Loja - Térreo" /></div>
                <div><Label>Capacidade</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="50" /></div>
                <div><Label>Responsável</Label><Input value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} placeholder="Nome" /></div>
                <Button onClick={handleAdd} className="w-full bg-gradient-primary text-primary-foreground">Criar Subestoque</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sub, i) => {
          const pct = Math.round((sub.totalItems / sub.capacity) * 100);
          return (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground">{sub.location}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${sub.status === "Ativo" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{sub.status}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{sub.totalItems} / {sub.capacity} itens</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary">
                  <div className={`h-full rounded-full transition-all ${pct > 85 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Resp: {sub.responsible}</span>
                <Button size="sm" variant="ghost" className="text-destructive h-7" onClick={() => handleRemove(sub.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-8">Nenhum subestoque encontrado.</p>}
      </div>
    </div>
  );
};

export default SubestoquesContent;
