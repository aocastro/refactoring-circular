import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import NotificationsDropdown from "@/components/dashboard/NotificationsDropdown";
import { useTheme } from "@/hooks/use-theme";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

type DashboardSectionMeta = {
  label: string;
  content: React.ReactNode;
};

const DashboardContent = lazy(() => import("@/components/dashboard/DashboardContent"));
const MyAccountContent = lazy(() => import("@/components/dashboard/MyAccountContent"));
const VendaContent = lazy(() => import("@/components/dashboard/VendaContent"));
const ConsignacaoContent = lazy(() => import("@/components/dashboard/ConsignacaoContent"));
const CatalogoContent = lazy(() => import("@/components/dashboard/CatalogoContent"));
const SmartLockContent = lazy(() => import("@/components/dashboard/SmartLockContent"));
const PedidosContent = lazy(() => import("@/components/dashboard/PedidosContent"));
const SubestoquesContent = lazy(() => import("@/components/dashboard/SubestoquesContent"));
const SacolinhasContent = lazy(() => import("@/components/dashboard/SacolinhasContent"));
const InventarioContent = lazy(() => import("@/components/dashboard/InventarioContent"));
const ClientesContent = lazy(() => import("@/components/dashboard/ClientesContent"));
const CuponsContent = lazy(() => import("@/components/dashboard/CuponsContent"));
const PDVContent = lazy(() => import("@/components/dashboard/PDVContent"));
const RelatoriosContent = lazy(() => import("@/components/dashboard/RelatoriosContent"));
const ConfiguracoesContent = lazy(() => import("@/components/dashboard/ConfiguracoesContent"));
const ServicosContent = lazy(() => import("@/components/dashboard/ServicosContent"));
const FornecedoresContent = lazy(() => import("@/components/dashboard/FornecedoresContent"));
const NewsletterContent = lazy(() => import("@/components/dashboard/NewsletterContent"));
const FuncionariosContent = lazy(() => import("@/components/dashboard/FuncionariosContent"));
const BlogContent = lazy(() => import("@/components/dashboard/BlogContent"));
const LinktreeContent = lazy(() => import("@/components/dashboard/LinktreeContent"));
const LojasContent = lazy(() => import("@/components/dashboard/LojasContent"));
const MinhaLojaContent = lazy(() => import("@/components/dashboard/MinhaLojaContent"));
const SuporteContent = lazy(() => import("@/components/dashboard/SuporteContent"));

const SectionFallback = () => (
  <div className="rounded-xl border border-border bg-card p-6">
    <p className="text-sm text-muted-foreground" aria-live="polite">Carregando seção...</p>
  </div>
);

const AppHeader = ({ theme, toggleTheme, userName, sectionLabel }: { theme: string; toggleTheme: () => void; userName: string, sectionLabel: string }) => (
  <header className="flex h-14 items-center gap-4 border-b border-border px-4" aria-label="Cabeçalho do dashboard">
    <SidebarTrigger aria-label="Abrir ou recolher barra lateral" />
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <span className="text-muted-foreground">Dashboard</span>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{sectionLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
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
        {userName.charAt(0)}
      </div>
      <span className="hidden text-sm text-foreground sm:block">Olá, {userName}</span>
    </div>
  </header>
);

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
      dashboard: { label: "Dashboard", content: <DashboardContent onSectionChange={setActiveSection} /> },
      "minha-conta": { label: "Minha Conta", content: user ? <MyAccountContent user={user} /> : null },
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
      "minha-loja": { label: "Minha Loja", content: <MinhaLojaContent /> },
      suporte: { label: "Suporte", content: <SuporteContent /> },
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
          <AppHeader theme={theme} toggleTheme={toggleTheme} userName={user.name} sectionLabel={currentSection.label} />
          <main id="main-content" className="flex-1 overflow-auto p-4 sm:p-6" tabIndex={-1} aria-live="polite">
            <section aria-labelledby="dashboard-section-heading">
              <h1 ref={sectionHeadingRef} id="dashboard-section-heading" tabIndex={-1} className="mb-4 font-display text-2xl font-bold text-foreground focus:outline-none">
                {currentSection.label}
              </h1>
              <AnimatePresence mode="wait">
                <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <Suspense fallback={<SectionFallback />}>{currentSection.content}</Suspense>
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
