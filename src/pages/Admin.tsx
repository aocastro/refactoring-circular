import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ZoomIn, ZoomOut, Sun, Moon, X } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNotifications } from "@/components/admin/AdminNotifications";
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import AdminPlanosContent from "@/components/admin/AdminPlanosContent";
import AdminLojasContent from "@/components/admin/AdminLojasContent";
import AdminFinanceiroContent from "@/components/admin/AdminFinanceiroContent";
import AdminUsuariosContent from "@/components/admin/AdminUsuariosContent";
import AdminESGContent from "@/components/admin/AdminESGContent";
import AdminBlockchainContent from "@/components/admin/AdminBlockchainContent";
import AdminAuditContent from "@/components/admin/AdminAuditContent";
import AdminSuporteContent from "@/components/admin/AdminSuporteContent";
import AdminNPSContent from "@/components/admin/AdminNPSContent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { A11yIcon } from "@/components/icons/A11yIcon";
import { AccessibilityControlsInline } from "@/components/layout/AccessibilityMenu";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useTheme } from "@/hooks/use-theme";

const sectionComponents: Record<string, React.FC> = {
  dashboard: AdminDashboardContent,
  planos: AdminPlanosContent,
  lojas: AdminLojasContent,
  financeiro: AdminFinanceiroContent,
  usuarios: AdminUsuariosContent,
  esg: AdminESGContent,
  blockchain: AdminBlockchainContent,
  auditoria: AdminAuditContent,
  suporte: AdminSuporteContent,
  nps: AdminNPSContent,
};

const Admin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [a11yOpen, setA11yOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useAccessibility();

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (!auth) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const ActiveComponent = sectionComponents[activeSection] || AdminDashboardContent;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <span className="text-muted-foreground">Admin</span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">{activeSection.replace("-", " ")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={decreaseFontSize}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Diminuir fonte (atual: ${fontSize}px)`}
                  title="Diminuir fonte"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={increaseFontSize}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Aumentar fonte (atual: ${fontSize}px)`}
                  title="Aumentar fonte"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setA11yOpen((v) => !v)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    aria-label={a11yOpen ? "Fechar menu de acessibilidade" : "Abrir menu de acessibilidade"}
                    aria-expanded={a11yOpen}
                    title="Acessibilidade"
                  >
                    <A11yIcon className="h-5 w-5 text-current" aria-hidden="true" />
                  </button>

                  {a11yOpen && (
                    <div
                      role="dialog"
                      aria-label="Menu de acessibilidade"
                      className="absolute top-full right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border/50 bg-background/90 p-5 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <A11yIcon className="h-5 w-5 text-current" aria-hidden="true" />
                          <h2 className="font-display text-sm font-semibold text-foreground">Acessibilidade</h2>
                        </div>
                        <Button type="button" variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setA11yOpen(false)}>
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                      <AccessibilityControlsInline />
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title={theme === "dark" ? "Modo claro" : "Modo escuro"}
                  aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <div className="w-px h-6 bg-border mx-1" />
              </div>
              <AdminNotifications />
            </div>
          </header>

          {a11yOpen && (
            <div className="sm:hidden border-b border-border/50 bg-background/90 backdrop-blur-xl px-5 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200" aria-label="Menu de acessibilidade">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <A11yIcon className="h-5 w-5 text-current" aria-hidden="true" />
                  <h2 className="font-display text-sm font-semibold text-foreground">Acessibilidade</h2>
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Fechar" onClick={() => setA11yOpen(false)}>
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <AccessibilityControlsInline />
            </div>
          )}

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <ActiveComponent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
