import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import MyAccountContent from "@/components/dashboard/MyAccountContent";
import VendaContent from "@/components/dashboard/VendaContent";
import ConsignacaoContent from "@/components/dashboard/ConsignacaoContent";
import CatalogoContent from "@/components/dashboard/CatalogoContent";
import InventarioContent from "@/components/dashboard/InventarioContent";
import ClientesContent from "@/components/dashboard/ClientesContent";
import CuponsContent from "@/components/dashboard/CuponsContent";
import PDVContent from "@/components/dashboard/PDVContent";
import RelatoriosContent from "@/components/dashboard/RelatoriosContent";
import ConfiguracoesContent from "@/components/dashboard/ConfiguracoesContent";
import ServicosContent from "@/components/dashboard/ServicosContent";
import FornecedoresContent from "@/components/dashboard/FornecedoresContent";
import NewsletterContent from "@/components/dashboard/NewsletterContent";
import FuncionariosContent from "@/components/dashboard/FuncionariosContent";
import BlogContent from "@/components/dashboard/BlogContent";
import LinktreeContent from "@/components/dashboard/LinktreeContent";
import LojasContent from "@/components/dashboard/LojasContent";
import NotificationsDropdown from "@/components/dashboard/NotificationsDropdown";
import { useTheme } from "@/hooks/use-theme";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null;

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardContent />;
      case "minha-conta": return <MyAccountContent user={user} />;
      case "configuracoes":
      case "config-geral": return <ConfiguracoesContent defaultTab="geral" />;
      case "config-pagamento": return <ConfiguracoesContent defaultTab="pagamento" />;
      case "config-entrega": return <ConfiguracoesContent defaultTab="entrega" />;
      case "venda":
      case "venda-catalogo": return <CatalogoContent />;
      case "venda-produtos":
      case "venda-pedidos": return <VendaContent />;
      case "servicos":
      case "servicos-agendamentos": return <ServicosContent defaultTab="agendamentos" />;
      case "servicos-lista": return <ServicosContent defaultTab="lista" />;
      case "inventario": return <InventarioContent />;
      case "consignantes": return <ConsignacaoContent />;
      case "fornecedores": return <FornecedoresContent />;
      case "clientes": return <ClientesContent />;
      case "newsletter": return <NewsletterContent />;
      case "pdv":
      case "pdv-caixa":
      case "pdv-historico": return <PDVContent />;
      case "funcionarios": return <FuncionariosContent />;
      case "cupons": return <CuponsContent />;
      case "relatorios": return <RelatoriosContent />;
      case "blog-posts": return <BlogContent defaultTab="posts" />;
      case "blog-categorias": return <BlogContent defaultTab="categorias" />;
      case "meu-linktree": return <LinktreeContent />;
      case "lojas": return <LojasContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 gap-4">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <NotificationsDropdown />
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm text-foreground hidden sm:block">Olá, {user.name}</span>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
