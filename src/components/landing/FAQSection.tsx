import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqCategory = "todos" | "entendendo" | "consignados" | "planos" | "operacao";

const categories: { key: FaqCategory; label: string; emoji: string }[] = [
  { key: "todos", label: "Todos", emoji: "📋" },
  { key: "entendendo", label: "Entendendo a Circular u-Shar", emoji: "🌱" },
  { key: "consignados", label: "Gestão de Consignados", emoji: "🤝" },
  { key: "planos", label: "Planos, Preços e Primeiros Passos", emoji: "💰" },
  { key: "operacao", label: "Operação e Suporte", emoji: "⚙️" },
];

const faqs: { q: string; a: string; cat: FaqCategory }[] = [
  {
    q: "O que é a Circular u-Shar?",
    a: "A Circular u-Shar é uma plataforma de sistemas completa, desenvolvida para simplificar a gestão de negócios baseados em economia compartilhada, economia circular e de segunda mão, como brechós, lojas de locação e bazares. Somos uma greentech que oferece um ecossistema digital para que você organize, controle e automatize sua operação.",
    cat: "entendendo",
  },
  {
    q: "O que é Economia Circular e por que a u-Shar a apoia?",
    a: "A Economia Circular é um modelo econômico que busca eliminar o desperdício e maximizar a utilização de recursos. A u-Shar apoia essa transição fornecendo a tecnologia necessária para que negócios de segunda mão prosperem. Nossos indicadores de Impacto ESG traduzem o valor sustentável do seu brechó para seus clientes.",
    cat: "entendendo",
  },
  {
    q: "O que o sistema Circular u-Shar faz?",
    a: "O Circular u-Shar é uma solução completa que cuida de toda a rotina do seu negócio, incluindo: Gestão de Consignados, Estoque Integrado (sincronização em tempo real), PDV Inteligente, Loja Online em 1 Clique, e Relatórios e Indicadores (dashboard financeiro, painel de vendas e Indicadores ESG).",
    cat: "entendendo",
  },
  {
    q: "O que é Venda Consignada (no contexto de brechós)?",
    a: "A Venda Consignada é um modelo de negócios onde o brechó (o consignatário) recebe roupas e acessórios de terceiros (o consignante) para vender. O brechó só paga ao consignante uma porcentagem do valor após a venda da peça.",
    cat: "consignados",
  },
  {
    q: "Como a u-Shar simplifica a Gestão de Consignados?",
    a: "A u-Shar oferece um módulo completo com: Contrato Virtual (formalização digital), Painel do Consignado (acompanhamento em tempo real de peças, vendas e créditos), e Pagamento Integrado (possibilidade de pagar em créditos ou dinheiro).",
    cat: "consignados",
  },
  {
    q: "Quanto custa a Circular u-Shar?",
    a: "Oferecemos planos flexíveis: Plano Starter (R$ 0,00/mês), Plano Essential (R$ 59,90/mês), Plano Growth (R$ 149,90/mês), e Planos Scale e Executive para operações maiores.",
    cat: "planos",
  },
  {
    q: "O que são os \"Pacotes de Loja\"?",
    a: "Os Pacotes de Loja são serviços de configuração, automação com IA, pacotes de posts para marketing nas redes sociais. Inclui a criação da loja online, layout, logo, paleta de cores, conexão de pagamento e cadastro inicial de 50 produtos.",
    cat: "planos",
  },
  {
    q: "Como começar a usar o Circular u-Shar?",
    a: "1. Escolha seu Plano (pode começar com o Starter gratuito). 2. Personalize o design da sua loja. 3. Cadastre seus Produtos. 4. Comece a Vender integrando loja Online, Instagram e PDV.",
    cat: "planos",
  },
  {
    q: "Posso usar um domínio próprio?",
    a: "Sim. A u-Shar permite o uso de Domínio Próprio para a sua loja online. Nos planos mais básicos, este serviço é cobrado à parte, e nos planos mais avançados, pode estar incluso.",
    cat: "planos",
  },
  {
    q: "Como faço para alterar ou apagar um produto?",
    a: "A gestão de produtos é feita de forma centralizada no painel de administração. Você pode acessar a área de gestão de produtos para editar detalhes, alterar status ou excluir peças. O sistema de Estoque Integrado garante que a alteração seja refletida tanto no PDV quanto na loja online.",
    cat: "operacao",
  },
  {
    q: "Como devo cadastrar as formas de pagamento?",
    a: "A u-Shar oferece a Carteira de Pagamentos integrada, que simplifica a gestão de PIX e outros meios. Você também pode integrar com máquininhas de cartão (Ex: Stone). O cadastro é feito no painel financeiro.",
    cat: "operacao",
  },
  {
    q: "Preciso de designer para criar a loja?",
    a: "Não. Oferecemos diversos Templates de Loja que são flexíveis e podem ser personalizados diretamente no painel de administração (cores, logo, tipografia).",
    cat: "operacao",
  },
  {
    q: "Como faço para cancelar minha assinatura?",
    a: "O cancelamento pode ser feito diretamente no painel de controle da sua conta, na seção de Planos, Assinaturas e Tarifas. O processo é simples e transparente.",
    cat: "operacao",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("todos");

  const filtered = activeCategory === "todos" ? faqs : faqs.filter((f) => f.cat === activeCategory);

  return (
    <section className="py-24">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-accent font-medium mb-3 uppercase tracking-wide">Central de Ajuda</p>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Perguntas <span className="text-gradient">Frequentes</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tire suas dúvidas sobre a Circular u-Shar e descubra como impulsionar seu negócio na economia circular.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setOpenIndex(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-foreground text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${
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

        {/* Contact CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground mb-3">Ainda tem dúvidas? Nossa equipe está pronta para ajudar.</p>
          <a
            href="https://wa.me/+5511982163883?text=Quero%20tirar%20d%C3%BAvidas%20sobre%20o%20Circular%20u-Shar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-success text-success-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Fale Conosco
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
