import { motion } from "framer-motion";
import { Store, Smartphone, Zap, CreditCard, Share2, Gauge } from "lucide-react";

const features = [
  { icon: Store, label: "Templates profissionais" },
  { icon: Smartphone, label: "Design Mobile-first" },
  { icon: Zap, label: "Checkout rápido" },
  { icon: CreditCard, label: "Processamento de pagamentos" },
  { icon: Share2, label: "Integrações sociais" },
  { icon: Gauge, label: "Carregamento rápido" },
];

const integrations = ["WhatsApp", "Instagram", "Stripe", "PagSeguro"];

const StoreShowcaseSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_80%_60%/0.06)_0%,transparent_60%)]" />
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Sua loja, <span className="text-gradient">pronta em minutos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolha entre belos modelos pré-construídos projetados para o comércio circular.
            Conecte seu estoque e comece a vender online imediatamente.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Features grid */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50"
                >
                  <f.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground font-medium">{f.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <p className="text-xs text-muted-foreground mb-3 font-medium">Integrado com</p>
              <div className="flex flex-wrap gap-2">
                {integrations.map((name) => (
                  <span key={name} className="px-3 py-1.5 rounded-full bg-secondary text-sm text-foreground font-medium">
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Store preview mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/40" />
                  <div className="w-3 h-3 rounded-full bg-accent/40" />
                  <div className="w-3 h-3 rounded-full bg-success/40" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background/50 rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                    sua-loja.circular-store.com
                  </div>
                </div>
              </div>
              {/* Fake store content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary" />
                  <span className="font-display font-bold text-foreground">Sua Marca</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="aspect-square rounded-lg bg-secondary animate-pulse" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-secondary rounded-full w-3/4" />
                  <div className="h-3 bg-secondary rounded-full w-1/2" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gradient-primary rounded-lg flex-1" />
                  <div className="h-8 bg-secondary rounded-lg w-20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoreShowcaseSection;
