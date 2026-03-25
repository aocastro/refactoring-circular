import api from "@/api/axios";
import { useState, useEffect } from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Plus, Eye, Clock, CheckCircle, Send, Search, X, Trash2, Package, User, Calendar, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { mockProducts } from "@/data/products";
import { mockClientes } from "@/data/clientes";
import { getStatusColor } from "@/lib/status-colors";
import type { KpiItem, Product } from "@/types";

type BagStatus = "Montando" | "Pronta p/ Retirada" | "Com o Cliente" | "Devolvida" | "Vendida Parcial" | "Vendida Total" | "Cancelada";

interface BagItem {
  product: Product;
  quantity: number;
  returned?: boolean;
  sold?: boolean;
}

interface Bag {
  id: number;
  code: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  items: BagItem[];
  total: number;
  status: BagStatus;
  createdAt: string;
  trialDays: number;
  returnDate: string;
  notes: string;
}

const initialBags: Bag[] = [
  {
    id: 1, code: "SAC-001", customer: "Ana Silva", customerPhone: "(11) 99123-4567", customerEmail: "ana@email.com",
    items: [{ product: mockProducts[0], quantity: 1 }, { product: mockProducts[4], quantity: 1 }],
    total: 134.9, status: "Com o Cliente", createdAt: "10/03/2026", trialDays: 3, returnDate: "13/03/2026", notes: "Cliente quer testar para evento no sábado.",
  },
  {
    id: 2, code: "SAC-002", customer: "Juliana Costa", customerPhone: "(21) 99876-5432", customerEmail: "ju@email.com",
    items: [{ product: mockProducts[2], quantity: 1 }],
    total: 210, status: "Devolvida", createdAt: "08/03/2026", trialDays: 5, returnDate: "13/03/2026", notes: "",
  },
  {
    id: 3, code: "SAC-003", customer: "Fernanda Lima", customerPhone: "(31) 99234-5678", customerEmail: "fer@email.com",
    items: [{ product: mockProducts[1], quantity: 1 }, { product: mockProducts[6], quantity: 1 }],
    total: 237, status: "Montando", createdAt: "12/03/2026", trialDays: 3, returnDate: "15/03/2026", notes: "Separar embalagem especial.",
  },
  {
    id: 4, code: "SAC-004", customer: "Maria Oliveira", customerPhone: "(11) 97654-3210", customerEmail: "maria@email.com",
    items: [{ product: mockProducts[3], quantity: 1, sold: true }],
    total: 120, status: "Vendida Total", createdAt: "05/03/2026", trialDays: 5, returnDate: "10/03/2026", notes: "Cliente comprou após teste.",
  },
];

const bagStatusColor = (s: BagStatus) => {
  const map: Record<BagStatus, string> = {
    "Montando": "bg-accent/10 text-accent",
    "Pronta p/ Retirada": "bg-primary/10 text-primary",
    "Com o Cliente": "bg-accent/10 text-accent",
    "Devolvida": "bg-muted text-muted-foreground",
    "Vendida Parcial": "bg-primary/10 text-primary",
    "Vendida Total": "bg-primary/10 text-primary",
    "Cancelada": "bg-destructive/10 text-destructive",
  };
  return map[s];
};

const SacolinhasContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [mockProducts, setMockProducts] = useState<any[]>(null);
  const [mockClientes, setMockClientes] = useState<any[]>(null);
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res_mockProducts = await api.get('/api/products');
        const res_mockClientes = await api.get('/api/clientes');
        if (mounted) {
          setMockProducts(res_mockProducts.data);
          setMockClientes(res_mockClientes.data);
          setLoadingData(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
    if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return () => { mounted = false; };
  }, []);

    const [detailBag, setDetailBag] = useState<Bag | null>(null);

  // Form state  const [selectedCustomer, setSelectedCustomer] = useState<{ name: string; phone: string; email: string } | null>(null);  const [selectedProducts, setSelectedProducts] = useState<BagItem[]>([]);  const customerDropRef = useRef<HTMLDivElement>(null);

  const filteredClients = useMemo(() => {
    if (!customerInput || selectedCustomer) return [];
    return mockClientes.filter((c) =>
      c.name.toLowerCase().includes(customerInput.toLowerCase()) ||
      c.phone.includes(customerInput) ||
      c.email.toLowerCase().includes(customerInput.toLowerCase())
    ).slice(0, 5);
  }, [customerInput, selectedCustomer]);

  const availableProducts = useMemo(() => {
    const selectedIds = new Set(selectedProducts.map((sp) => sp.product.id));
    const available = mockProducts.filter((p) => p.status === "Disponível" && !selectedIds.has(p.id));
    if (!productSearch) return available;
    return available.filter((p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch, selectedProducts]);
  const filtered = bags.filter((b) => {
    const matchSearch = b.code.toLowerCase().includes(search.toLowerCase()) || b.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const kpis: KpiItem[] = [
    { label: "Total Sacolinhas", value: bags.length, icon: ShoppingBag },
    { label: "Com o Cliente", value: bags.filter((b) => b.status === "Com o Cliente").length, icon: Clock },
    { label: "Montando", value: bags.filter((b) => b.status === "Montando" || b.status === "Pronta p/ Retirada").length, icon: Send },
    { label: "Vendidas", value: bags.filter((b) => b.status === "Vendida Total" || b.status === "Vendida Parcial").length, icon: CheckCircle },
  ];

  const resetForm = () => {
    setCustomerInput("");
    setSelectedCustomer(null);
    setProductSearch("");
    setSelectedProducts([]);
    setTrialDays("3");
    setNotes("");
  };

  const handleAdd = () => {
    if (!selectedCustomer || selectedProducts.length === 0) return;
    const today = new Date();
    const returnD = new Date(today);
    returnD.setDate(returnD.getDate() + parseInt(trialDays));
    const total = selectedProducts.reduce((a, b) => a + b.product.price * b.quantity, 0);

    setBags((prev) => [...prev, {
      id: Date.now(),
      code: `SAC-${String(prev.length + 1).padStart(3, "0")}`,
      customer: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerEmail: selectedCustomer.email,
      items: selectedProducts,
      total,
      status: "Montando",
      createdAt: today.toLocaleDateString("pt-BR"),
      trialDays: parseInt(trialDays),
      returnDate: returnD.toLocaleDateString("pt-BR"),
      notes,
    }]);
    resetForm();
    setDialogOpen(false);
  };

  const addProduct = (product: Product) => {
    setSelectedProducts((prev) => [...prev, { product, quantity: 1 }]);
    setProductSearch("");
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((sp) => sp.product.id !== productId));
  };

  const advanceStatus = (id: number) => {
    const steps: BagStatus[] = ["Montando", "Pronta p/ Retirada", "Com o Cliente", "Devolvida"];
    setBags((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      const idx = steps.indexOf(b.status);
      if (idx < 0 || idx >= steps.length - 1) return b;
      return { ...b, status: steps[idx + 1] };
    }));
  };

  const bagTotal = selectedProducts.reduce((a, b) => a + b.product.price * b.quantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Sacolinhas</h1>
        <p className="text-muted-foreground text-sm">Retire produtos do estoque para o cliente testar em casa antes de comprar</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar sacolinha ou cliente..."
        filters={[
          { key: "status", label: "Status", options: ["Todos", "Montando", "Pronta p/ Retirada", "Com o Cliente", "Devolvida", "Vendida Parcial", "Vendida Total", "Cancelada"], value: statusFilter, onChange: setStatusFilter },
        ]}
        actions={
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Nova Sacolinha</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Nova Sacolinha</DialogTitle></DialogHeader>
              <div className="space-y-5 pt-2">
                {/* Customer search */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Cliente</Label>
                  {selectedCustomer ? (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{selectedCustomer.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedCustomer.phone} • {selectedCustomer.email}</p>
                      </div>
                      <button onClick={() => { setSelectedCustomer(null); setCustomerInput(""); }} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="relative" ref={customerDropRef}>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar por nome, telefone ou e-mail..." value={customerInput} onChange={(e) => { setCustomerInput(e.target.value); setShowCustomerDrop(true); }} onFocus={() => setShowCustomerDrop(true)} className="pl-10 bg-secondary border-border" />
                      {showCustomerDrop && filteredClients.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-50 max-h-40 overflow-y-auto">
                          {filteredClients.map((c) => (
                            <button key={c.id} onClick={() => { setSelectedCustomer({ name: c.name, phone: c.phone, email: c.email }); setCustomerInput(c.name); setShowCustomerDrop(false); }}
                              className="w-full text-left px-3 py-2 hover:bg-secondary/50 transition-colors border-b border-border last:border-0">
                              <p className="text-sm font-medium text-foreground">{c.name}</p>
                              <p className="text-[10px] text-muted-foreground">{c.phone} • {c.email}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Produtos do Estoque</Label>

                  {selectedProducts.length > 0 && (
                    <div className="rounded-lg border border-border divide-y divide-border">
                      {selectedProducts.map((sp) => (
                        <div key={sp.product.id} className="flex items-center gap-3 p-2.5">
                          <span className="text-lg">{sp.product.image}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{sp.product.name}</p>
                            <p className="text-[10px] text-muted-foreground">{sp.product.sku} • {sp.product.category} • Tam. {sp.product.size}</p>
                          </div>
                          <span className="text-sm font-bold text-foreground shrink-0">R$ {sp.product.price.toFixed(2)}</span>
                          <button onClick={() => removeProduct(sp.product.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                      <div className="flex justify-between p-2.5 bg-secondary/30">
                        <span className="text-sm text-muted-foreground">{selectedProducts.length} peças</span>
                        <span className="text-sm font-bold text-foreground">Total: R$ {bagTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar produto por nome ou SKU para adicionar..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
                  </div>

                  {productSearch && (
                    <div className="rounded-lg border border-border max-h-48 overflow-y-auto">
                      {availableProducts.length === 0 ? (
                        <p className="text-center text-muted-foreground text-xs py-4">Nenhum produto disponível encontrado.</p>
                      ) : availableProducts.slice(0, 8).map((p) => (
                        <button key={p.id} onClick={() => addProduct(p)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/50 transition-colors border-b border-border last:border-0 text-left">
                          <span className="text-lg">{p.image}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">{p.sku} • {p.category} • {p.condition} • Tam. {p.size}</p>
                          </div>
                          <span className="text-sm font-medium text-foreground shrink-0">R$ {p.price.toFixed(2)}</span>
                          <Plus className="h-4 w-4 text-primary shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trial period */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Dias para teste</Label>
                    <Input type="number" value={trialDays} onChange={(e) => setTrialDays(e.target.value)} min={1} max={30} className="mt-1 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label>Devolução prevista</Label>
                    <div className="mt-1 p-2.5 rounded-md bg-secondary border border-border text-sm text-foreground">
                      {(() => {
                        const d = new Date(); d.setDate(d.getDate() + parseInt(trialDays || "0"));
                        return d.toLocaleDateString("pt-BR");
                      })()}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label>Observações</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Detalhes sobre a sacolinha, preferências do cliente..." className="mt-1 bg-secondary border-border" rows={2} />
                </div>

                <Button onClick={handleAdd} disabled={!selectedCustomer || selectedProducts.length === 0} className="w-full bg-gradient-primary text-primary-foreground">
                  <ShoppingBag className="h-4 w-4 mr-2" /> Montar Sacolinha ({selectedProducts.length} peças)
                </Button>
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
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Peças</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Valor</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Devolução</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bag) => (
                <motion.tr key={bag.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 text-foreground font-mono text-xs font-medium">{bag.code}</td>
                  <td className="py-3 px-4">
                    <p className="text-foreground text-sm">{bag.customer}</p>
                    <p className="text-[10px] text-muted-foreground">{bag.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{bag.items.length} peças</td>
                  <td className="py-3 px-4 text-foreground font-medium text-right hidden md:table-cell">R$ {bag.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{bag.returnDate}</td>
                  <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${bagStatusColor(bag.status)}`}>{bag.status}</span></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setDetailBag(bag)}><Eye className="h-4 w-4" /></Button>
                      {!["Devolvida", "Vendida Total", "Vendida Parcial", "Cancelada"].includes(bag.status) && (
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

      {/* Detail dialog */}
      <Dialog open={!!detailBag} onOpenChange={() => setDetailBag(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" /> Sacolinha {detailBag?.code}</DialogTitle></DialogHeader>
          {detailBag && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2"><User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><div><span className="text-muted-foreground text-xs">Cliente</span><p className="font-medium text-foreground">{detailBag.customer}</p></div></div>
                <div className="flex items-start gap-2"><Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><div><span className="text-muted-foreground text-xs">Telefone</span><p className="font-medium text-foreground">{detailBag.customerPhone}</p></div></div>
                <div className="flex items-start gap-2"><Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><div><span className="text-muted-foreground text-xs">E-mail</span><p className="font-medium text-foreground">{detailBag.customerEmail}</p></div></div>
                <div className="flex items-start gap-2"><Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><div><span className="text-muted-foreground text-xs">Período</span><p className="font-medium text-foreground">{detailBag.trialDays} dias (até {detailBag.returnDate})</p></div></div>
              </div>

              <div><span className={`text-xs px-2.5 py-1 rounded-full ${bagStatusColor(detailBag.status)}`}>{detailBag.status}</span></div>

              {detailBag.notes && (
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm text-foreground">{detailBag.notes}</p>
                </div>
              )}

              <div className="border-t border-border pt-3">
                <p className="text-sm font-medium text-foreground mb-2">Peças na Sacolinha</p>
                <div className="space-y-2">
                  {detailBag.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                      <span className="text-lg">{item.product.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.product.sku} • Tam. {item.product.size} • {item.product.condition}</p>
                      </div>
                      <span className="text-sm font-bold text-foreground shrink-0">R$ {item.product.price.toFixed(2)}</span>
                      {item.sold && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Vendido</span>}
                      {item.returned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Devolvido</span>}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-bold pt-3 mt-2 border-t border-border">
                  <span className="text-foreground">Valor Total das Peças</span>
                  <span className="text-foreground">R$ {detailBag.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SacolinhasContent;
