import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Plus, Eye, Trash2, Clock, CheckCircle, XCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import type { KpiItem } from "@/types";

type BagStatus = "Montando" | "Pronta" | "Enviada" | "Finalizada" | "Cancelada";

interface Bag {
  id: number;
  code: string;
  customer: string;
  items: { name: string; price: number }[];
  total: number;
  status: BagStatus;
  createdAt: string;
  expiresAt: string;
}

const initialBags: Bag[] = [
  { id: 1, code: "SAC-001", customer: "Ana Silva", items: [{ name: "Vestido Floral Vintage", price: 89.9 }, { name: "Colar Artesanal Boho", price: 45 }], total: 134.9, status: "Pronta", createdAt: "12/03/2026", expiresAt: "15/03/2026" },
  { id: 2, code: "SAC-002", customer: "Juliana Costa", items: [{ name: "Bolsa de Couro Retrô", price: 210 }], total: 210, status: "Enviada", createdAt: "11/03/2026", expiresAt: "14/03/2026" },
  { id: 3, code: "SAC-003", customer: "Fernanda Lima", items: [{ name: "Jaqueta Jeans Upcycled", price: 159 }, { name: "Saia Midi Plissada", price: 78 }], total: 237, status: "Montando", createdAt: "12/03/2026", expiresAt: "16/03/2026" },
  { id: 4, code: "SAC-004", customer: "Maria Oliveira", items: [{ name: "Tênis Vintage Adidas", price: 120 }], total: 120, status: "Finalizada", createdAt: "08/03/2026", expiresAt: "11/03/2026" },
  { id: 5, code: "SAC-005", customer: "Pedro Santos", items: [{ name: "Óculos Retrô Ray-Ban", price: 195 }, { name: "Camisa Hawaiana 90s", price: 65 }], total: 260, status: "Cancelada", createdAt: "07/03/2026", expiresAt: "10/03/2026" },
];

const bagStatusColor = (s: BagStatus) => {
  const map: Record<BagStatus, string> = {
    "Montando": "bg-accent/10 text-accent",
    "Pronta": "bg-primary/10 text-primary",
    "Enviada": "bg-primary/10 text-primary",
    "Finalizada": "bg-muted text-muted-foreground",
    "Cancelada": "bg-destructive/10 text-destructive",
  };
  return map[s];
};

const SacolinhasContent = () => {
  const [bags, setBags] = useState(initialBags);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailBag, setDetailBag] = useState<Bag | null>(null);
  const [form, setForm] = useState({ customer: "", items: "" });

  const filtered = bags.filter((b) => {
    const matchSearch = b.code.toLowerCase().includes(search.toLowerCase()) || b.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const kpis: KpiItem[] = [
    { label: "Total Sacolinhas", value: bags.length, icon: ShoppingBag },
    { label: "Em Montagem", value: bags.filter((b) => b.status === "Montando").length, icon: Clock },
    { label: "Prontas/Enviadas", value: bags.filter((b) => b.status === "Pronta" || b.status === "Enviada").length, icon: Send },
    { label: "Finalizadas", value: bags.filter((b) => b.status === "Finalizada").length, icon: CheckCircle },
  ];

  const handleAdd = () => {
    if (!form.customer) return;
    const items = form.items.split(",").map((name) => ({ name: name.trim(), price: 0 })).filter((i) => i.name);
    const today = new Date();
    const expires = new Date(today);
    expires.setDate(expires.getDate() + 3);
    setBags((prev) => [...prev, {
      id: Date.now(),
      code: `SAC-${String(prev.length + 1).padStart(3, "0")}`,
      customer: form.customer,
      items,
      total: 0,
      status: "Montando",
      createdAt: today.toLocaleDateString("pt-BR"),
      expiresAt: expires.toLocaleDateString("pt-BR"),
    }]);
    setForm({ customer: "", items: "" });
    setDialogOpen(false);
  };

  const advanceStatus = (id: number) => {
    const steps: BagStatus[] = ["Montando", "Pronta", "Enviada", "Finalizada"];
    setBags((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      const idx = steps.indexOf(b.status);
      if (idx < 0 || idx >= steps.length - 1) return b;
      return { ...b, status: steps[idx + 1] };
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Sacolinhas</h1>
        <p className="text-muted-foreground text-sm">Monte e envie seleções personalizadas de produtos para seus clientes</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar sacolinha ou cliente..."
        filters={[
          { key: "status", label: "Status", options: ["Todos", "Montando", "Pronta", "Enviada", "Finalizada", "Cancelada"], value: statusFilter, onChange: setStatusFilter },
        ]}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Nova Sacolinha</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova Sacolinha</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Cliente</Label><Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Nome do cliente" /></div>
                <div><Label>Itens (separados por vírgula)</Label><Input value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} placeholder="Vestido, Bolsa, Colar..." /></div>
                <Button onClick={handleAdd} className="w-full bg-gradient-primary text-primary-foreground">Criar Sacolinha</Button>
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
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Código</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cliente</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Itens</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Total</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Validade</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bag) => (
                <motion.tr key={bag.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 text-foreground font-mono text-xs font-medium">{bag.code}</td>
                  <td className="py-3 px-4 text-foreground">{bag.customer}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{bag.items.length} peças</td>
                  <td className="py-3 px-4 text-foreground font-medium text-right hidden md:table-cell">R$ {bag.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{bag.expiresAt}</td>
                  <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${bagStatusColor(bag.status)}`}>{bag.status}</span></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setDetailBag(bag)}><Eye className="h-4 w-4" /></Button>
                      {bag.status !== "Finalizada" && bag.status !== "Cancelada" && (
                        <Button size="sm" variant="ghost" onClick={() => advanceStatus(bag.id)}><Send className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Nenhuma sacolinha encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!detailBag} onOpenChange={() => setDetailBag(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Sacolinha {detailBag?.code}</DialogTitle></DialogHeader>
          {detailBag && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cliente:</span><p className="font-medium text-foreground">{detailBag.customer}</p></div>
                <div><span className="text-muted-foreground">Criada em:</span><p className="font-medium text-foreground">{detailBag.createdAt}</p></div>
                <div><span className="text-muted-foreground">Validade:</span><p className="font-medium text-foreground">{detailBag.expiresAt}</p></div>
                <div><span className="text-muted-foreground">Status:</span><p><span className={`text-xs px-2 py-1 rounded-full ${bagStatusColor(detailBag.status)}`}>{detailBag.status}</span></p></div>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-sm font-medium text-foreground mb-2">Itens da Sacolinha</p>
                {detailBag.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-foreground">{item.name}</span>
                    {item.price > 0 && <span className="text-muted-foreground">R$ {item.price.toFixed(2)}</span>}
                  </div>
                ))}
                {detailBag.total > 0 && (
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-border mt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">R$ {detailBag.total.toFixed(2)}</span>
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

export default SacolinhasContent;
