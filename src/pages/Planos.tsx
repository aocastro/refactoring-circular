import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type BillingPeriod = "mensal" | "anual";

const plans = [
  { name: "Starter", subtitle: "Para iniciantes em lojas online", monthlyPrice: 0, annualPrice: 0, originalPrice: 19.9, cta: "Quero esse", highlight: false },
  { name: "Essential", subtitle: "Para quem já ganhou força online", monthlyPrice: 59.9, annualPrice: 575.0, originalPrice: 99.9, cta: "Testar Grátis 30 dias", highlight: false },
  { name: "Growth", subtitle: "Para quem quer organizar sua loja física", monthlyPrice: 149.9, annualPrice: 1439.0, originalPrice: 299.9, cta: "Testar Grátis 30 dias", highlight: true },
  { name: "Scale", subtitle: "Para quem quer escalar sua operação", monthlyPrice: 420.9, annualPrice: 4040.6, originalPrice: 699.9, cta: "Quero esse", highlight: false },
  { name: "Executive", subtitle: "Para quem já fatura +100k /mês", monthlyPrice: 1999.9, annualPrice: 19199.0, originalPrice: 2999.9, cta: "Quero esse", highlight: false },
];

const featureCategories = [
  {
    emoji: "🛒", title: "Loja e Vendas",
    features: [
      { name: "Loja Online", values: [true, true, true, true, true] },
      { name: "Loja online em 1 click", values: [true, true, true, true, true] },
      { name: "Fotos por Produto", values: ["2", "4", "6", "6", "6"] },
      { name: "Vídeo no Produto", values: [false, false, true, true, true] },
      { name: "Nº de Produtos", values: ["100", "500", "∞", "∞", "∞"] },
      { name: "Comissão vendas online", values: ["20%", "10%", "5%", "3%", "2%"] },
      { name: "Comissão vendas PDV", values: ["-", "-", "0%", "0%", "0%"] },
      { name: "Afiliados", values: [false, false, true, true, true] },
      { name: "Cupom de desconto", values: [false, false, true, true, true] },
      { name: "Site Seguro", values: [true, true, true, true, true] },
      { name: "Recuperação de Carrinho", values: [false, false, true, true, true] },
      { name: "Sacolinha", values: [false, true, true, true, true] },
      { name: "Link de Pagamento no PDV", values: [false, false, true, true, true] },
      { name: "Múltiplas Lojas", values: [false, false, false, "5", "10"] },
    ],
  },
  {
    emoji: "🧾", title: "PDV (Ponto de Venda)",
    features: [
      { name: "Loja Física (PDV)", values: [false, false, true, true, true] },
      { name: "Impressão de Recibo", values: [false, false, true, true, true] },
      { name: "Múltiplos PDVs", values: [false, false, false, true, true] },
      { name: "PDV com 2 telas", values: [false, false, false, true, true] },
      { name: "Totem de Autoatendimento", values: [false, false, false, false, true] },
      { name: "Celular como PDV", values: [false, false, true, true, true] },
      { name: "PDV Portátil", values: [false, false, true, true, true] },
      { name: "Integração com Máquina de Cartão", values: [false, false, true, true, true] },
      { name: "Geração de código de barras", values: [false, false, true, true, true] },
      { name: "Impressão de Etiquetas", values: [false, false, false, true, true] },
    ],
  },
  {
    emoji: "📦", title: "Estoque e Produtos",
    features: [
      { name: "Controle de Estoque", values: [true, true, true, true, true] },
      { name: "Inventário por Código de Barras", values: [false, false, true, true, true] },
      { name: "Gestão de produtos", values: [true, true, true, true, true] },
      { name: "Estoque Integrado (Física e Online)", values: [false, false, true, true, true] },
      { name: "Compare preços de similares", values: [false, false, true, true, true] },
      { name: "Smart Look", values: [false, false, false, true, true] },
      { name: "Calculadora de precificação", values: [false, true, true, true, true] },
      { name: "Duplicar Produtos", values: [false, true, true, true, true] },
      { name: "Geração de Descrição com IA", values: [false, false, true, true, true] },
      { name: "Cadastro por CSV", values: [false, false, true, true, true] },
      { name: "Fotos Ágeis pelo Celular", values: [true, true, true, true, true] },
    ],
  },
  {
    emoji: "👥", title: "Clientes e Consignados",
    features: [
      { name: "Gestão de clientes", values: [true, true, true, true, true] },
      { name: "E-mail personalizado", values: [false, true, true, true, true] },
      { name: "Consultar créditos do cliente", values: [false, false, true, true, true] },
      { name: "Gestão de Consignados", values: [false, true, true, true, true] },
      { name: "Painel para Consignados", values: [false, false, true, true, true] },
      { name: "Contrato virtual", values: [false, false, true, true, true] },
      { name: "Pagamento créditos/dinheiro", values: [false, false, true, true, true] },
    ],
  },
  {
    emoji: "📈", title: "Relatórios e Indicadores",
    features: [
      { name: "Painel de vendas e estoque", values: [true, true, true, true, true] },
      { name: "Indicadores ESG", values: [false, true, true, true, true] },
      { name: "Dashboard financeiro", values: [true, true, true, true, true] },
      { name: "Painel do Contador", values: [false, false, false, true, true] },
      { name: "Exportação de dados", values: [false, false, true, true, true] },
      { name: "API de Integração", values: [false, false, false, true, true] },
    ],
  },
  {
    emoji: "⚙️", title: "Personalização e Layout",
    features: [
      { name: "Linktree Personalizado", values: [true, true, true, true, true] },
      { name: "Templates de Loja", values: ["2", "4", "10", "14", "20"] },
      { name: "Etiqueta com Impacto ESG", values: [false, false, true, true, true] },
      { name: "Etiqueta personalizada", values: [false, false, false, true, true] },
      { name: "Uso de Domínio Próprio", values: [false, false, "Pago", "Pago", true] },
    ],
  },
  {
    emoji: "💳", title: "Pagamentos",
    features: [
      { name: "Carteira de Pagamentos", values: [true, true, true, true, true] },
      { name: "Pagamento Integrado TEF", values: [false, false, false, true, true] },
    ],
  },
  {
    emoji: "🌐", title: "Infraestrutura e Integrações",
    features: [
      { name: "Sistema 100% em nuvem", values: [true, true, true, true, true] },
      { name: "Logística Integrada", values: ["ME", "ME", "ME", "ME", "ME"] },
      { name: "Integração com Instagram", values: [false, true, true, true, true] },
      { name: "Integração com Emissor NFe", values: [false, false, false, true, true] },
      { name: "Integração com Marketplaces", values: [false, false, false, false, true] },
    ],
  },
];

