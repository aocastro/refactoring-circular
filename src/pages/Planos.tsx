import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type BillingPeriod = "mensal" | "anual";

const plans = [
  { name: "Starter", subtitle: "Para iniciantes em lojas online", monthlyPrice: 0, annualPrice: 0, originalPrice: 19.9, cta: "Quero esse", highlight: false },
  { name: "Essential", subtitle: "Para quem já ganhou força online", monthlyPrice: 59.9, annualPrice: 718.8, originalPrice: 99.9, cta: "Testar Grátis 30 dias", highlight: false },
  { name: "Growth", subtitle: "Para quem quer organizar sua loja física", monthlyPrice: 149.9, annualPrice: 1798.8, originalPrice: 299.9, cta: "Testar Grátis 30 dias", highlight: true },
  { name: "Scale", subtitle: "Para quem quer escalar sua operação", monthlyPrice: 420.9, annualPrice: 5050.8, originalPrice: 699.9, cta: "Quero esse", highlight: false },
  { name: "Executive", subtitle: "Para quem já fatura +100k /mês", monthlyPrice: 199.9, annualPrice: 2398.8, originalPrice: 2999.9, cta: "Quero esse", highlight: false },
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
              Planos de <span className="text-gradient">Assinatura</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Escolha o plano ideal para o seu negócio circular
            </p>

            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-secondary border border-border">
              <button
                onClick={() => setBilling("mensal")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billing === "mensal" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBilling("anual")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billing === "anual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anual
                <span className="ml-1.5 text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded-full">-20%</span>
              </button>
            </div>
          </motion.div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative p-5 rounded-2xl border ${
                  plan.highlight ? "border-primary bg-primary/5 glow-primary" : "border-border bg-card"
                } flex flex-col`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </span>
                )}
                <h3 className="font-display font-bold text-foreground text-lg">{plan.name}</h3>
                <p className="text-xs text-accent mt-1 mb-4 leading-relaxed">{plan.subtitle}</p>

                <div className="mb-1">
                  <span className="text-xs text-muted-foreground line-through">
                    R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold font-display text-foreground">
                    R$ {plan.monthlyPrice.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>
                {billing === "anual" && (
                  <p className="text-xs text-muted-foreground mb-4">
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
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature comparison table */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold font-display text-foreground text-center mb-8">
              Comparativo Completo
            </h2>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left py-4 px-4 text-muted-foreground font-medium min-w-[200px]">Recurso</th>
                      {plans.map((p) => (
                        <th key={p.name} className={`text-center py-4 px-3 font-medium min-w-[90px] ${p.highlight ? "text-primary" : "text-foreground"}`}>
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureCategories.map((cat) => (
                      <React.Fragment key={cat.title}>
                        <tr className="bg-secondary/10">
                          <td colSpan={6} className="py-3 px-4 font-semibold text-foreground text-xs uppercase tracking-wider">
                            {cat.emoji} {cat.title}
                          </td>
                        </tr>
                        {cat.features.map((feature) => (
                          <tr key={feature.name} className="border-b border-border/30 hover:bg-secondary/10 transition-colors">
                            <td className="py-2.5 px-4 text-muted-foreground text-xs">{feature.name}</td>
                            {feature.values.map((val, j) => (
                              <td key={j} className={`py-2.5 px-3 text-center ${plans[j].highlight ? "bg-primary/5" : ""}`}>
                                {val === true ? (
                                  <Check className="h-4 w-4 text-success mx-auto" />
                                ) : val === false ? (
                                  <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                                ) : (
                                  <span className="text-foreground font-medium text-xs">{val}</span>
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
          </motion.div>

          {/* CTA */}
          <motion.div className="text-center mt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-muted-foreground mb-4">Ainda tem dúvidas? Fale com nosso time.</p>
            <Button asChild variant="outline" className="border-border rounded-xl">
              <a href="https://wa.me/+5511982163883" target="_blank" rel="noopener noreferrer">
                Fale Conosco
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Planos;
