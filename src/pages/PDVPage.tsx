import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone,
  Receipt, ArrowLeft, Package, ShoppingCart, X, Barcode,
  Clock, User, PercentCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { storeProducts } from "@/data/store";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku: string;
}

interface RegisteredSale {
  id: number;
  time: string;
  items: number;
  total: number;
  payment: string;
  customer: string;
}

const formatPrice = (p: number) => `R$ ${p.toFixed(2).replace(".", ",")}`;

const paymentMethods = [
  { id: "Dinheiro", icon: Banknote, shortcut: "F2" },
  { id: "Cartão", icon: CreditCard, shortcut: "F3" },
  { id: "Pix", icon: Smartphone, shortcut: "F4" },
];

const PDVPage = () => {
  const navigate = useNavigate();
  const { id: caixaId } = useParams();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState("Dinheiro");
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [sales, setSales] = useState<RegisteredSale[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const cartTotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const cartTotalWithDiscount = cartTotal - (cartTotal * discount) / 100;
  const totalItems = cart.reduce((a, i) => a + i.quantity, 0);

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

  const handleSale = useCallback(() => {
    if (cart.length === 0) return;
    const now = new Date();
    const newSale: RegisteredSale = {
      id: sales.length + 1,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      items: totalItems,
      total: cartTotalWithDiscount,
      payment,
      customer: customerName || "Cliente Avulso",
    };
    setSales((prev) => [newSale, ...prev]);
    setCart([]);
    setCustomerName("");
    setDiscount(0);
    toast.success(`Venda de ${formatPrice(cartTotalWithDiscount)} registrada via ${payment}!`);
  }, [cart, totalItems, cartTotalWithDiscount, payment, customerName, sales.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F1") { e.preventDefault(); document.getElementById("pdv-search")?.focus(); }
      if (e.key === "F2") { e.preventDefault(); setPayment("Dinheiro"); }
      if (e.key === "F3") { e.preventDefault(); setPayment("Cartão"); }
      if (e.key === "F4") { e.preventDefault(); setPayment("Pix"); }
      if (e.key === "F6") { e.preventDefault(); handleSale(); }
      if (e.key === "Escape") { e.preventDefault(); setSearch(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSale]);

  const dayTotal = sales.reduce((a, s) => a + s.total, 0);

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="h-12 bg-card border-b border-border flex items-center px-3 gap-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold text-foreground">Caixa {caixaId || "01"}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>F1 Buscar</span>
          <span>F2-F4 Pagamento</span>
          <span>F6 Finalizar</span>
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
          {/* Search */}
          <div className="p-3 border-b border-border bg-card/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="pdv-search"
                placeholder="Buscar produto por nome ou código (F1)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border text-base h-11"
                autoFocus
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filteredProducts.map((product) => (
                <motion.button
                  key={product.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                  className="flex flex-col items-center p-3 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-center group"
                >
                  <span className="text-3xl mb-2">{product.image}</span>
                  <span className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{product.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">{product.sku}</span>
                  <span className="text-sm font-bold text-primary mt-1">{formatPrice(product.price)}</span>
                  <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1">+ Adicionar</span>
                </motion.button>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Package className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart + Payment */}
        <div className="w-[380px] border-l border-border bg-card flex flex-col shrink-0">
          {/* Cart header */}
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground text-sm">Carrinho</span>
              {totalItems > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">{totalItems}</span>
              )}
            </div>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-destructive hover:text-destructive/80">Limpar</button>
            )}
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-6">
                  <Barcode className="h-10 w-10 mb-3 opacity-40" />
                  <p className="text-sm text-center">Selecione produtos à esquerda ou use a busca</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {cart.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-3 flex gap-3"
                    >
                      <span className="text-2xl shrink-0">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(item.price)} un.</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-bold w-8 text-center text-foreground">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                            <Plus className="h-3 w-3" />
                          </button>
                          <button onClick={() => updateQty(item.id, 0)} className="ml-auto text-destructive hover:text-destructive/80">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground shrink-0 self-start">{formatPrice(item.price * item.quantity)}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Payment section */}
          <div className="border-t border-border p-3 space-y-3 bg-card">
            {/* Customer */}
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Input
                placeholder="Cliente (opcional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-8 text-xs bg-secondary border-border"
              />
            </div>

            {/* Discount */}
            <div className="flex items-center gap-2">
              <PercentCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Input
                type="number"
                placeholder="Desconto %"
                value={discount || ""}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="h-8 text-xs bg-secondary border-border w-24"
                min={0}
                max={100}
              />
              {discount > 0 && <span className="text-xs text-destructive">-{formatPrice((cartTotal * discount) / 100)}</span>}
            </div>

            {/* Payment method */}
            <div className="grid grid-cols-3 gap-1.5">
              {paymentMethods.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPayment(opt.id)}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-lg border text-xs transition-colors ${
                    payment === opt.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <opt.icon className="h-4 w-4" />
                  <span>{opt.id}</span>
                  <span className="text-[10px] opacity-60">{opt.shortcut}</span>
                </button>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal ({totalItems} itens)</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-destructive">
                  <span>Desconto ({discount}%)</span>
                  <span>-{formatPrice((cartTotal * discount) / 100)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-foreground pt-1">
                <span>Total</span>
                <span>{formatPrice(cartTotalWithDiscount)}</span>
              </div>
            </div>

            {/* Finalize */}
            <Button
              className="w-full bg-gradient-primary text-primary-foreground py-6 text-base font-bold"
              disabled={cart.length === 0}
              onClick={handleSale}
            >
              <Receipt className="h-5 w-5 mr-2" />
              Finalizar Venda (F6)
            </Button>
          </div>
        </div>

        {/* Sales history drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border bg-card overflow-hidden shrink-0 flex flex-col"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Vendas do Dia
                </span>
                <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {sales.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-8">Nenhuma venda ainda</p>
                ) : (
                  sales.map((sale) => (
                    <div key={sale.id} className="p-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{sale.time}</span>
                        <span className="font-bold text-foreground">{formatPrice(sale.total)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{sale.customer}</span>
                        <span className="px-1.5 py-0.5 rounded bg-secondary text-foreground">{sale.payment}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-border">
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Total do Dia</span>
                  <span>{formatPrice(dayTotal)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PDVPage;
