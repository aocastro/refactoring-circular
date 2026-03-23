import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, CreditCard, CheckCircle2, ArrowLeft, ArrowRight, Loader2,
  UserPlus, ShoppingBag, LayoutTemplate, Crown, Zap, Rocket, Star, Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PlanSelectionStep from "@/components/criar-loja/PlanSelectionStep";
import TemplateSelectionStep from "@/components/criar-loja/TemplateSelectionStep";

/* ── Plan data ─────────────────────────────────────────── */
const plansData = [
  { key: "starter", name: "Starter", monthlyPrice: 0, annualPrice: 0, tagline: "Para começar", icon: Zap },
  { key: "essential", name: "Essential", monthlyPrice: 59.9, annualPrice: 718.8, tagline: "Para crescer", icon: Star },
  { key: "growth", name: "Growth", monthlyPrice: 149.9, annualPrice: 1798.8, tagline: "Mais popular", icon: Rocket, highlight: true },
  { key: "scale", name: "Scale", monthlyPrice: 420.9, annualPrice: 5050.8, tagline: "Para escalar", icon: Crown },
  { key: "executive", name: "Executive", monthlyPrice: 199.9, annualPrice: 2398.8, tagline: "Para líderes", icon: Gem },
];

/* ── E-commerce templates ──────────────────────────────── */
import templateMinimalImg from "@/assets/templates/template-minimal.jpg";
import templateBoldImg from "@/assets/templates/template-bold.jpg";
import templateClassicImg from "@/assets/templates/template-classic.jpg";
import templateModernImg from "@/assets/templates/template-modern.jpg";
import templateColorfulImg from "@/assets/templates/template-colorful.jpg";
import templateEcoImg from "@/assets/templates/template-eco.jpg";
import templateLuxuryImg from "@/assets/templates/template-luxury.jpg";
import templateTechImg from "@/assets/templates/template-tech.jpg";

const templates = [
  { id: "minimal", name: "Minimalista", description: "Design limpo com foco no produto, tipografia elegante e muito espaço em branco.", image: templateMinimalImg },
  { id: "bold", name: "Bold & Vibrante", description: "Cores intensas, tipografia impactante e layout ousado para marcas que querem se destacar.", image: templateBoldImg },
  { id: "classic", name: "Clássico Elegante", description: "Inspirado em revistas de moda, com serifas sofisticadas e paleta neutra premium.", image: templateClassicImg },
  { id: "modern", name: "Moderno Escuro", description: "Dark mode nativo, linhas geométricas e visual high-tech para uma experiência premium.", image: templateModernImg },
  { id: "colorful", name: "Colorido & Divertido", description: "Paleta multicolorida, ilustrações e micro-animações para marcas jovens e criativas.", image: templateColorfulImg },
  { id: "eco", name: "Eco-Friendly", description: "Tons terrosos, motivos naturais e selos de sustentabilidade para marcas conscientes.", image: templateEcoImg },
  { id: "luxury", name: "Luxo Dourado", description: "Preto e dourado, tipografia serifada e texturas de mármore para boutiques premium.", image: templateLuxuryImg },
  { id: "tech", name: "Tech Startup", description: "Azul neon e navy, layout futurista e gradientes modernos para lojas de tecnologia.", image: templateTechImg },
];

/* ── Steps ─────────────────────────────────────────────── */
const stepsMeta = [
  { label: "Plano", icon: ShoppingBag },
  { label: "Conta", icon: UserPlus },
  { label: "Sua Loja", icon: Store },
  { label: "E-commerce", icon: ShoppingBag },
  { label: "Template", icon: LayoutTemplate },
  { label: "Pronto!", icon: CheckCircle2 },
];

type FieldErrors = Partial<Record<string, string>>;

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <motion.p id={id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-destructive">{message}</motion.p>
  ) : null;

