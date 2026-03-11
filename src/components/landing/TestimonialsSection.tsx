import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alice Carneiro",
    text: "A implementação da plataforma Circular u-Shar foi um divisor de águas na gestão do meu brechó. O sistema é extremamente intuitivo, facilitando o cadastro de produtos e oferecendo métricas precisas.",
    rating: 5,
  },
  {
    name: "João Gabriel",
    text: "Ótimo demais, sistema intuitivo e fácil de utilizar.",
    rating: 5,
  },
  {
    name: "André Souza",
    text: "Uso prático e sustentável. Atendimento via WhatsApp muito bom.",
    rating: 5,
  },
  {
    name: "Ednei Lima",
    text: "Prático e fácil. Reserva prática e rápida.",
    rating: 5,
  },
  {
    name: "Marcelo Gomes",
    text: "Sensacional! O sistema mudou a forma como gerencio minha loja.",
    rating: 5,
  },
  {
    name: "Claudia Clemente",
    text: "Sempre que preciso do apoio do suporte está sempre disponível e eficiente.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            O que as pessoas <span className="text-gradient">dizem sobre nós</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-border bg-card hover-lift"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {t.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-foreground">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
