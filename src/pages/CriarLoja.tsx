import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Store, CreditCard, CheckCircle2, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plans: Record<string, { name: string; price: number }> = {
  starter: { name: "Starter", price: 0 },
  essential: { name: "Essential", price: 59.9 },
  growth: { name: "Growth", price: 149.9 },
  scale: { name: "Scale", price: 420.9 },
  executive: { name: "Executive", price: 199.9 },
};

const steps = [
  { label: "Dados da Loja", icon: Store },
  { label: "Pagamento", icon: CreditCard },
  { label: "Confirmação", icon: CheckCircle2 },
];

interface StoreData {
  nome: string;
  slug: string;
  email: string;
  telefone: string;
}

type FieldErrors = Partial<Record<string, string>>;

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-destructive mt-1">
      {message}
    </motion.p>
  ) : null;

const CriarLoja = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const planKey = params.get("plano") || "starter";
  const billingParam = params.get("billing") || "mensal";
  const plan = plans[planKey] || plans.starter;

  const [step, setStep] = useState(0);
  const [storeData, setStoreData] = useState<StoreData>({ nome: "", slug: "", email: "", telefone: "" });
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [triedAdvance, setTriedAdvance] = useState(false);

  const price = billingParam === "anual" ? plan.price * 12 * 0.8 : plan.price;

  const handleStoreChange = (field: keyof StoreData, value: string) => {
    setStoreData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "nome" ? { slug: value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") } : {}),
    }));
  };

  const handleCardChange = (field: string, value: string) => {
    if (field === "number") value = value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
    if (field === "expiry") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (field === "cvv") value = value.replace(/\D/g, "").slice(0, 3);
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  // Validation
  const getStoreErrors = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (storeData.nome.length === 0) errors.nome = "Nome da loja é obrigatório";
    else if (storeData.nome.length < 3) errors.nome = "Nome deve ter pelo menos 3 caracteres";
    else if (storeData.nome.length > 60) errors.nome = "Nome deve ter no máximo 60 caracteres";
    if (storeData.slug.length === 0) errors.slug = "URL é obrigatória";
    else if (!/^[a-z0-9-]+$/.test(storeData.slug)) errors.slug = "URL deve conter apenas letras minúsculas, números e hífens";
    if (storeData.email.length === 0) errors.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeData.email)) errors.email = "E-mail inválido";
    else if (storeData.email.length > 255) errors.email = "E-mail muito longo";
    return errors;
  };

  const getCardErrors = (): FieldErrors => {
    if (plan.price === 0) return {};
    const errors: FieldErrors = {};
    const num = cardData.number.replace(/\s/g, "");
    if (num.length === 0) errors.number = "Número do cartão é obrigatório";
    else if (num.length < 16) errors.number = "Número deve ter 16 dígitos";
    if (cardData.name.length === 0) errors.name = "Nome no cartão é obrigatório";
    else if (cardData.name.length < 3) errors.name = "Nome deve ter pelo menos 3 caracteres";
    if (cardData.expiry.length === 0) errors.expiry = "Validade é obrigatória";
    else if (cardData.expiry.length < 5) errors.expiry = "Formato: MM/AA";
    if (cardData.cvv.length === 0) errors.cvv = "CVV é obrigatório";
    else if (cardData.cvv.length < 3) errors.cvv = "CVV deve ter 3 dígitos";
    return errors;
  };

  const storeErrors = getStoreErrors();
  const cardErrors = getCardErrors();

  const showError = (field: string, errors: FieldErrors) =>
    (touched[field] || triedAdvance) ? errors[field] : undefined;

  const canAdvance = () => {
    if (step === 0) return Object.keys(storeErrors).length === 0;
    if (step === 1) return Object.keys(cardErrors).length === 0;
    return true;
  };

  const handleNext = async () => {
    setTriedAdvance(true);
    if (!canAdvance()) return;
    setTriedAdvance(false);

    if (step === 1) {
      setProcessing(true);
      await new Promise((r) => setTimeout(r, 2000));
      setProcessing(false);
      toast.success("Pagamento processado com sucesso!");
      setStep(2);
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  i <= step ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  <s.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 rounded ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {/* Plan summary strip */}
          <div className="mb-6 p-3 rounded-xl border border-border bg-card flex items-center justify-between text-sm">
            <div>
              <span className="text-muted-foreground">Plano:</span>{" "}
              <span className="font-semibold text-foreground">{plan.name}</span>
              <span className="text-muted-foreground ml-2">({billingParam})</span>
            </div>
            <span className="font-bold text-foreground">
              {plan.price === 0 ? "Grátis" : `R$ ${price.toFixed(2).replace(".", ",")}${billingParam === "anual" ? "/ano" : "/mês"}`}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                  <h2 className="text-lg font-bold font-display text-foreground">Dados da sua loja</h2>
                  <div className="space-y-3">
                    <div>
                      <Label>Nome da Loja *</Label>
                      <Input
                        placeholder="Minha Loja Circular"
                        value={storeData.nome}
                        onChange={(e) => handleStoreChange("nome", e.target.value)}
                        onBlur={() => markTouched("nome")}
                        className={showError("nome", storeErrors) ? "border-destructive" : ""}
                        maxLength={60}
                      />
                      <FieldError message={showError("nome", storeErrors)} />
                    </div>
                    <div>
                      <Label>URL da Loja</Label>
                      <div className={`flex items-center gap-0 rounded-md border overflow-hidden ${showError("slug", storeErrors) ? "border-destructive" : "border-border"}`}>
                        <span className="px-3 py-2 bg-secondary text-muted-foreground text-sm border-r border-border whitespace-nowrap">circular.store/</span>
                        <Input
                          className="border-0 rounded-none"
                          value={storeData.slug}
                          onChange={(e) => setStoreData((p) => ({ ...p, slug: e.target.value }))}
                          onBlur={() => markTouched("slug")}
                        />
                      </div>
                      <FieldError message={showError("slug", storeErrors)} />
                    </div>
                    <div>
                      <Label>E-mail *</Label>
                      <Input
                        type="email"
                        placeholder="contato@minhaloja.com"
                        value={storeData.email}
                        onChange={(e) => handleStoreChange("email", e.target.value)}
                        onBlur={() => markTouched("email")}
                        className={showError("email", storeErrors) ? "border-destructive" : ""}
                        maxLength={255}
                      />
                      <FieldError message={showError("email", storeErrors)} />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input placeholder="(11) 99999-9999" value={storeData.telefone} onChange={(e) => handleStoreChange("telefone", e.target.value)} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                  <h2 className="text-lg font-bold font-display text-foreground">
                    {plan.price === 0 ? "Confirme seu plano gratuito" : "Dados de Pagamento"}
                  </h2>

                  {plan.price === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      O plano Starter é gratuito. Clique em "Confirmar" para criar sua loja agora mesmo!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label>Número do Cartão</Label>
                        <Input
                          placeholder="0000 0000 0000 0000"
                          value={cardData.number}
                          onChange={(e) => handleCardChange("number", e.target.value)}
                          onBlur={() => markTouched("number")}
                          className={showError("number", cardErrors) ? "border-destructive" : ""}
                        />
                        <FieldError message={showError("number", cardErrors)} />
                      </div>
                      <div>
                        <Label>Nome no Cartão</Label>
                        <Input
                          placeholder="MARIA SILVA"
                          value={cardData.name}
                          onChange={(e) => handleCardChange("name", e.target.value.toUpperCase())}
                          onBlur={() => markTouched("name")}
                          className={showError("name", cardErrors) ? "border-destructive" : ""}
                        />
                        <FieldError message={showError("name", cardErrors)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Validade</Label>
                          <Input
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => handleCardChange("expiry", e.target.value)}
                            onBlur={() => markTouched("expiry")}
                            className={showError("expiry", cardErrors) ? "border-destructive" : ""}
                          />
                          <FieldError message={showError("expiry", cardErrors)} />
                        </div>
                        <div>
                          <Label>CVV</Label>
                          <Input
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => handleCardChange("cvv", e.target.value)}
                            onBlur={() => markTouched("cvv")}
                            className={showError("cvv", cardErrors) ? "border-destructive" : ""}
                          />
                          <FieldError message={showError("cvv", cardErrors)} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>Pagamento seguro processado via Stripe (simulado)</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                <div className="p-8 rounded-xl border border-primary/30 bg-primary/5 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground">Loja criada com sucesso! 🎉</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Sua loja <strong className="text-foreground">{storeData.nome || "Minha Loja"}</strong> está pronta! 
                    Acesse o painel administrativo para configurar seus produtos e começar a vender.
                  </p>

                  <div className="p-4 rounded-lg border border-border bg-card text-left space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Plano</span>
                      <span className="font-medium text-foreground">{plan.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cobrança</span>
                      <span className="font-medium text-foreground">{billingParam === "anual" ? "Anual" : "Mensal"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor</span>
                      <span className="font-bold text-foreground">
                        {plan.price === 0 ? "Grátis" : `R$ ${price.toFixed(2).replace(".", ",")}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">URL</span>
                      <span className="font-medium text-accent">circular.store/{storeData.slug || "minha-loja"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button onClick={() => navigate("/dashboard")} className="bg-gradient-primary">
                      Acessar Painel
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`/loja/${storeData.slug || "minha-loja"}`, "_blank")}>
                      Ver minha loja
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 2 && (
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => step === 0 ? navigate("/planos") : setStep((s) => s - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={handleNext} disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {step === 1 ? (plan.price === 0 ? "Confirmar" : "Pagar e Criar Loja") : "Próximo"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CriarLoja;
