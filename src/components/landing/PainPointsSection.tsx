import { motion } from "framer-motion";
import { FileSpreadsheet, Calculator, Clock, UserX, EyeOff, ShieldOff } from "lucide-react";

const painPoints = [
  { icon: FileSpreadsheet, title: "Afundada em planilhas", description: "Acompanhamento de estoque, consignados e vendas em arquivos desconectados." },
  { icon: Calculator, title: "Cálculo manual de consignação", description: "Horas gastas calculando divisões, pagamentos e comissões." },
  { icon: Clock, title: "Sem tempo para crescer", description: "O caos operacional não deixa espaço para marketing ou expansão." },
  { icon: UserX, title: "Confiança perdida do consignante", description: "Atrasos nos pagamentos e relatórios pouco claros frustram seus parceiros." },
  { icon: EyeOff, title: "Sem visibilidade", description: "Não consegue ver o que está vendendo, o que está estagnado ou para onde o dinheiro está indo." },
  { icon: ShieldOff, title: "Declarações de sustentabilidade não verificadas", description: "Não há dados que comprovem o impacto ambiental da sua empresa." },
];

const PainPointsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_80%_50%/0.04)_0%,transparent_60%)]" />
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Soa <span className="text-gradient">familiar</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            As empresas circulares enfrentam desafios únicos que as ferramentas genéricas simplesmente não conseguem resolver.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 hover-lift"
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <point.icon className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-semibold font-display text-foreground mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;
