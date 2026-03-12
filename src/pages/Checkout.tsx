import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Truck, CreditCard, ShieldCheck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

const shippingOptions = [
  { id: "pac", label: "PAC", days: "5-8 dias úteis", price: 18.9 },
  { id: "sedex", label: "SEDEX", days: "2-3 dias úteis", price: 32.5 },
  { id: "retirada", label: "Retirar na loja", days: "Disponível em 1h", price: 0 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<"address" | "shipping" | "payment" | "done">("address");
  const [shipping, setShipping] = useState("pac");
  const [address, setAddress] = useState({ cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" });
  const [payment, setPayment] = useState("pix");

  const selectedShipping = shippingOptions.find((s) => s.id === shipping)!;
  const total = totalPrice + selectedShipping.price;
  const formatPrice = (p: number) => `R$ ${p.toFixed(2).replace(".", ",")}`;

  if (items.length === 0 && step !== "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Voltar à loja</Button>
        </div>
      </div>
    );
  }

  const handleFinish = () => {
    clearCart();
    setStep("done");
    toast({ title: "Pedido realizado!", description: "Você receberá a confirmação por e-mail." });
  };

  if (step === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4 max-w-sm">
          <CheckCircle className="h-16 w-16 text-success mx-auto" />
          <h1 className="text-2xl font-bold font-display text-foreground">Pedido Confirmado!</h1>
          <p className="text-muted-foreground text-sm">Obrigado pela sua compra. Você receberá um e-mail com os detalhes do pedido.</p>
          <Button onClick={() => navigate(-2)} className="bg-gradient-primary text-primary-foreground">Voltar à loja</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 flex items-center h-14 gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display font-bold text-foreground text-lg">Checkout</h1>
        </div>
      </header>

      {/* Steps indicator */}
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-2 text-xs">
          {[
            { key: "address", label: "Endereço", icon: MapPin },
            { key: "shipping", label: "Entrega", icon: Truck },
            { key: "payment", label: "Pagamento", icon: CreditCard },
          ].map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-px ${["address", "shipping", "payment"].indexOf(step) >= i ? "bg-primary" : "bg-border"}`} />}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${step === s.key ? "bg-primary text-primary-foreground" : ["address", "shipping", "payment"].indexOf(step) > i ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                <s.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {step === "address" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h2 className="font-display font-bold text-foreground flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Endereço de Entrega</h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1"><Label>CEP</Label><Input placeholder="00000-000" value={address.cep} onChange={(e) => setAddress({ ...address, cep: e.target.value })} className="mt-1 bg-secondary border-border" /></div>
                  <div className="col-span-2"><Label>Rua</Label><Input placeholder="Nome da rua" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="mt-1 bg-secondary border-border" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Número</Label><Input placeholder="123" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} className="mt-1 bg-secondary border-border" /></div>
                  <div className="col-span-2"><Label>Complemento</Label><Input placeholder="Apto, bloco..." value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} className="mt-1 bg-secondary border-border" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Bairro</Label><Input placeholder="Bairro" value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} className="mt-1 bg-secondary border-border" /></div>
                  <div><Label>Cidade</Label><Input placeholder="Cidade" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="mt-1 bg-secondary border-border" /></div>
                  <div><Label>Estado</Label><Input placeholder="UF" maxLength={2} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="mt-1 bg-secondary border-border" /></div>
                </div>
                <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={() => setStep("shipping")}>Continuar para Entrega</Button>
              </motion.div>
            )}

            {step === "shipping" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h2 className="font-display font-bold text-foreground flex items-center gap-2"><Truck className="h-4 w-4 text-primary" />Método de Entrega</h2>
                <RadioGroup value={shipping} onValueChange={setShipping} className="space-y-3">
                  {shippingOptions.map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${shipping === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <RadioGroupItem value={opt.id} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.days}</p>
                      </div>
                      <span className={`text-sm font-bold ${opt.price === 0 ? "text-success" : "text-foreground"}`}>
                        {opt.price === 0 ? "Grátis" : formatPrice(opt.price)}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("address")}>Voltar</Button>
                  <Button className="flex-1 bg-gradient-primary text-primary-foreground" onClick={() => setStep("payment")}>Continuar para Pagamento</Button>
                </div>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h2 className="font-display font-bold text-foreground flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" />Pagamento</h2>
                <RadioGroup value={payment} onValueChange={setPayment} className="space-y-3">
                  {[
                    { id: "pix", label: "Pix", desc: "Aprovação instantânea" },
                    { id: "cartao", label: "Cartão de Crédito", desc: "Até 3x sem juros" },
                    { id: "boleto", label: "Boleto Bancário", desc: "Vencimento em 3 dias úteis" },
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${payment === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <RadioGroupItem value={opt.id} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                {payment === "cartao" && (
                  <div className="space-y-3 pt-2">
                    <div><Label>Número do Cartão</Label><Input placeholder="0000 0000 0000 0000" className="mt-1 bg-secondary border-border" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Validade</Label><Input placeholder="MM/AA" className="mt-1 bg-secondary border-border" /></div>
                      <div><Label>CVV</Label><Input placeholder="000" className="mt-1 bg-secondary border-border" /></div>
                    </div>
                    <div><Label>Nome no Cartão</Label><Input placeholder="Como impresso no cartão" className="mt-1 bg-secondary border-border" /></div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("shipping")}>Voltar</Button>
                  <Button className="flex-1 bg-gradient-primary text-primary-foreground" onClick={handleFinish}>
                    <ShieldCheck className="h-4 w-4 mr-2" />Finalizar Pedido
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-4 sticky top-20">
              <h3 className="font-display font-bold text-foreground text-sm">Resumo do Pedido</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary/30 border border-border flex items-center justify-center text-xl shrink-0">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground line-clamp-1">{item.name}</p>
                      {item.size && <p className="text-[10px] text-muted-foreground">Tam: {item.size}</p>}
                      <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-foreground shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Frete ({selectedShipping.label})</span><span className={selectedShipping.price === 0 ? "text-success" : "text-foreground"}>{selectedShipping.price === 0 ? "Grátis" : formatPrice(selectedShipping.price)}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span className="text-foreground">Total</span><span className="text-foreground">{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
