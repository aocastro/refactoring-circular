import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(270_80%_60%/0.1)_0%,transparent_60%)]" />
      <div className="container max-w-3xl mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-accent font-medium mb-4 tracking-wide uppercase">
            Junte-se a milhares de empresas circulares
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            Pronta para transformar seu{" "}
            <span className="text-gradient">negócio circular</span>?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Pare de lidar com planilhas. Comece a crescer com a plataforma criada para o negócio circular.
          </p>
          <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-6 text-lg rounded-xl glow-primary">
            <Link to="/planos">
              Criar minha loja agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Grátis para iniciar • Sem cartão de crédito • Configuração em menos de 5 minutos
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
