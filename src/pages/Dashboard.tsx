import { useEffect, useMemo, useRef, useState } from "react";
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
import SmartLockContent from "@/components/dashboard/SmartLockContent";
import PedidosContent from "@/components/dashboard/PedidosContent";
import SubestoquesContent from "@/components/dashboard/SubestoquesContent";
import SacolinhasContent from "@/components/dashboard/SacolinhasContent";
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

type DashboardSectionMeta = {
  label: string;
  content: React.ReactNode;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const { theme, toggleTheme } = useTheme();
  const sectionHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const sectionMap = useMemo<Record<string, DashboardSectionMeta>>(
    () => ({
      dashboard: { label: "Dashboard", content: <DashboardContent /> },
      "minha-conta": { label: "Minha Conta", content: <MyAccountContent user={user!} /> },
      configuracoes: { label: "Configurações gerais", content: <ConfiguracoesContent defaultTab="geral" /> },
      "config-geral": { label: "Configurações gerais", content: <ConfiguracoesContent defaultTab="geral" /> },
      "config-pagamento": { label: "Configurações de pagamento", content: <ConfiguracoesContent defaultTab="pagamento" /> },
      "config-entrega": { label: "Configurações de entrega", content: <ConfiguracoesContent defaultTab="entrega" /> },
      venda: { label: "Venda", content: <VendaContent /> },
      "venda-produtos": { label: "Produtos", content: <CatalogoContent /> },
      "venda-smartlock": { label: "SmartLock", content: <SmartLockContent /> },
      "venda-pedidos": { label: "Pedidos da Loja Online", content: <PedidosContent /> },
      "venda-subestoques": { label: "Subestoques", content: <SubestoquesContent /> },
      "venda-sacolinhas": { label: "Sacolinhas", content: <SacolinhasContent /> },
      "venda-catalogo": { label: "Catálogo", content: <CatalogoContent /> },
      servicos: { label: "Serviços", content: <ServicosContent defaultTab="agendamentos" /> },
      "servicos-agendamentos": { label: "Agendamentos", content: <ServicosContent defaultTab="agendamentos" /> },
      "servicos-lista": { label: "Lista de serviços", content: <ServicosContent defaultTab="lista" /> },
      inventario: { label: "Inventário", content: <InventarioContent /> },
      consignantes: { label: "Consignantes", content: <ConsignacaoContent /> },
      fornecedores: { label: "Fornecedores", content: <FornecedoresContent /> },
      clientes: { label: "Clientes", content: <ClientesContent /> },
      newsletter: { label: "Newsletter", content: <NewsletterContent /> },
      pdv: { label: "PDV", content: <PDVContent /> },
      "pdv-caixa": { label: "PDV", content: <PDVContent /> },
      "pdv-historico": { label: "Histórico do PDV", content: <PDVContent /> },
      funcionarios: { label: "Funcionários", content: <FuncionariosContent /> },
      cupons: { label: "Cupons", content: <CuponsContent /> },
      relatorios: { label: "Relatórios", content: <RelatoriosContent /> },
      blog: { label: "Blog", content: <BlogContent defaultTab="posts" /> },
      "blog-posts": { label: "Posts do blog", content: <BlogContent defaultTab="posts" /> },
      "blog-categorias": { label: "Categorias do blog", content: <BlogContent defaultTab="categorias" /> },
      "meu-linktree": { label: "Meu Linktree", content: <LinktreeContent /> },
      lojas: { label: "Lojas", content: <LojasContent /> },
    }),
    [user],
  );

  const currentSection = sectionMap[activeSection] ?? sectionMap.dashboard;

  useEffect(() => {
    if (user) {
      sectionHeadingRef.current?.focus();
    }
  }, [activeSection, user]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-border px-4" aria-label="Cabeçalho do dashboard">
            <SidebarTrigger aria-label="Abrir ou recolher barra lateral" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title={theme === "dark" ? "Modo claro" : "Modo escuro"}
                aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
              </button>
              <NotificationsDropdown />
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground" aria-hidden="true">
                {user.name.charAt(0)}
              </div>
              <span className="hidden text-sm text-foreground sm:block">Olá, {user.name}</span>
            </div>
          </header>

          <main id="main-content" className="flex-1 overflow-auto p-4 sm:p-6" tabIndex={-1} aria-live="polite">
            <section aria-labelledby="dashboard-section-heading">
              <h1 ref={sectionHeadingRef} id="dashboard-section-heading" tabIndex={-1} className="mb-4 font-display text-2xl font-bold text-foreground focus:outline-none">
                {currentSection.label}
              </h1>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentSection.content}
                </motion.div>
              </AnimatePresence>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
