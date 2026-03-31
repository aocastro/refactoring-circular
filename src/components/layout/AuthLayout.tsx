import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Package, Calendar, Users, LineChart } from "lucide-react";
import logo from "@/assets/logo.png";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen bg-background">
      <aside className="relative hidden items-center justify-center p-12 lg:flex lg:w-1/2 bg-[#4C1D95]" aria-label="Apresentação da plataforma">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 w-full max-w-2xl text-left text-white flex flex-col h-full justify-center space-y-16">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Circular u-Shar Logo" className="h-32 object-contain" />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              A plataforma completa<br />para o seu brechó
            </h1>
            <p className="text-lg text-white/80">
              Gerencie vendas, estoque, agendamentos e afiliados em um só lugar.
            </p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <div className="flex items-center gap-4 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg"><Package className="h-5 w-5" /></div>
              <span>Controle de estoque e PDV integrado</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg"><Calendar className="h-5 w-5" /></div>
              <span>Agendamentos e reservas online</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg"><Users className="h-5 w-5" /></div>
              <span>Programa de afiliados e consignados</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg"><LineChart className="h-5 w-5" /></div>
              <span>Relatórios e indicadores em tempo real</span>
            </div>
          </div>

          <div className="flex justify-between max-w-md mx-auto w-full pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Lojas ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">250+ toneladas</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">CO2 evitado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Satisfação</div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10">
            <p className="italic text-white/80 mb-6">
              "Com a Circular organizei todo meu estoque e tripliquei as vendas online em menos de 6 meses."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-400 flex items-center justify-center font-bold text-white">
                M
              </div>
              <div>
                <div className="font-semibold text-sm">Maria Oliveira</div>
                <div className="text-xs text-white/60">Brechó Vintage SP</div>
              </div>
            </div>
          </div>
        </motion.div>
      </aside>

      <main id="main-content" tabIndex={-1} className="relative flex flex-1 items-center justify-center p-4 lg:p-12 bg-white dark:bg-slate-950">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          {children}
        </motion.section>
      </main>
    </div>
  );
};

export default AuthLayout;