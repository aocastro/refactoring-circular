import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { AccessibilityControls } from "@/components/layout/AccessibilityControls";

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
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Breadcrumb className="hidden md:flex">
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
                <AccessibilityControls />
                <div className="w-px h-6 bg-border mx-1" />
              </div>
              <div className="sm:hidden flex items-center gap-1">
                <AccessibilityControls />
              </div>
              <AdminNotifications />
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 w-full">
            <ActiveComponent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
