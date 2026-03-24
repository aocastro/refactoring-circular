import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import AdminPlanosContent from "@/components/admin/AdminPlanosContent";
import AdminLojasContent from "@/components/admin/AdminLojasContent";
import AdminFinanceiroContent from "@/components/admin/AdminFinanceiroContent";
import AdminUsuariosContent from "@/components/admin/AdminUsuariosContent";
import AdminESGContent from "@/components/admin/AdminESGContent";
import AdminBlockchainContent from "@/components/admin/AdminBlockchainContent";

const sectionComponents: Record<string, React.FC> = {
  dashboard: AdminDashboardContent,
  planos: AdminPlanosContent,
  lojas: AdminLojasContent,
  financeiro: AdminFinanceiroContent,
  usuarios: AdminUsuariosContent,
  esg: AdminESGContent,
  blockchain: AdminBlockchainContent,
};

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const ActiveComponent = sectionComponents[activeSection] || AdminDashboardContent;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-border px-4">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold text-foreground">Painel Administrativo</h1>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <ActiveComponent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
