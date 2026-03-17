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

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <motion.p id={id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-destructive">
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
      if (value.length >= 2) value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    if (field === "cvv") value = value.replace(/\D/g, "").slice(0, 3);
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

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

  const showError = (field: string, errors: FieldErrors) => (touched[field] || triedAdvance ? errors[field] : undefined);

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
      <main id="main-content" tabIndex={-1} className="pt-28 pb-16">
        <section aria-labelledby="criar-loja-heading">
          <div className="container mx-auto max-w-2xl px-4">
            <header className="mb-10 space-y-4 text-center">
              <h1 id="criar-loja-heading" className="font-display text-3xl font-bold text-foreground">Criar minha loja</h1>
              <p className="text-sm text-muted-foreground">Siga as etapas abaixo para configurar sua loja com acessibilidade e navegação guiada.</p>
            </header>

            <ol className="mb-10 flex items-center justify-center gap-2" aria-label="Etapas de criação da loja">
              {steps.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      i <= step ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    }`}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <s.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`h-0.5 w-8 rounded ${i < step ? "bg-primary" : "bg-border"}`} aria-hidden="true" />}
                </li>
              ))}
            </ol>

            <p className="sr-only" aria-live="polite">Etapa atual: {steps[step].label}</p>

            <section className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm" aria-label="Resumo do plano selecionado">
              <div>
                <span className="text-muted-foreground">Plano:</span>{" "}
                <span className="font-semibold text-foreground">{plan.name}</span>
                <span className="ml-2 text-muted-foreground">({billingParam})</span>
              </div>
              <span className="font-bold text-foreground">
                {plan.price === 0 ? "Grátis" : `R$ ${price.toFixed(2).replace(".", ",")}${billingParam === "anual" ? "/ano" : "/mês"}`}
              </span>
            </section>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.section key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5" aria-labelledby="store-data-heading">
                  <form className="space-y-4 rounded-xl border border-border bg-card p-6" aria-describedby="store-data-help">
                    <h2 id="store-data-heading" className="font-display text-lg font-bold text-foreground">Dados da sua loja</h2>
                    <p id="store-data-help" className="text-sm text-muted-foreground">Preencha os campos obrigatórios para continuar para a próxima etapa.</p>

                    <div>
                      <Label htmlFor="store-name">Nome da Loja *</Label>
                      <Input
                        id="store-name"
                        placeholder="Minha Loja Circular"
                        value={storeData.nome}
                        onChange={(e) => handleStoreChange("nome", e.target.value)}
                        onBlur={() => markTouched("nome")}
                        className={showError("nome", storeErrors) ? "border-destructive" : ""}
                        maxLength={60}
                        aria-invalid={Boolean(showError("nome", storeErrors))}
                        aria-describedby={showError("nome", storeErrors) ? "store-name-error" : undefined}
                      />
                      <FieldError id="store-name-error" message={showError("nome", storeErrors)} />
                    </div>

                    <div>
                      <Label htmlFor="store-slug">URL da Loja</Label>
                      <div className={`flex items-center overflow-hidden rounded-md border ${showError("slug", storeErrors) ? "border-destructive" : "border-border"}`}>
                        <span className="whitespace-nowrap border-r border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">circular.store/</span>
                        <Input
                          id="store-slug"
                          className="rounded-none border-0"
                          value={storeData.slug}
                          onChange={(e) => setStoreData((p) => ({ ...p, slug: e.target.value }))}
                          onBlur={() => markTouched("slug")}
                          aria-invalid={Boolean(showError("slug", storeErrors))}
                          aria-describedby={showError("slug", storeErrors) ? "store-slug-error" : undefined}
                        />
                      </div>
                      <FieldError id="store-slug-error" message={showError("slug", storeErrors)} />
                    </div>

                    <div>
                      <Label htmlFor="store-email">E-mail *</Label>
                      <Input
                        id="store-email"
                        type="email"
                        placeholder="contato@minhaloja.com"
                        value={storeData.email}
                        onChange={(e) => handleStoreChange("email", e.target.value)}
                        onBlur={() => markTouched("email")}
                        className={showError("email", storeErrors) ? "border-destructive" : ""}
                        maxLength={255}
                        autoComplete="email"
                        aria-invalid={Boolean(showError("email", storeErrors))}
                        aria-describedby={showError("email", storeErrors) ? "store-email-error" : undefined}
                      />
                      <FieldError id="store-email-error" message={showError("email", storeErrors)} />
                    </div>

                    <div>
                      <Label htmlFor="store-phone">Telefone</Label>
                      <Input
                        id="store-phone"
                        placeholder="(11) 99999-9999"
                        value={storeData.telefone}
                        onChange={(e) => handleStoreChange("telefone", e.target.value)}
                        autoComplete="tel"
                      />
                    </div>
                  </form>
                </motion.section>
              )}

              {step === 1 && (
                <motion.section key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5" aria-labelledby="payment-heading">
                  <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                    <h2 id="payment-heading" className="font-display text-lg font-bold text-foreground">
                      {plan.price === 0 ? "Confirme seu plano gratuito" : "Dados de Pagamento"}
                    </h2>

                    {plan.price === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        O plano Starter é gratuito. Clique em confirmar para criar sua loja agora mesmo.
                      </p>
                    ) : (
                      <fieldset className="space-y-3" aria-describedby="payment-help">
                        <legend className="sr-only">Informações do cartão</legend>
                        <p id="payment-help" className="text-sm text-muted-foreground">Digite os dados do cartão para concluir a criação da loja.</p>

                        <div>
                          <Label htmlFor="card-number">Número do Cartão</Label>
                          <Input
                            id="card-number"
                            placeholder="0000 0000 0000 0000"
                            value={cardData.number}
                            onChange={(e) => handleCardChange("number", e.target.value)}
                            onBlur={() => markTouched("number")}
                            className={showError("number", cardErrors) ? "border-destructive" : ""}
                            inputMode="numeric"
                            autoComplete="cc-number"
                            aria-invalid={Boolean(showError("number", cardErrors))}
                            aria-describedby={showError("number", cardErrors) ? "card-number-error" : undefined}
                          />
                          <FieldError id="card-number-error" message={showError("number", cardErrors)} />
                        </div>

                        <div>
                          <Label htmlFor="card-name">Nome no Cartão</Label>
                          <Input
                            id="card-name"
                            placeholder="MARIA SILVA"
                            value={cardData.name}
                            onChange={(e) => handleCardChange("name", e.target.value.toUpperCase())}
                            onBlur={() => markTouched("name")}
                            className={showError("name", cardErrors) ? "border-destructive" : ""}
                            autoComplete="cc-name"
                            aria-invalid={Boolean(showError("name", cardErrors))}
                            aria-describedby={showError("name", cardErrors) ? "card-name-error" : undefined}
                          />
                          <FieldError id="card-name-error" message={showError("name", cardErrors)} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="card-expiry">Validade</Label>
                            <Input
                              id="card-expiry"
                              placeholder="MM/AA"
                              value={cardData.expiry}
                              onChange={(e) => handleCardChange("expiry", e.target.value)}
                              onBlur={() => markTouched("expiry")}
                              className={showError("expiry", cardErrors) ? "border-destructive" : ""}
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              aria-invalid={Boolean(showError("expiry", cardErrors))}
                              aria-describedby={showError("expiry", cardErrors) ? "card-expiry-error" : undefined}
                            />
                            <FieldError id="card-expiry-error" message={showError("expiry", cardErrors)} />
                          </div>
                          <div>
                            <Label htmlFor="card-cvv">CVV</Label>
                            <Input
                              id="card-cvv"
                              placeholder="123"
                              value={cardData.cvv}
                              onChange={(e) => handleCardChange("cvv", e.target.value)}
                              onBlur={() => markTouched("cvv")}
                              className={showError("cvv", cardErrors) ? "border-destructive" : ""}
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              aria-invalid={Boolean(showError("cvv", cardErrors))}
                              aria-describedby={showError("cvv", cardErrors) ? "card-cvv-error" : undefined}
                            />
                            <FieldError id="card-cvv-error" message={showError("cvv", cardErrors)} />
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Pagamento seguro processado via Stripe (simulado)</span>
                        </div>
                      </fieldset>
                    )}
                  </div>
                </motion.section>
              )}

              {step === 2 && (
                <motion.section key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5" aria-labelledby="success-heading">
                  <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <h2 id="success-heading" className="font-display text-2xl font-bold text-foreground">Loja criada com sucesso! 🎉</h2>
                    <p className="mx-auto max-w-md text-muted-foreground" role="status">
                      Sua loja <strong className="text-foreground">{storeData.nome || "Minha Loja"}</strong> está pronta!
                      Acesse o painel administrativo para configurar seus produtos e começar a vender.
                    </p>

                    <div className="mx-auto max-w-sm space-y-2 rounded-lg border border-border bg-card p-4 text-left">
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
                        <span className="font-bold text-foreground">{plan.price === 0 ? "Grátis" : `R$ ${price.toFixed(2).replace(".", ",")}`}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-sm">
                        <span className="text-muted-foreground">URL</span>
                        <span className="break-all font-medium text-accent">circular.store/{storeData.slug || "minha-loja"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
                      <Button onClick={() => navigate("/dashboard")} className="bg-gradient-primary">
                        Acessar Painel
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button variant="outline" onClick={() => window.open(`/loja/${storeData.slug || "minha-loja"}`, "_blank")}>
                        Ver minha loja
                      </Button>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {step < 2 && (
              <nav className="mt-6 flex justify-between" aria-label="Navegação entre etapas">
                <Button variant="outline" onClick={() => (step === 0 ? navigate("/planos") : setStep((s) => s - 1))}>
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  Voltar
                </Button>
                <Button onClick={handleNext} disabled={processing} aria-busy={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Processando...
                    </>
                  ) : (
                    <>
                      {step === 1 ? (plan.price === 0 ? "Confirmar" : "Pagar e Criar Loja") : "Próximo"}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CriarLoja;
