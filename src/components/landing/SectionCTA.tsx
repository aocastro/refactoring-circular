import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SectionCTA = () => {
  return (
    <div className="py-12 flex flex-col items-center text-center container px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-6 text-lg rounded-xl glow-primary">
          <Link to="/criar-loja">
            Criar a minha loja grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Comece grátis • Sem cartão de crédito • Criado no Brasil para o mundo
        </p>
      </motion.div>
    </div>
  );
};

export default SectionCTA;
