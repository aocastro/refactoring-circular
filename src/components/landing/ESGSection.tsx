import { motion } from "framer-motion";
import { Droplets, Wind, Recycle, Activity } from "lucide-react";

const stats = [
  { icon: Wind, value: "4.15 kg", label: "CO₂ evitado por peça", description: "Emissões de carbono evitadas pelo prolongamento da vida útil do produto" },
  { icon: Droplets, value: "2.700 L", label: "Água preservada por peça", description: "Água que seria usada para produzir um novo item" },
  { icon: Recycle, value: "92%", label: "Desvio de aterros sanitários", description: "Itens que ganharam nova vida em vez de se tornarem lixo" },
  { icon: Activity, value: "Tempo real", label: "Acompanhamento do impacto", description: "Cálculos automáticos com base nas suas vendas reais" },
];

const ESGSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(150_80%_45%/0.05)_0%,transparent_60%)]" />
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-medium text-success uppercase tracking-wider">Rastreamento ESG integrado</span>
        </motion.div>

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Prove seu <span className="text-gradient">impacto ambiental</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Todas as vendas são rastreadas automaticamente. Gere relatórios de impacto verificados para parceiros, investidores e clientes que se preocupam com a sustentabilidade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-border bg-card hover-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-success" />
              </div>
              <p className="text-2xl md:text-3xl font-bold font-display text-foreground mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-accent mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* ESG Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
            <div className="p-4 border-b border-border bg-success/5">
              <p className="text-xs text-muted-foreground font-medium">Relatório mensal de impacto</p>
              <p className="text-sm font-bold font-display text-foreground">Dezembro 2025</p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              {[
                { value: "847", label: "Itens vendidos" },
                { value: "1.9t", label: "CO₂ evitado" },
                { value: "2.3M L", label: "Água economizada" },
              ].map((item) => (
                <div key={item.label} className="p-4 text-center">
                  <p className="text-xl font-bold font-display text-foreground">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ESGSection;
