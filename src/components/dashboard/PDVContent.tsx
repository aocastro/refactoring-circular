import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Monitor, DollarSign, ShoppingBag, Clock, Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Receipt, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import KpiCard from "@/components/shared/KpiCard";
import { useToast } from "@/hooks/use-toast";
import { storeProducts } from "@/data/store";
import type { KpiItem } from "@/types";

interface SaleItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface RegisteredSale {
  id: number;
  time: string;
  items: number;
  total: number;
  payment: string;
  customer: string;
}

const PDVContent = () => {
  const { toast } = useToast();
  const [caixaOpen, setCaixaOpen] = useState(false);
  const [openingAmount, setOpeningAmount] = useState("");
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [payment, setPayment] = useState("Dinheiro");
  const [customerName, setCustomerName] = useState("");
  const [sales, setSales] = useState<RegisteredSale[]>([
    { id: 1, time: "09:15", items: 3, total: 289, payment: "Cartão", customer: "Ana Oliveira" },
    { id: 2, time: "10:30", items: 1, total: 150, payment: "Pix", customer: "Cliente Avulso" },
    { id: 3, time: "11:45", items: 2, total: 430, payment: "Dinheiro", customer: "Carlos Silva" },
    { id: 4, time: "14:20", items: 1, total: 100, payment: "Cartão", customer: "Cliente Avulso" },
  ]);

  const totalSales = sales.reduce((a, s) => a + s.total, 0);
  const cartTotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const formatPrice = (p: number) => `R$ ${p.toFixed(2).replace(".", ",")}`;

  const kpis: KpiItem[] = [
    { label: "Status do Caixa", value: caixaOpen ? "Aberto" : "Fechado", icon: Monitor, positive: caixaOpen },
    { label: "Vendas Hoje", value: sales.length, icon: ShoppingBag },
    { label: "Total do Dia", value: formatPrice(totalSales), icon: DollarSign, positive: true },
    { label: "Ticket Médio", value: sales.length > 0 ? formatPrice(totalSales / sales.length) : "R$ 0", icon: Receipt },
  ];

  const filteredProducts = useMemo(() => {
    if (!search) return [];
    return storeProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
  }, [search]);

  const addToCart = (product: typeof storeProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });
    setSearch("");
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return setCart((prev) => prev.filter((i) => i.id !== id));
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleOpenCaixa = () => {
    setCaixaOpen(true);
    setShowOpenDialog(false);
    toast({ title: "Caixa aberto!", description: `Valor inicial: R$ ${openingAmount || "0"}` });
    setOpeningAmount("");
  };

  const handleCloseCaixa = () => {
    setCaixaOpen(false);
    setShowCloseDialog(false);
    toast({ title: "Caixa fechado!", description: `Total do dia: ${formatPrice(totalSales)}` });
  };

  const handleSale = () => {
    if (cart.length === 0) return;
    const now = new Date();
    const newSale: RegisteredSale = {
      id: sales.length + 1,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      items: cart.reduce((a, i) => a + i.quantity, 0),
      total: cartTotal,
      payment,
      customer: customerName || "Cliente Avulso",
    };
    setSales((prev) => [newSale, ...prev]);
    setCart([]);
    setCustomerName("");
    toast({ title: "Venda registrada!", description: `${formatPrice(cartTotal)} via ${payment}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">PDV</h1>
          <p className="text-muted-foreground text-sm">Ponto de venda presencial</p>
        </div>
        {!caixaOpen ? (
          <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => setShowOpenDialog(true)}>
            <Power className="h-4 w-4 mr-2" />Abrir Caixa
          </Button>
        ) : (
          <Button size="sm" variant="destructive" onClick={() => setShowCloseDialog(true)}>
            <PowerOff className="h-4 w-4 mr-2" />Fechar Caixa
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      {caixaOpen && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product search + cart */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="font-display font-bold text-foreground text-sm">Nova Venda</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar produto por nome ou SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
              </div>
              {filteredProducts.length > 0 && (
                <div className="border border-border rounded-lg max-h-48 overflow-y-auto divide-y divide-border">
                  {filteredProducts.map((p) => (
                    <button key={p.id} onClick={() => addToCart(p)} className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left">
                      <span className="text-xl">{p.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku} • {p.category}</p>
                      </div>
                      <span className="text-sm font-bold text-foreground shrink-0">{formatPrice(p.price)}</span>
                      <Plus className="h-4 w-4 text-primary shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Cart items */}
              {cart.length > 0 && (
                <div className="space-y-2 pt-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-lg">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(item.price)} un.</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center text-foreground">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-foreground w-20 text-right">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => updateQty(item.id, 0)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              )}

              {cart.length === 0 && !search && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Busque um produto acima para iniciar uma venda
                </div>
              )}
            </div>
          </div>

          {/* Payment panel */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-4 sticky top-20">
              <h3 className="font-display font-bold text-foreground text-sm">Pagamento</h3>
              <div>
                <Label className="text-xs">Cliente</Label>
                <Input placeholder="Nome do cliente (opcional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-xs">Forma de Pagamento</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { id: "Dinheiro", icon: Banknote },
                    { id: "Cartão", icon: CreditCard },
                    { id: "Pix", icon: Smartphone },
                  ].map((opt) => (
                    <button key={opt.id} onClick={() => setPayment(opt.id)} className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs transition-colors ${payment === opt.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      <opt.icon className="h-4 w-4" />
                      {opt.id}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Itens</span><span className="text-foreground">{cart.reduce((a, i) => a + i.quantity, 0)}</span></div>
                <div className="flex justify-between text-lg font-bold"><span className="text-foreground">Total</span><span className="text-foreground">{formatPrice(cartTotal)}</span></div>
              </div>
              <Button className="w-full bg-gradient-primary text-primary-foreground py-5" disabled={cart.length === 0} onClick={handleSale}>
                <Receipt className="h-4 w-4 mr-2" />Registrar Venda
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sales history */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Vendas do Dia</h3>
        {sales.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6">Nenhuma venda registrada hoje.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left py-2 font-medium">Hora</th>
                <th className="text-left py-2 font-medium">Cliente</th>
                <th className="text-center py-2 font-medium">Itens</th>
                <th className="text-left py-2 font-medium">Pagamento</th>
                <th className="text-right py-2 font-medium">Total</th>
              </tr></thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 text-foreground">{sale.time}</td>
                    <td className="py-2.5 text-foreground">{sale.customer}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{sale.items}</td>
                    <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">{sale.payment}</span></td>
                    <td className="py-2.5 text-right font-bold text-foreground">{formatPrice(sale.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Open Caixa Dialog */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Abrir Caixa</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Valor Inicial (troco)</Label><Input type="number" placeholder="200.00" value={openingAmount} onChange={(e) => setOpeningAmount(e.target.value)} className="mt-1 bg-secondary border-border" /></div>
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={handleOpenCaixa}>Confirmar Abertura</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Caixa Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Fechar Caixa</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Vendas realizadas</span><span className="text-foreground font-bold">{sales.length}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total em vendas</span><span className="text-foreground font-bold">{formatPrice(totalSales)}</span></div>
            </div>
            <Button variant="destructive" className="w-full" onClick={handleCloseCaixa}>Confirmar Fechamento</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDVContent;
