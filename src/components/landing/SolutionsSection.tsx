import { motion } from "framer-motion";

const challenges = [
  {
    challenge: 'Um consignante pergunta: "Como estão as vendas dos meus itens?"',
    solution: "Um clique mostra seus itens, status, vendas e pagamentos pendentes.",
  },
  {
    challenge: "Fim do mês: hora de pagar 50+ consignantes.",
    solution: "Relatórios gerados automaticamente e pagamentos em lote. O que antes levava dias agora leva minutos.",
  },
  {
    challenge: "Cliente quer pagar em 3 parcelas.",
    solution: "Rastreamento de parcelas integrado. Nunca perca o controle de quem deve o quê.",
  },
  {
    challenge: "A marca deseja saber o seu impacto de CO₂ para uma parceria.",
    solution: "Baixe o relatório ESG com dados de impacto verificados em segundos.",
  },
  {
    challenge: "Você está abrindo uma segunda loja.",
    solution: "Suporte para várias lojas. O mesmo sistema, inventário unificado, fluxos de caixa separados.",
  },
  {
    challenge: "Precisa lançar rapidamente as vendas online.",
    solution: "Escolha um modelo, conecte seu inventário e comece a operar hoje mesmo.",
  },
];

const SolutionsSection = () => {
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
            Problemas reais, <span className="text-gradient">soluções reais</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veja como a Circular lida com os desafios diários das empresas circulares.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card overflow-hidden hover-lift"
            >
              <div className="p-5 bg-destructive/5 border-b border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive mb-2 block">Desafio</span>
                <p className="text-sm text-foreground font-medium leading-relaxed">{item.challenge}</p>
              </div>
              <div className="p-5 bg-success/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-success mb-2 block">Solução</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
