import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone,
  Receipt, ArrowLeft, Package, ShoppingCart, X, Barcode,
  Clock, User, PercentCircle, CheckCircle2, Loader2, QrCode,
  Printer, SplitSquareHorizontal, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { storeProducts } from "@/data/store";
import { mockClientes } from "@/data/clientes";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku: string;
}

interface PaymentEntry {
  method: string;
  amount: number;
}

interface RegisteredSale {
  id: number;
  time: string;
  items: CartItem[];
  total: number;
  payments: PaymentEntry[];
  customer: string;
  discount: number;
}

const formatPrice = (p: number) => `R$ ${p.toFixed(2).replace(".", ",")}`;

const allPaymentMethods = [
  { id: "Dinheiro", icon: Banknote, shortcut: "F2", color: "text-green-500" },
  { id: "Crédito", icon: CreditCard, shortcut: "F3", color: "text-blue-500" },
  { id: "Débito", icon: Wallet, shortcut: "F4", color: "text-cyan-500" },
  { id: "Pix", icon: Smartphone, shortcut: "F5", color: "text-purple-500" },
];

type PaymentStep = "idle" | "select" | "cash" | "card" | "pix" | "processing" | "approved" | "receipt";

const PDVPage = () => {
  const navigate = useNavigate();
  const { id: caixaId } = useParams();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const customerRef = useRef<HTMLDivElement>(null);
  const [discount, setDiscount] = useState(0);
  const [sales, setSales] = useState<RegisteredSale[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Payment flow state
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("idle");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [cardInstallments, setCardInstallments] = useState("1");
  const [cardBrand, setCardBrand] = useState("Visa");
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [splitMode, setSplitMode] = useState(false);
  const [splitAmount, setSplitAmount] = useState("");
  const [lastSale, setLastSale] = useState<RegisteredSale | null>(null);

  const cartTotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const discountValue = (cartTotal * discount) / 100;
  const cartTotalWithDiscount = cartTotal - discountValue;
  const totalItems = cart.reduce((a, i) => a + i.quantity, 0);
  const paidSoFar = payments.reduce((a, p) => a + p.amount, 0);
  const remaining = cartTotalWithDiscount - paidSoFar;

  const filteredProducts = useMemo(() => {
    if (!search) return storeProducts.filter((p) => p.status === "Disponível").slice(0, 20);
    return storeProducts
      .filter((p) => p.status === "Disponível" && (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())))
      .slice(0, 20);
  }, [search]);

  const addToCart = useCallback((product: typeof storeProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, sku: product.sku }];
    });
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) return setCart((prev) => prev.filter((i) => i.id !== id));
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const startPayment = () => {
    if (cart.length === 0) return;
    setPayments([]);
    setSplitMode(false);
    setSplitAmount("");
    setPaymentStep("select");
  };

  const selectMethod = (method: string) => {
    setSelectedMethod(method);
    if (method === "Dinheiro") {
      setCashReceived("");
      setPaymentStep("cash");
    } else if (method === "Crédito" || method === "Débito") {
      setCardInstallments("1");
      setCardBrand("Visa");
      setPaymentStep("card");
    } else if (method === "Pix") {
      setPaymentStep("pix");
    }
  };

  const processPayment = async (amount: number) => {
    setPaymentStep("processing");
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const newPayments = [...payments, { method: selectedMethod + (selectedMethod === "Crédito" ? ` ${cardInstallments}x ${cardBrand}` : selectedMethod === "Débito" ? ` ${cardBrand}` : ""), amount }];
    setPayments(newPayments);

    const totalPaid = newPayments.reduce((a, p) => a + p.amount, 0);
    if (totalPaid >= cartTotalWithDiscount) {
      setPaymentStep("approved");
      await new Promise((r) => setTimeout(r, 1200));
      finalizeSale(newPayments);
    } else {
      toast.success(`${formatPrice(amount)} pago via ${selectedMethod}. Faltam ${formatPrice(cartTotalWithDiscount - totalPaid)}`);
      setPaymentStep("select");
    }
  };

  const finalizeSale = (finalPayments: PaymentEntry[]) => {
    const now = new Date();
    const newSale: RegisteredSale = {
      id: sales.length + 1,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`,
      items: totalItems,
      total: cartTotalWithDiscount,
      payments: finalPayments,
      customer: customerName || "Cliente Avulso",
      discount,
    };
    setSales((prev) => [newSale, ...prev]);
    setLastSale(newSale);
    setCart([]);
    setCustomerName("");
    setDiscount(0);
    setPaymentStep("receipt");
  };

  const closeReceipt = () => {
    setPaymentStep("idle");
    setLastSale(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (paymentStep !== "idle") return;
      if (e.key === "F1") { e.preventDefault(); document.getElementById("pdv-search")?.focus(); }
      if (e.key === "F2") { e.preventDefault(); }
      if (e.key === "F6") { e.preventDefault(); startPayment(); }
      if (e.key === "Escape") { e.preventDefault(); setSearch(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paymentStep]);

  const dayTotal = sales.reduce((a, s) => a + s.total, 0);
  

  const currentPayAmount = splitMode && splitAmount ? Math.min(Number(splitAmount), remaining) : remaining;

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="h-12 bg-card border-b border-border flex items-center px-3 gap-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />Voltar
        </Button>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-bold text-foreground">Caixa {caixaId || "01"}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4 text-xs text-muted-foreground hidden md:flex">
          <span>F1 Buscar</span>
          <span>F6 Pagar</span>
          <span>ESC Limpar</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {sales.length} vendas • {formatPrice(dayTotal)}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Product grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border bg-card/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="pdv-search" placeholder="Buscar produto por nome ou código (F1)..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border text-base h-11" autoFocus />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filteredProducts.map((product) => (
                <motion.button key={product.id} whileTap={{ scale: 0.95 }} onClick={() => addToCart(product)}
                  className="flex flex-col items-center p-3 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-center group">
                  <span className="text-3xl mb-2">{product.image}</span>
                  <span className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{product.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">{product.sku}</span>
                  <span className="text-sm font-bold text-primary mt-1">{formatPrice(product.price)}</span>
                </motion.button>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Package className="h-12 w-12 mb-3 opacity-50" /><p className="text-sm">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart + Payment */}
        <div className="w-[380px] border-l border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground text-sm">Carrinho</span>
              {totalItems > 0 && <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">{totalItems}</span>}
            </div>
            {cart.length > 0 && <button onClick={() => setCart([])} className="text-xs text-destructive hover:text-destructive/80">Limpar</button>}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-6">
                  <Barcode className="h-10 w-10 mb-3 opacity-40" />
                  <p className="text-sm text-center">Selecione produtos à esquerda ou use a busca</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {cart.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-3 flex gap-3">
                      <span className="text-2xl shrink-0">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(item.price)} un.</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"><Minus className="h-3 w-3" /></button>
                          <span className="text-sm font-bold w-8 text-center text-foreground">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"><Plus className="h-3 w-3" /></button>
                          <button onClick={() => updateQty(item.id, 0)} className="ml-auto text-destructive hover:text-destructive/80"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground shrink-0 self-start">{formatPrice(item.price * item.quantity)}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom totals + pay button */}
          <div className="border-t border-border p-3 space-y-3 bg-card">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Input placeholder="Cliente (opcional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="h-8 text-xs bg-secondary border-border" />
            </div>
            <div className="flex items-center gap-2">
              <PercentCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Input type="number" placeholder="Desconto %" value={discount || ""} onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))} className="h-8 text-xs bg-secondary border-border w-24" min={0} max={100} />
              {discount > 0 && <span className="text-xs text-destructive">-{formatPrice(discountValue)}</span>}
            </div>
            <div className="space-y-1 pt-1 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Subtotal ({totalItems} itens)</span><span>{formatPrice(cartTotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-xs text-destructive"><span>Desconto ({discount}%)</span><span>-{formatPrice(discountValue)}</span></div>}
              <div className="flex justify-between text-xl font-bold text-foreground pt-1"><span>Total</span><span>{formatPrice(cartTotalWithDiscount)}</span></div>
            </div>
            <Button className="w-full bg-gradient-primary text-primary-foreground py-6 text-base font-bold" disabled={cart.length === 0} onClick={startPayment}>
              <Receipt className="h-5 w-5 mr-2" />Pagar (F6)
            </Button>
          </div>
        </div>

        {/* Sales history drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="border-l border-border bg-card overflow-hidden shrink-0 flex flex-col">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="font-bold text-foreground text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Vendas do Dia</span>
                <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {sales.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-8">Nenhuma venda ainda</p>
                ) : sales.map((sale) => (
                  <div key={sale.id} className="p-3 text-xs space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">#{sale.id} • {sale.time}</span><span className="font-bold text-foreground">{formatPrice(sale.total)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>{sale.customer}</span><span>{sale.items} itens</span></div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sale.payments.map((p, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-[10px]">{p.method} {formatPrice(p.amount)}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <div className="flex justify-between text-sm font-bold text-foreground"><span>Total do Dia</span><span>{formatPrice(dayTotal)}</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== PAYMENT FLOW DIALOG ===== */}
      <Dialog open={paymentStep !== "idle"} onOpenChange={(open) => { if (!open && paymentStep !== "processing") { setPaymentStep("idle"); setPayments([]); } }}>
        <DialogContent className="max-w-md">
          <AnimatePresence mode="wait">
            {/* Step: Select Payment Method */}
            {paymentStep === "select" && (
              <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <DialogHeader>
                  <DialogTitle className="font-display text-lg">
                    {payments.length > 0 ? "Pagamento Parcial" : "Forma de Pagamento"}
                  </DialogTitle>
                </DialogHeader>

                {payments.length > 0 && (
                  <div className="rounded-lg bg-secondary/50 p-3 space-y-1.5">
                    <p className="text-xs text-muted-foreground font-medium">Pagamentos realizados:</p>
                    {payments.map((p, i) => (
                      <div key={i} className="flex justify-between text-sm"><span className="text-foreground">{p.method}</span><span className="font-bold text-foreground">{formatPrice(p.amount)}</span></div>
                    ))}
                    <div className="border-t border-border pt-1.5 mt-1.5 flex justify-between text-sm font-bold">
                      <span className="text-destructive">Restante</span><span className="text-destructive">{formatPrice(remaining)}</span>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{formatPrice(payments.length > 0 ? remaining : cartTotalWithDiscount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{payments.length > 0 ? "valor restante" : `${totalItems} itens`}</p>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Dividir pagamento</Label>
                  <button onClick={() => setSplitMode(!splitMode)} className={`px-3 py-1 rounded-full text-xs border transition-colors ${splitMode ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                    <SplitSquareHorizontal className="h-3 w-3 inline mr-1" />{splitMode ? "Ativado" : "Dividir"}
                  </button>
                </div>

                {splitMode && (
                  <div>
                    <Label className="text-xs">Valor parcial</Label>
                    <Input type="number" placeholder={formatPrice(remaining)} value={splitAmount} onChange={(e) => setSplitAmount(e.target.value)} className="mt-1 bg-secondary border-border" min={0.01} max={remaining} step={0.01} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {allPaymentMethods.map((m) => (
                    <button key={m.id} onClick={() => selectMethod(m.id)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left">
                      <m.icon className={`h-6 w-6 ${m.color}`} />
                      <div>
                        <p className="text-sm font-bold text-foreground">{m.id}</p>
                        <p className="text-[10px] text-muted-foreground">{m.shortcut}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step: Cash */}
            {paymentStep === "cash" && (
              <motion.div key="cash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <DialogHeader><DialogTitle className="font-display flex items-center gap-2"><Banknote className="h-5 w-5 text-green-500" />Pagamento em Dinheiro</DialogTitle></DialogHeader>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Valor a pagar</p>
                  <p className="text-3xl font-bold text-foreground">{formatPrice(currentPayAmount)}</p>
                </div>
                <div>
                  <Label className="text-xs">Valor recebido</Label>
                  <Input type="number" placeholder="0,00" value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} className="mt-1 bg-secondary border-border text-lg h-12 font-bold" autoFocus min={0} step={0.01} />
                </div>
                {/* Quick amounts */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 20, 50, 100, 200].map((v) => (
                    <button key={v} onClick={() => setCashReceived(String(v))} className="py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">R$ {v}</button>
                  ))}
                  <button onClick={() => setCashReceived(String(Math.ceil(currentPayAmount)))} className="py-2 rounded-lg border border-primary text-sm font-medium text-primary hover:bg-primary/10 transition-colors">Exato</button>
                  <button onClick={() => setCashReceived(String(Math.ceil(currentPayAmount / 10) * 10))} className="py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Arred.</button>
                  <button onClick={() => setCashReceived("")} className="py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Limpar</button>
                </div>
                {Number(cashReceived) >= currentPayAmount && (
                  <div className="rounded-lg bg-primary/10 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Troco</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(Number(cashReceived) - currentPayAmount)}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setPaymentStep("select")}>Voltar</Button>
                  <Button className="flex-1 bg-gradient-primary text-primary-foreground" disabled={!cashReceived || Number(cashReceived) < currentPayAmount} onClick={() => processPayment(currentPayAmount)}>
                    Confirmar
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step: Card */}
            {paymentStep === "card" && (
              <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <DialogHeader><DialogTitle className="font-display flex items-center gap-2"><CreditCard className="h-5 w-5 text-blue-500" />Pagamento {selectedMethod}</DialogTitle></DialogHeader>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Valor a cobrar</p>
                  <p className="text-3xl font-bold text-foreground">{formatPrice(currentPayAmount)}</p>
                </div>
                <div>
                  <Label className="text-xs">Bandeira</Label>
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    {["Visa", "Master", "Elo", "Amex"].map((b) => (
                      <button key={b} onClick={() => setCardBrand(b)} className={`py-2 rounded-lg border text-xs font-medium transition-colors ${cardBrand === b ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{b}</button>
                    ))}
                  </div>
                </div>
                {selectedMethod === "Crédito" && (
                  <div>
                    <Label className="text-xs">Parcelas</Label>
                    <Select value={cardInstallments} onValueChange={setCardInstallments}>
                      <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 10, 12].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}x de {formatPrice(currentPayAmount / n)} {n === 1 ? "à vista" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="rounded-lg bg-secondary/50 p-3 text-center text-sm text-muted-foreground">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  Insira ou aproxime o cartão na maquininha
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setPaymentStep("select")}>Voltar</Button>
                  <Button className="flex-1 bg-gradient-primary text-primary-foreground" onClick={() => processPayment(currentPayAmount)}>
                    Processar Pagamento
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step: Pix */}
            {paymentStep === "pix" && (
              <motion.div key="pix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <DialogHeader><DialogTitle className="font-display flex items-center gap-2"><QrCode className="h-5 w-5 text-purple-500" />Pagamento via Pix</DialogTitle></DialogHeader>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Valor</p>
                  <p className="text-3xl font-bold text-foreground">{formatPrice(currentPayAmount)}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 rounded-xl border-2 border-dashed border-border bg-secondary/50 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-24 w-24 text-muted-foreground mx-auto" />
                      <p className="text-[10px] text-muted-foreground mt-2">QR Code Simulado</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Escaneie o QR Code ou copie a chave Pix</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Input value="00020126580014br.gov.bcb.pix..." readOnly className="text-xs bg-secondary border-border h-8" />
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText("00020126580014br.gov.bcb.pix..."); toast.success("Chave copiada!"); }}>Copiar</Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setPaymentStep("select")}>Voltar</Button>
                  <Button className="flex-1 bg-gradient-primary text-primary-foreground" onClick={() => processPayment(currentPayAmount)}>
                    Confirmar Recebimento
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step: Processing */}
            {paymentStep === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-lg font-bold text-foreground">Processando pagamento...</p>
                <p className="text-sm text-muted-foreground">{selectedMethod} • {formatPrice(currentPayAmount)}</p>
                <div className="w-48 mx-auto">
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2 }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step: Approved */}
            {paymentStep === "approved" && (
              <motion.div key="approved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-12 text-center space-y-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                </motion.div>
                <p className="text-xl font-bold text-foreground">Pagamento Aprovado!</p>
                <p className="text-muted-foreground">Venda finalizada com sucesso</p>
              </motion.div>
            )}

            {/* Step: Receipt */}
            {paymentStep === "receipt" && lastSale && (
              <motion.div key="receipt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <DialogHeader><DialogTitle className="font-display flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" />Cupom da Venda</DialogTitle></DialogHeader>

                <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3 font-mono text-xs">
                  <div className="text-center border-b border-dashed border-border pb-3">
                    <p className="font-bold text-foreground text-sm">CIRCULAR u-SHAR</p>
                    <p className="text-muted-foreground">CNPJ: 00.000.000/0001-00</p>
                    <p className="text-muted-foreground">Cupom Não Fiscal</p>
                  </div>

                  <div className="border-b border-dashed border-border pb-3 space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Venda #</span><span className="text-foreground">{lastSale.id}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Data/Hora</span><span className="text-foreground">{new Date().toLocaleDateString("pt-BR")} {lastSale.time}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Caixa</span><span className="text-foreground">{caixaId || "01"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Cliente</span><span className="text-foreground">{lastSale.customer}</span></div>
                  </div>

                  <div className="border-b border-dashed border-border pb-3 space-y-1">
                    <p className="text-muted-foreground font-bold">ITENS</p>
                    <div className="flex justify-between"><span className="text-muted-foreground">{lastSale.items} itens</span></div>
                    {lastSale.discount > 0 && (
                      <div className="flex justify-between text-destructive"><span>Desconto ({lastSale.discount}%)</span><span>-{formatPrice(lastSale.total * lastSale.discount / (100 - lastSale.discount))}</span></div>
                    )}
                    <div className="flex justify-between font-bold text-foreground text-sm pt-1"><span>TOTAL</span><span>{formatPrice(lastSale.total)}</span></div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground font-bold">PAGAMENTO</p>
                    {lastSale.payments.map((p, i) => (
                      <div key={i} className="flex justify-between"><span className="text-foreground">{p.method}</span><span className="text-foreground">{formatPrice(p.amount)}</span></div>
                    ))}
                  </div>

                  <div className="text-center border-t border-dashed border-border pt-3">
                    <p className="text-muted-foreground">Obrigado pela compra!</p>
                    <p className="text-muted-foreground">circular.store</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { toast.success("Cupom enviado para impressão!"); }}>
                    <Printer className="h-4 w-4 mr-2" />Imprimir
                  </Button>
                  <Button className="flex-1 bg-gradient-primary text-primary-foreground" onClick={closeReceipt}>
                    Nova Venda
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDVPage;
