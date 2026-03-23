import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface PlanData {
  key: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  tagline: string;
  icon: LucideIcon;
  highlight?: boolean;
}

interface PlanSelectionStepProps {
  plans: PlanData[];
  selectedPlan: string;
  billing: "mensal" | "anual";
  onSelectPlan: (key: string) => void;
  onBillingChange: (billing: "mensal" | "anual") => void;
}

const featureCategories = [
  {
    emoji: "🛒", title: "Loja e Vendas",
    features: [
      { name: "Loja Online", values: [true, true, true, true, true] },
      { name: "Fotos por Produto", values: ["2", "4", "6", "6", "6"] },
      { name: "Vídeo no Produto", values: [false, false, true, true, true] },
      { name: "Nº de Produtos", values: ["100", "500", "∞", "∞", "∞"] },
      { name: "Comissão vendas online", values: ["20%", "10%", "5%", "3%", "2%"] },
      { name: "Comissão vendas PDV", values: ["-", "-", "0%", "0%", "0%"] },
      { name: "Afiliados", values: [false, false, true, true, true] },
      { name: "Cupom de desconto", values: [false, false, true, true, true] },
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
      { name: "Celular como PDV", values: [false, false, true, true, true] },
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
      { name: "Estoque Integrado (Física e Online)", values: [false, false, true, true, true] },
      { name: "Calculadora de precificação", values: [false, true, true, true, true] },
      { name: "Geração de Descrição com IA", values: [false, false, true, true, true] },
      { name: "Cadastro por CSV", values: [false, false, true, true, true] },
    ],
  },
  {
    emoji: "👥", title: "Clientes e Consignados",
    features: [
      { name: "Gestão de clientes", values: [true, true, true, true, true] },
      { name: "Gestão de Consignados", values: [false, true, true, true, true] },
      { name: "Painel para Consignados", values: [false, false, true, true, true] },
      { name: "Contrato virtual", values: [false, false, true, true, true] },
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
    emoji: "⚙️", title: "Personalização",
    features: [
      { name: "Linktree Personalizado", values: [true, true, true, true, true] },
      { name: "Templates de Loja", values: ["2", "4", "10", "14", "20"] },
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
    emoji: "🌐", title: "Integrações",
    features: [
      { name: "Logística Integrada", values: ["ME", "ME", "ME", "ME", "ME"] },
      { name: "Integração com Instagram", values: [false, true, true, true, true] },
      { name: "Integração com Emissor NFe", values: [false, false, false, true, true] },
      { name: "Integração com Marketplaces", values: [false, false, false, false, true] },
    ],
  },
];

const PlanSelectionStep = ({ plans, selectedPlan, billing, onSelectPlan, onBillingChange }: PlanSelectionStepProps) => {
  const [showComparison, setShowComparison] = useState(false);
  const selectedIndex = plans.findIndex((p) => p.key === selectedPlan);

  return (
    <motion.div key="plan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">Escolha seu plano</h2>
        
        <div className="rounded-lg bg-primary/10 p-3 border border-primary/20 flex items-center gap-3">
          <div className="flex-1 text-xs text-primary font-medium leading-tight">
            <span className="block font-bold text-sm mb-0.5">🎁 7 Dias Grátis em Todos os Planos</span>
            Experimente todos os recursos sem compromisso. Não pediremos seu cartão agora!
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className={`text-sm ${billing === "mensal" ? "text-foreground font-medium" : "text-muted-foreground"}`}>Mensal</span>
          <Switch checked={billing === "anual"} onCheckedChange={(c) => onBillingChange(c ? "anual" : "mensal")} />
          <span className={`text-sm ${billing === "anual" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            Anual <Badge variant="secondary" className="ml-1 text-[10px]">-20%</Badge>
          </span>
        </div>

        {/* Plan cards */}
        <div className="grid gap-3">
          {plans.map((p) => {
            const pPrice = billing === "anual" ? p.annualPrice / 12 : p.monthlyPrice;
            const totalAnnual = billing === "anual" ? p.annualPrice : null;
            return (
              <button key={p.key} type="button"
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${selectedPlan === p.key ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:bg-secondary/50"}`}
                onClick={() => onSelectPlan(p.key)}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selectedPlan === p.key ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{p.name}</span>
                    {p.highlight && <Badge className="bg-accent text-accent-foreground text-[10px]">Popular</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">{p.tagline}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-foreground">{pPrice === 0 ? "Grátis" : `R$ ${pPrice.toFixed(2).replace(".", ",")}`}</span>
                  {pPrice > 0 && <span className="block text-[10px] text-muted-foreground">/mês</span>}
                  {totalAnnual && totalAnnual > 0 && (
                    <span className="block text-[10px] text-muted-foreground">R$ {totalAnnual.toFixed(2).replace(".", ",")} /ano</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle comparison */}
      <button
        type="button"
        onClick={() => setShowComparison((v) => !v)}
        className="mx-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
      >
        {showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {showComparison ? "Ocultar comparativo" : "Ver comparativo completo"}
      </button>

      {/* Full comparison table */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Tabela comparativa de recursos disponíveis em cada plano.</caption>
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th scope="col" className="sticky left-0 z-10 min-w-[160px] bg-secondary/30 px-3 py-3 text-left text-xs font-medium text-muted-foreground">Recurso</th>
                  {plans.map((p, i) => (
                    <th key={p.key} scope="col"
                      className={`min-w-[80px] px-2 py-3 text-center text-xs font-medium ${i === selectedIndex ? "text-primary bg-primary/5" : "text-foreground"}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((cat) => (
                  <React.Fragment key={cat.title}>
                    <tr className="bg-secondary/10">
                      <th scope="colgroup" colSpan={6} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-foreground">
                        {cat.emoji} {cat.title}
                      </th>
                    </tr>
                    {cat.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-border/20 hover:bg-secondary/10 transition-colors">
                        <th scope="row" className="sticky left-0 z-10 bg-card px-3 py-2 text-left text-[11px] font-normal text-muted-foreground">{feature.name}</th>
                        {feature.values.map((val, j) => (
                          <td key={j} className={`px-2 py-2 text-center ${j === selectedIndex ? "bg-primary/5" : ""}`}>
                            {val === true ? (
                              <Check className="mx-auto h-3.5 w-3.5 text-success" aria-label="Incluído" />
                            ) : val === false ? (
                              <X className="mx-auto h-3.5 w-3.5 text-muted-foreground/30" aria-label="Não incluído" />
                            ) : (
                              <span className="text-[11px] font-medium text-foreground">{val}</span>
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
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlanSelectionStep;
