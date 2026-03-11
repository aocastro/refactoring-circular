import { motion } from "framer-motion";
import {
  Package,
  Handshake,
  CreditCard,
  Store,
  BarChart3,
  Leaf,
} from "lucide-react";

const modules = [
  { icon: Package, title: "Inventário", description: "Fotos, categorias, condições, tamanhos — pesquisáveis e organizados." },
  { icon: Handshake, title: "Consignação", description: "Divisões automatizadas, contratos e gerenciamento de pagamentos." },
  { icon: CreditCard, title: "Pagamentos", description: "Na loja, online, parcelas. Todos unificados com reconciliação automática." },
  { icon: Store, title: "Templates de Loja", description: "Lojas online prontas a usar. Lance em poucos minutos." },
  { icon: BarChart3, title: "Visão Financeira", description: "Painéis em tempo real: receita, margens, fluxo de caixa." },
  { icon: Leaf, title: "Impacto ESG", description: "Rastreamento automático de CO₂, água e desvio de resíduos." },
];

const ModulesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(180_100%_50%/0.05)_0%,transparent_60%)]" />
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Como o Circular <span className="text-gradient">organiza tudo</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Seis módulos poderosos trabalhando juntos. Sem necessidade de integrações.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative p-6 rounded-2xl border border-border bg-card/50 hover-lift group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <mod.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold font-display text-foreground">{mod.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
