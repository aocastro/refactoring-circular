import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "O que é a Circular u-Shar?",
    a: "Uma plataforma completa para simplificar a gestão de negócios de economia circular e de segunda mão, como brechós, lojas de locação e bazares.",
  },
  {
    q: "Quanto custa?",
    a: "Plano Starter gratuito (R$ 0/mês), Essential (R$ 59,90/mês), Growth (R$ 149,90/mês), Scale e Executive para operações maiores.",
  },
  {
    q: "Como funciona a consignação?",
    a: "Módulo completo com contrato virtual, painel do consignado em tempo real e pagamento integrado.",
  },
  {
    q: "Posso usar domínio próprio?",
    a: "Sim. A u-Shar permite uso de domínio próprio para sua loja online.",
  },
  {
    q: "Preciso de designer para criar a loja?",
    a: "Não. Oferecemos templates flexíveis que podem ser personalizados diretamente no painel.",
  },
  {
    q: "Como começar?",
    a: "Escolha seu plano, personalize o design, cadastre produtos e comece a vender. Simples assim.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="container max-w-3xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Perguntas <span className="text-gradient">Frequentes</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-foreground">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-5 pb-5"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
