import { motion } from "framer-motion";
import { Sprout, TrendingUp, Building, Crown } from "lucide-react";

const stages = [
  {
    icon: Sprout,
    title: "Começando",
    subtitle: "Vendedor individual com seus primeiros consignantes",
    features: ["Inventário básico", "Rastreamento simples de consignados", "Loja única"],
  },
  {
    icon: TrendingUp,
    title: "Crescendo",
    subtitle: "Loja estabelecida com consignantes regulares",
    features: ["Análise avançada", "Acesso da equipe", "Várias opções de pagamento"],
  },
  {
    icon: Building,
    title: "Escalando",
    subtitle: "Operação em vários locais ou de alto volume",
    features: ["Gerenciamento de várias lojas", "Acesso à API", "Integrações personalizadas"],
  },
  {
    icon: Crown,
    title: "Enterprise",
    subtitle: "Grandes redes e operações de franquia",
    features: ["Opções white-label", "Suporte dedicado", "Desenvolvimento personalizado"],
  },
];

const GrowthSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(270_80%_60%/0.06)_0%,transparent_60%)]" />
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Cresce com o <span className="text-gradient">seu negócio</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Da sua primeira venda à sua centésima loja. Uma plataforma, possibilidades infinitas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card hover-lift relative"
            >
              {i < stages.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <stage.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold font-display text-foreground mb-1">{stage.title}</h3>
              <p className="text-xs text-accent mb-4">{stage.subtitle}</p>
              <ul className="space-y-2">
                {stage.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-success mt-0.5">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;
