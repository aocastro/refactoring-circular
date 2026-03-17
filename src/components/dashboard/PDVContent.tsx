import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Plus, Power, PowerOff, ShoppingBag, DollarSign, Clock, Receipt, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import KpiCard from "@/components/shared/KpiCard";
import { useToast } from "@/hooks/use-toast";
import type { KpiItem } from "@/types";

interface CashRegister {
  id: number;
  name: string;
  status: "aberto" | "fechado";
  operator: string;
  openedAt?: string;
  salesCount: number;
  totalSales: number;
}

const PDVContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registers, setRegisters] = useState<CashRegister[]>([
    { id: 1, name: "Caixa 01", status: "fechado", operator: "Maria", salesCount: 0, totalSales: 0 },
    { id: 2, name: "Caixa 02", status: "fechado", operator: "João", salesCount: 0, totalSales: 0 },
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState<number | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newOperator, setNewOperator] = useState("");
  const [openingAmount, setOpeningAmount] = useState("");

  const openCount = registers.filter((r) => r.status === "aberto").length;
  const totalSales = registers.reduce((a, r) => a + r.salesCount, 0);
  const totalRevenue = registers.reduce((a, r) => a + r.totalSales, 0);
  const formatPrice = (p: number) => `R$ ${p.toFixed(2).replace(".", ",")}`;

  const kpis: KpiItem[] = [
    { label: "Caixas Abertos", value: `${openCount}/${registers.length}`, icon: Monitor, positive: openCount > 0 },
    { label: "Vendas Hoje", value: totalSales, icon: ShoppingBag },
    { label: "Receita Total", value: formatPrice(totalRevenue), icon: DollarSign, positive: true },
    { label: "Ticket Médio", value: totalSales > 0 ? formatPrice(totalRevenue / totalSales) : "R$ 0", icon: Receipt },
  ];

  const handleAddRegister = () => {
    if (!newName.trim()) return;
    setRegisters((prev) => [
      ...prev,
      { id: Date.now(), name: newName, status: "fechado", operator: newOperator || "Sem operador", salesCount: 0, totalSales: 0 },
    ]);
    setNewName("");
    setNewOperator("");
    setShowAddDialog(false);
    toast({ title: "Caixa adicionado!", description: `${newName} criado com sucesso.` });
  };

  const handleOpenRegister = (id: number) => {
    const now = new Date();
    setRegisters((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: "aberto" as const, openedAt: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` } : r
    ));
    setShowOpenDialog(null);
    setOpeningAmount("");
    toast({ title: "Caixa aberto!", description: `Valor inicial: R$ ${openingAmount || "0"}` });
  };

  const handleCloseRegister = (id: number) => {
    setRegisters((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: "fechado" as const, openedAt: undefined } : r
    ));
    setShowCloseDialog(null);
    toast({ title: "Caixa fechado!" });
  };

  const handleDeleteRegister = (id: number) => {
    const reg = registers.find((r) => r.id === id);
    if (reg?.status === "aberto") {
      toast({ title: "Erro", description: "Feche o caixa antes de removê-lo.", variant: "destructive" });
      return;
    }
    setRegisters((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Caixa removido!" });
  };

  const enterPDV = (id: number) => {
    navigate(`/pdv/${id}`);
  };

  return (
    <section className="space-y-6" aria-labelledby="pdv-section-title" aria-describedby="pdv-section-description">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 id="pdv-section-title" className="text-2xl font-bold font-display text-foreground">PDV</h2>
          <p id="pdv-section-description" className="text-muted-foreground text-sm">Gerencie caixas, abertura e fechamento de operação e acesso ao ponto de venda com controles acessíveis.</p>
        </div>
        <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />Novo Caixa
        </Button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      {/* Cash registers grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {registers.map((reg, idx) => (
          <motion.div
            key={reg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-xl border bg-card p-5 space-y-4 ${
              reg.status === "aberto" ? "border-green-500/40" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  reg.status === "aberto" ? "bg-green-500/10" : "bg-secondary"
                }`}>
                  <Monitor className={`h-5 w-5 ${reg.status === "aberto" ? "text-green-500" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{reg.name}</h3>
                  <p className="text-xs text-muted-foreground">{reg.operator}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${reg.status === "aberto" ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                <span className={`text-xs font-medium ${reg.status === "aberto" ? "text-green-500" : "text-muted-foreground"}`}>
                  {reg.status === "aberto" ? "Aberto" : "Fechado"}
                </span>
              </div>
            </div>

            {reg.status === "aberto" && reg.openedAt && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Aberto às {reg.openedAt}</span>
                <span>{reg.salesCount} vendas</span>
                <span className="font-medium text-foreground">{formatPrice(reg.totalSales)}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {reg.status === "fechado" ? (
                <>
                  <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground" onClick={() => setShowOpenDialog(reg.id)}>
                    <Power className="h-3.5 w-3.5 mr-1" />Abrir
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteRegister(reg.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" className="flex-1" variant="outline" onClick={() => enterPDV(reg.id)}>
                    <Monitor className="h-3.5 w-3.5 mr-1" />Entrar no PDV
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setShowCloseDialog(reg.id)}>
                    <PowerOff className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add register dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Novo Caixa</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome do Caixa</Label><Input placeholder="Caixa 03" value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>Operador</Label><Input placeholder="Nome do operador" value={newOperator} onChange={(e) => setNewOperator(e.target.value)} className="mt-1 bg-secondary border-border" /></div>
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={handleAddRegister} disabled={!newName.trim()}>Criar Caixa</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Open register dialog */}
      <Dialog open={showOpenDialog !== null} onOpenChange={() => setShowOpenDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Abrir Caixa</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Valor Inicial (troco)</Label><Input type="number" placeholder="200.00" value={openingAmount} onChange={(e) => setOpeningAmount(e.target.value)} className="mt-1 bg-secondary border-border" /></div>
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={() => showOpenDialog && handleOpenRegister(showOpenDialog)}>Confirmar Abertura</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close register dialog */}
      <Dialog open={showCloseDialog !== null} onOpenChange={() => setShowCloseDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Fechar Caixa</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {showCloseDialog && (() => {
              const reg = registers.find((r) => r.id === showCloseDialog);
              return reg ? (
                <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Caixa</span><span className="text-foreground font-bold">{reg.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Vendas</span><span className="text-foreground font-bold">{reg.salesCount}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="text-foreground font-bold">{formatPrice(reg.totalSales)}</span></div>
                </div>
              ) : null;
            })()}
            <Button variant="destructive" className="w-full" onClick={() => showCloseDialog && handleCloseRegister(showCloseDialog)}>Confirmar Fechamento</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDVContent;
