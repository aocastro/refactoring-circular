import {
  LayoutDashboard,
  CreditCard,
  Store,
  DollarSign,
  Users,
  Leaf,
  Link2,
  LogOut,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
  { id: "planos", title: "Gestão de Planos", icon: CreditCard },
  { id: "lojas", title: "Gestão de Lojas", icon: Store },
  { id: "financeiro", title: "Financeiro", icon: DollarSign },
  { id: "usuarios", title: "Usuários", icon: Users },
  { id: "esg", title: "Impacto Ambiental", icon: Leaf },
  { id: "blockchain", title: "Blockchain", icon: Link2 },
  { id: "auditoria", title: "Auditoria", icon: FileText },
  { id: "nps", title: "NPS", icon: MessageSquare },
  { id: "suporte", title: "Suporte", icon: MessageSquare },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-border" aria-label="Menu admin">
      <SidebarContent className="pt-4">
        <div className="mb-6 px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Circular u-Shar" className="h-8 w-8 shrink-0 object-contain" />
            {!collapsed && (
              <span className="font-display text-sm font-bold text-foreground">
                Admin <span className="text-xs text-accent">Panel</span>
              </span>
            )}
          </div>
        </div>

        <nav aria-label="Navegação administrativa">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      type="button"
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className="cursor-pointer"
                      aria-current={activeSection === item.id ? "page" : undefined}
                      aria-label={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              onClick={() => navigate("/")}
              className="cursor-pointer text-destructive"
              aria-label="Sair do painel admin"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
