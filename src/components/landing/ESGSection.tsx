import { motion } from "framer-motion";
import { Droplets, Wind, Recycle, Activity } from "lucide-react";

const stats = [
  { icon: Wind, value: "4.15 kg", label: "CO₂ evitado por peça", description: "Emissões de carbono evitadas" },
  { icon: Droplets, value: "2.700 L", label: "Água preservada por peça", description: "Água que seria usada para novo item" },
  { icon: Recycle, value: "92%", label: "Desvio de aterros", description: "Itens que ganharam nova vida" },
  { icon: Activity, value: "Tempo real", label: "Acompanhamento de impacto", description: "Cálculos automáticos com base nas vendas" },
];

const ESGSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(150_80%_45%/0.05)_0%,transparent_60%)]" />
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
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
            Todas as vendas rastreadas automaticamente. Gere relatórios de impacto verificados.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
};

export default ESGSection;
