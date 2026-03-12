import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Ticket, Search, Plus, Download, Copy, Percent, DollarSign, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import KpiCard from "@/components/shared/KpiCard";
import { exportToCSV } from "@/lib/export";
import { mockCupons } from "@/data/cupons";
import type { Cupom } from "@/data/cupons";
import type { KpiItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

const CuponsContent = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return mockCupons.filter((c) => {
      const matchSearch = search === "" || c.code.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const ativos = mockCupons.filter((c) => c.status === "Ativo").length;
  const totalUsage = mockCupons.reduce((a, c) => a + c.usageCount, 0);

  const kpis: KpiItem[] = [
    { label: "Total de Cupons", value: mockCupons.length, icon: Ticket },
    { label: "Cupons Ativos", value: ativos, icon: CheckCircle, positive: true },
    { label: "Usos Totais", value: totalUsage, icon: Percent },
    { label: "Taxa de Uso", value: `${Math.round((totalUsage / mockCupons.reduce((a, c) => a + c.usageLimit, 0)) * 100)}%`, icon: DollarSign },
  ];

  const getTypeIcon = (type: Cupom["type"]) => {
    switch (type) {
      case "percentual": return <Percent className="h-3 w-3" />;
      case "fixo": return <DollarSign className="h-3 w-3" />;
      case "frete": return <Truck className="h-3 w-3" />;
    }
  };

  const getTypeLabel = (c: Cupom) => {
    switch (c.type) {
      case "percentual": return `${c.value}% OFF`;
      case "fixo": return `R$ ${c.value} OFF`;
      case "frete": return "Frete Grátis";
    }
  };

  const getStatusBadge = (status: Cupom["status"]) => {
    switch (status) {
      case "Ativo": return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-success/10 text-success"><CheckCircle className="h-3 w-3" />Ativo</span>;
      case "Expirado": return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"><Clock className="h-3 w-3" />Expirado</span>;
      case "Esgotado": return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive"><XCircle className="h-3 w-3" />Esgotado</span>;
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Código copiado!", description: code });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Cupons</h1>
          <p className="text-muted-foreground text-sm">Gestão de cupons e promoções</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border" onClick={() => exportToCSV(mockCupons.map((c) => ({ Código: c.code, Descrição: c.description, Tipo: c.type, Valor: c.value, "Usos": `${c.usageCount}/${c.usageLimit}`, Status: c.status })), "cupons")}>
            <Download className="h-4 w-4 mr-2" />Exportar
          </Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />Novo Cupom
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por código ou descrição..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-secondary border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Expirado">Expirado</SelectItem>
            <SelectItem value="Esgotado">Esgotado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum cupom encontrado.</div>
        ) : filtered.map((cupom) => (
          <motion.div key={cupom.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-4 space-y-3 hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">{getTypeIcon(cupom.type)}</div>
                <div>
                  <button onClick={() => copyCode(cupom.code)} className="flex items-center gap-1 text-foreground font-mono font-bold text-sm hover:text-primary transition-colors">
                    {cupom.code} <Copy className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <p className="text-xs text-muted-foreground">{cupom.description}</p>
                </div>
              </div>
              {getStatusBadge(cupom.status)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-accent font-bold">{getTypeLabel(cupom)}</span>
              <span className="text-muted-foreground text-xs">Min. R$ {cupom.minPurchase}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Usos: {cupom.usageCount}/{cupom.usageLimit}</span>
                <span>{Math.round((cupom.usageCount / cupom.usageLimit) * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.min(100, (cupom.usageCount / cupom.usageLimit) * 100)}%` }} />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
              <span>Início: {cupom.startDate}</span>
              <span>Fim: {cupom.endDate}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Dialog placeholder */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Novo Cupom</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Código</Label><Input placeholder="Ex: VERAO20" className="bg-secondary border-border mt-1" /></div>
            <div><Label>Descrição</Label><Input placeholder="Descrição do cupom" className="bg-secondary border-border mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tipo</Label>
                <Select defaultValue="percentual">
                  <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual</SelectItem>
                    <SelectItem value="fixo">Valor Fixo</SelectItem>
                    <SelectItem value="frete">Frete Grátis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Valor</Label><Input type="number" placeholder="10" className="bg-secondary border-border mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Compra Mínima (R$)</Label><Input type="number" placeholder="100" className="bg-secondary border-border mt-1" /></div>
              <div><Label>Limite de Usos</Label><Input type="number" placeholder="100" className="bg-secondary border-border mt-1" /></div>
            </div>
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={() => { setShowCreate(false); toast({ title: "Cupom criado!", description: "O cupom foi adicionado com sucesso." }); }}>
              Criar Cupom
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CuponsContent;