const Planos = () => {
  const [billing, setBilling] = useState<BillingPeriod>("anual");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="pt-28 pb-16">
        <section aria-labelledby="planos-heading">
          <div className="container mx-auto max-w-7xl px-4">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 id="planos-heading" className="mb-4 font-display text-3xl font-bold md:text-5xl">
                Planos de <span className="text-gradient">Assinatura</span>
              </h1>
              <p id="planos-description" className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
                Escolha o plano ideal para o seu negócio circular.
              </p>

              <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-secondary p-1" role="tablist" aria-label="Período de cobrança">
                <button
                  type="button"
                  role="tab"
                  id="billing-mensal"
                  aria-selected={billing === "mensal"}
                  aria-controls="pricing-grid"
                  onClick={() => setBilling("mensal")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    billing === "mensal" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  role="tab"
                  id="billing-anual"
                  aria-selected={billing === "anual"}
                  aria-controls="pricing-grid"
                  onClick={() => setBilling("anual")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    billing === "anual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Anual
                  <span className="ml-1.5 rounded-full bg-success/20 px-1.5 py-0.5 text-[10px] text-success">-20%</span>
                </button>
              </div>
            </motion.div>

            <div id="pricing-grid" className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-describedby="planos-description">
              {plans.map((plan, i) => {
                const planTitleId = `plan-${plan.name.toLowerCase()}-title`;
                const planDescId = `plan-${plan.name.toLowerCase()}-desc`;
                const planPriceId = `plan-${plan.name.toLowerCase()}-price`;

                return (
                  <motion.article
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative flex flex-col rounded-2xl border p-5 ${
                      plan.highlight ? "glow-primary border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                    aria-labelledby={planTitleId}
                    aria-describedby={`${planDescId} ${planPriceId}`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                        Popular
                      </span>
                    )}
                    <h2 id={planTitleId} className="text-lg font-bold text-foreground">{plan.name}</h2>
                    <p id={planDescId} className="mb-4 mt-1 text-xs leading-relaxed text-accent">{plan.subtitle}</p>

                    <div className="mb-1">
                      <span className="text-xs text-muted-foreground line-through">
                        R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="mb-1 flex items-baseline gap-1" id={planPriceId} aria-live="polite">
                      <span className="font-display text-3xl font-bold text-foreground">
                        R$ {(billing === "anual" ? plan.annualPrice / 12 : plan.monthlyPrice).toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-sm text-muted-foreground">/mês</span>
                    </div>
                    {billing === "anual" && (
                      <p className="mb-4 text-xs text-muted-foreground">
                        R$ {plan.annualPrice.toFixed(2).replace(".", ",")} pago anualmente
                      </p>
                    )}

                    <div className="mt-auto pt-4">
                      <Button
                        className={`w-full rounded-lg ${
                          plan.highlight
                            ? "bg-gradient-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                        size="sm"
                        onClick={() => navigate(`/criar-loja?plano=${plan.name.toLowerCase()}&billing=${billing}`)}
                        aria-label={`Selecionar plano ${plan.name}`}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} aria-labelledby="comparativo-heading">
              <h2 id="comparativo-heading" className="mb-8 text-center font-display text-2xl font-bold text-foreground">
                Comparativo Completo
              </h2>

              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Tabela comparativa de recursos disponíveis em cada plano.</caption>
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th scope="col" className="min-w-[200px] px-4 py-4 text-left font-medium text-muted-foreground">Recurso</th>
                        {plans.map((p) => (
                          <th key={p.name} scope="col" className={`min-w-[90px] px-3 py-4 text-center font-medium ${p.highlight ? "text-primary" : "text-foreground"}`}>
                            {p.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {featureCategories.map((cat) => (
                        <React.Fragment key={cat.title}>
                          <tr className="bg-secondary/10">
                            <th scope="colgroup" colSpan={6} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground">
                              {cat.emoji} {cat.title}
                            </th>
                          </tr>
                          {cat.features.map((feature) => (
                            <tr key={feature.name} className="border-b border-border/30 transition-colors hover:bg-secondary/10">
                              <th scope="row" className="px-4 py-2.5 text-left text-xs font-normal text-muted-foreground">{feature.name}</th>
                              {feature.values.map((val, j) => (
                                <td key={j} className={`px-3 py-2.5 text-center ${plans[j].highlight ? "bg-primary/5" : ""}`}>
                                  {val === true ? (
                                    <Check className="mx-auto h-4 w-4 text-success" aria-label="Incluído" />
                                  ) : val === false ? (
                                    <X className="mx-auto h-4 w-4 text-muted-foreground/30" aria-label="Não incluído" />
                                  ) : (
                                    <span className="text-xs font-medium text-foreground">{val}</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>

            <motion.section className="mt-16 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} aria-labelledby="planos-contact-heading">
              <h2 id="planos-contact-heading" className="sr-only">Fale com nosso time</h2>
              <p className="mb-4 text-muted-foreground">Ainda tem dúvidas? Fale com nosso time.</p>
              <Button asChild variant="outline" className="rounded-xl border-border">
                <a href="https://wa.me/+5511982163883" target="_blank" rel="noopener noreferrer" aria-label="Falar com o time pelo WhatsApp">
                  Fale Conosco
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </motion.section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Planos;
