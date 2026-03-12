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
import FinanceiroContent from "@/components/dashboard/FinanceiroContent";
import CatalogoContent from "@/components/dashboard/CatalogoContent";
import InventarioContent from "@/components/dashboard/InventarioContent";
import ClientesContent from "@/components/dashboard/ClientesContent";
import CuponsContent from "@/components/dashboard/CuponsContent";
import PDVContent from "@/components/dashboard/PDVContent";
import RelatoriosVendasContent from "@/components/dashboard/RelatoriosVendasContent";
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
      case "venda-catalogo": return <CatalogoContent />;
      case "venda-produtos":
      case "venda-pedidos": return <VendaContent />;
      case "consignantes": return <ConsignacaoContent />;
      case "inventario": return <InventarioContent />;
      case "clientes": return <ClientesContent />;
      case "cupons": return <CuponsContent />;
      case "pdv-caixa":
      case "pdv-historico": return <PDVContent />;
      case "relatorios-vendas": return <RelatoriosVendasContent />;
      case "relatorios-financeiro":
      case "relatorios-esg": return <FinanceiroContent />;
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