const CriarLoja = () => {
  const navigate = useNavigate();

  /* state */
  const [step, setStep] = useState(0);
  const [billing, setBilling] = useState<"mensal" | "anual">("mensal");
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [accountData, setAccountData] = useState({ nome: "", email: "", senha: "" });
  const [storeData, setStoreData] = useState({ nome: "", slug: "", telefone: "" });
  const [wantsEcommerce, setWantsEcommerce] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [processing, setProcessing] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [triedAdvance, setTriedAdvance] = useState(false);

  const plan = plansData.find((p) => p.key === selectedPlan) || plansData[2];
  const price = billing === "anual" ? plan.annualPrice : plan.monthlyPrice;

  const markTouched = (f: string) => setTouched((p) => ({ ...p, [f]: true }));
  const showErr = (f: string, errs: FieldErrors) => (touched[f] || triedAdvance ? errs[f] : undefined);

  /* visible steps (skip template if no ecommerce) */
  const visibleSteps = stepsMeta.filter((_, i) => {
    if (i === 5 && !wantsEcommerce) return false; // hide Template step
    return true;
  });

  /* map logical step index to actual step index */
  const getActualStep = (logicalStep: number) => {
    if (!wantsEcommerce && logicalStep >= 5) return logicalStep + 1;
    return logicalStep;
  };
  const actualStep = getActualStep(step);

  /* ── Validations ─────────────────────────────── */

  const getAccountErrors = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!accountData.nome.trim()) errors.nome = "Nome é obrigatório";
    if (!accountData.email.trim()) errors.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) errors.email = "E-mail inválido";
    if (!accountData.senha) errors.senha = "Senha é obrigatória";
    else if (accountData.senha.length < 6) errors.senha = "Mínimo 6 caracteres";
    return errors;
  };

  const getStoreErrors = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!storeData.nome.trim()) errors.nome = "Nome da loja é obrigatório";
    else if (storeData.nome.length < 3) errors.nome = "Mínimo 3 caracteres";
    if (!storeData.slug) errors.slug = "URL é obrigatória";
    else if (!/^[a-z0-9-]+$/.test(storeData.slug)) errors.slug = "Apenas letras minúsculas, números e hífens";
    return errors;
  };

  const accountErrors = getAccountErrors();
  const storeErrors = getStoreErrors();

  const canAdvance = () => {
    if (step === 0) return true; // plan always selected
    if (step === 1) return Object.keys(accountErrors).length === 0;
    if (step === 2) return Object.keys(storeErrors).length === 0;
    return true;
  };

  const handleStoreChange = (field: string, value: string) => {
    setStoreData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "nome" ? { slug: value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") } : {}),
    }));
  };

  /* ── Navigation ──────────────────────────────── */
  const totalSteps = wantsEcommerce ? 7 : 6;
  const lastContentStep = totalSteps - 2; // last step before "Pronto!"

  const handleNext = async () => {
    setTriedAdvance(true);
    if (!canAdvance()) return;
    setTriedAdvance(false);
    setTouched({});

    // E-commerce decision step
    if (step === 3 && !wantsEcommerce) {
      // Skip template, go to final
      finishSetup();
      setStep(wantsEcommerce ? 5 : 4);
      return;
    }

    // Template step (last before done)
    if ((wantsEcommerce && step === 4) || (!wantsEcommerce && step === 3)) {
      if (wantsEcommerce && step === 4) {
        finishSetup();
        setStep(5);
        return;
      }
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) { navigate("/"); return; }
    // If we're on the final step and skipped template
    if (!wantsEcommerce && actualStep === 5) { setStep(3); return; }
    setStep((s) => s - 1);
    setTriedAdvance(false);
  };

  const finishSetup = () => {
    // Save user credentials
    const userData = { name: accountData.nome, email: accountData.email };
    localStorage.setItem("user", JSON.stringify(userData));

    // Save store config so it persists across sessions
    const storeConfig = {
      nome: storeData.nome,
      slug: storeData.slug || "minha-loja",
      telefone: storeData.telefone,
      plan: plan.key,
      planName: plan.name,
      ecommerce: wantsEcommerce,
      template: wantsEcommerce ? selectedTemplate : null,
      templateName: wantsEcommerce ? templates.find((t) => t.id === selectedTemplate)?.name : null,
      createdAt: new Date().toISOString(),
      trialEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem("storeConfig", JSON.stringify(storeConfig));

    // Save credentials for login (mock auth registry)
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const exists = registeredUsers.some((u: { email: string }) => u.email === accountData.email);
    if (!exists) {
      registeredUsers.push({ name: accountData.nome, email: accountData.email, password: accountData.senha });
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    }

    toast.success("Loja criada com sucesso! 🎉");
  };

  const isFinalStep = step === (wantsEcommerce ? 5 : 4);
  const showNavButtons = !isFinalStep;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-28 pb-16">
        <section aria-labelledby="criar-loja-heading">
          <div className="container mx-auto max-w-3xl px-4">
            <header className="mb-10 space-y-4 text-center">
              <h1 id="criar-loja-heading" className="font-display text-3xl font-bold text-foreground">Criar minha loja</h1>
              <p className="text-sm text-muted-foreground">Siga as etapas para configurar sua loja</p>
            </header>

            {/* Stepper */}
            <ol className="mb-10 flex items-center justify-center gap-1 flex-wrap" aria-label="Etapas de criação">
              {visibleSteps.map((s, i) => {
                const isActive = i <= step || (isFinalStep);
                return (
                  <li key={s.label} className="flex items-center gap-1">
                    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}
                      aria-current={i === step ? "step" : undefined}>
                      <s.icon className="h-3 w-3" aria-hidden="true" />
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < visibleSteps.length - 1 && <div className={`h-0.5 w-4 rounded ${i < step ? "bg-primary" : "bg-border"}`} aria-hidden="true" />}
                  </li>
                );
              })}
            </ol>

            <p className="sr-only" aria-live="polite">Etapa atual: {visibleSteps[Math.min(step, visibleSteps.length - 1)]?.label}</p>

            <AnimatePresence mode="wait">
              {/* ── Step 0: Plan Selection ──────────── */}
              {step === 0 && (
                <PlanSelectionStep
                  plans={plansData}
                  selectedPlan={selectedPlan}
                  billing={billing}
                  onSelectPlan={setSelectedPlan}
                  onBillingChange={setBilling}
                />
              )}


              {/* ── Step 1: Account Creation ───────── */}
              {step === 1 && (
                <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                    <h2 className="font-display text-lg font-bold text-foreground">Crie sua conta</h2>
                    <p className="text-sm text-muted-foreground">Seus dados de acesso ao painel administrativo.</p>
                    <div>
                      <Label htmlFor="acc-name">Nome completo *</Label>
                      <Input id="acc-name" placeholder="Maria Silva" value={accountData.nome} onChange={(e) => setAccountData((p) => ({ ...p, nome: e.target.value }))} onBlur={() => markTouched("nome")} className={showErr("nome", accountErrors) ? "border-destructive" : ""} autoComplete="name" aria-invalid={Boolean(showErr("nome", accountErrors))} aria-describedby={showErr("nome", accountErrors) ? "acc-name-error" : undefined} />
                      <FieldError id="acc-name-error" message={showErr("nome", accountErrors)} />
                    </div>
                    <div>
                      <Label htmlFor="acc-email">E-mail *</Label>
                      <Input id="acc-email" type="email" placeholder="maria@email.com" value={accountData.email} onChange={(e) => setAccountData((p) => ({ ...p, email: e.target.value }))} onBlur={() => markTouched("email")} className={showErr("email", accountErrors) ? "border-destructive" : ""} autoComplete="email" aria-invalid={Boolean(showErr("email", accountErrors))} aria-describedby={showErr("email", accountErrors) ? "acc-email-error" : undefined} />
                      <FieldError id="acc-email-error" message={showErr("email", accountErrors)} />
                    </div>
                    <div>
                      <Label htmlFor="acc-senha">Senha *</Label>
                      <Input id="acc-senha" type="password" placeholder="Mínimo 6 caracteres" value={accountData.senha} onChange={(e) => setAccountData((p) => ({ ...p, senha: e.target.value }))} onBlur={() => markTouched("senha")} className={showErr("senha", accountErrors) ? "border-destructive" : ""} autoComplete="new-password" aria-invalid={Boolean(showErr("senha", accountErrors))} aria-describedby={showErr("senha", accountErrors) ? "acc-senha-error" : undefined} />
                      <FieldError id="acc-senha-error" message={showErr("senha", accountErrors)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Store Data ─────────────── */}
              {step === 2 && (
                <motion.div key="store" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                    <h2 className="font-display text-lg font-bold text-foreground">Dados da sua loja</h2>
                    <div>
                      <Label htmlFor="store-name">Nome da Loja *</Label>
                      <Input id="store-name" placeholder="Minha Loja Circular" value={storeData.nome} onChange={(e) => handleStoreChange("nome", e.target.value)} onBlur={() => markTouched("nome")} className={showErr("nome", storeErrors) ? "border-destructive" : ""} maxLength={60} aria-invalid={Boolean(showErr("nome", storeErrors))} aria-describedby={showErr("nome", storeErrors) ? "store-name-error" : undefined} />
                      <FieldError id="store-name-error" message={showErr("nome", storeErrors)} />
                    </div>
                    <div>
                      <Label htmlFor="store-slug">URL da Loja</Label>
                      <div className={`flex items-center overflow-hidden rounded-md border ${showErr("slug", storeErrors) ? "border-destructive" : "border-border"}`}>
                        <span className="whitespace-nowrap border-r border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">circular.store/</span>
                        <Input id="store-slug" className="rounded-none border-0" value={storeData.slug} onChange={(e) => setStoreData((p) => ({ ...p, slug: e.target.value }))} onBlur={() => markTouched("slug")} aria-invalid={Boolean(showErr("slug", storeErrors))} aria-describedby={showErr("slug", storeErrors) ? "store-slug-error" : undefined} />
                      </div>
                      <FieldError id="store-slug-error" message={showErr("slug", storeErrors)} />
                    </div>
                    <div>
                      <Label htmlFor="store-phone">Telefone</Label>
                      <Input id="store-phone" placeholder="(11) 99999-9999" value={storeData.telefone} onChange={(e) => handleStoreChange("telefone", e.target.value)} autoComplete="tel" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: E-commerce toggle ──────── */}
              {step === 3 && (
                <motion.div key="ecommerce" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="space-y-6 rounded-xl border border-border bg-card p-6 text-center">
                    <h2 className="font-display text-lg font-bold text-foreground">Sua loja terá e-commerce?</h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Com o e-commerce ativado, seus clientes poderão comprar online diretamente pela sua loja virtual. Você pode ativar depois se preferir.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <button type="button" onClick={() => setWantsEcommerce(false)}
                        className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 w-40 transition-all ${!wantsEcommerce ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"}`}>
                        <Store className={`h-8 w-8 ${!wantsEcommerce ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="font-medium text-foreground text-sm">Apenas Gestão</span>
                        <span className="text-[10px] text-muted-foreground">Loja física / PDV</span>
                      </button>
                      <button type="button" onClick={() => setWantsEcommerce(true)}
                        className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 w-40 transition-all ${wantsEcommerce ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"}`}>
                        <ShoppingBag className={`h-8 w-8 ${wantsEcommerce ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="font-medium text-foreground text-sm">Com E-commerce</span>
                        <span className="text-[10px] text-muted-foreground">Venda online + Gestão</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 4: Template Selection ─────── */}
              {step === 4 && wantsEcommerce && (
                <TemplateSelectionStep
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                />
              )}

              {/* ── Final Step: Success ────────────── */}
              {isFinalStep && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                  <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Loja criada com sucesso! 🎉</h2>
                    <p className="text-muted-foreground" role="status">
                      Sua loja <strong className="text-foreground">{storeData.nome || "Minha Loja"}</strong> está pronta!
                    </p>
                    <div className="mx-auto max-w-sm space-y-2 rounded-lg border border-border bg-card p-4 text-left">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plano</span><span className="font-medium text-foreground">{plan.name}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">E-commerce</span><span className="font-medium text-foreground">{wantsEcommerce ? "Sim" : "Não"}</span></div>
                      {wantsEcommerce && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Template</span><span className="font-medium text-foreground">{templates.find((t) => t.id === selectedTemplate)?.name}</span></div>}
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">URL</span><span className="break-all font-medium text-accent">circular.store/{storeData.slug || "minha-loja"}</span></div>
                    </div>
                    <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
                      <Button onClick={() => navigate("/dashboard")} className="bg-gradient-primary text-primary-foreground">
                        Acessar Painel <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                      {wantsEcommerce && (
                        <Button variant="outline" onClick={() => window.open(`/loja/${storeData.slug || "minha-loja"}`, "_blank")}>Ver minha loja</Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {showNavButtons && (
              <nav className="mt-6 flex justify-between" aria-label="Navegação entre etapas">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Voltar
                </Button>
                <Button onClick={handleNext} disabled={processing} aria-busy={processing}>
                  {processing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Processando...</>
                  ) : (
                    <>Próximo<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></>
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
