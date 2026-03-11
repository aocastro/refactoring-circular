import { motion } from "framer-motion";
import {
  ShoppingBag,
  Handshake,
  Leaf,
  Wrench,
  Globe,
  Users,
} from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Moda de Segunda Mão",
    description: "Criado especificamente para brechós, lojas vintage e artigos usados.",
  },
  {
    icon: Handshake,
    title: "Consignação facilitada",
    description: "Acompanhe consignados, automatize e gerencie pagamentos sem esforço.",
  },
  {
    icon: Leaf,
    title: "Impacto Ambiental",
    description: "Acompanhamento automático ESG: redução de CO₂ e preservação de recursos.",
  },
  {
    icon: Wrench,
    title: "Upcycling & Reparo",
    description: "Gerencie transformações, reparos e serviços de valor agregado.",
  },
  {
    icon: Globe,
    title: "Pronto para o mundo",
    description: "Suporte multimoedas e multi idiomas para empresas circulares.",
  },
  {
    icon: Users,
    title: "Comércio compartilhado",
    description: "Vendas colaborativas, pop-ups e modelos de varejo comunitário.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Construído para negócios da{" "}
            <span className="text-gradient">moda circular</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Todos os recursos projetados para empresas que dão uma segunda vida aos produtos.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group p-6 rounded-2xl bg-card border border-border hover-lift cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-display mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
