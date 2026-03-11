import {
  LayoutDashboard,
  User,
  ShoppingCart,
  Handshake,
  DollarSign,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  { id: "minha-conta", title: "Minha Conta", icon: User },
  { id: "venda", title: "Venda", icon: ShoppingCart, disabled: true },
  { id: "consignacao", title: "Consignação", icon: Handshake, disabled: true },
  { id: "financeiro", title: "Financeiro", icon: DollarSign, disabled: true },
];

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold font-display text-sm shrink-0">
              C
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-foreground text-sm">
                Circular <span className="text-accent text-xs">u-Shar</span>
              </span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => !item.disabled && onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className={item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                    {!collapsed && item.disabled && (
                      <span className="ml-auto text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Em breve</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive cursor-pointer">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
