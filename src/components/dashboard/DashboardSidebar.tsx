import {
  LayoutDashboard,
  Store,
  User,
  Settings,
  ShoppingCart,
  Scissors,
  ClipboardList,
  Handshake,
  Truck,
  Users,
  Newspaper,
  Monitor,
  UserCog,
  Ticket,
  FileBarChart,
  BookOpen,
  Link2,
  Building2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ElementType;
  children?: { id: string; title: string }[];
  externalLink?: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
  { id: "minha-loja", title: "Minha Loja", icon: Store, externalLink: "/loja/fashion-store" },
  { id: "minha-conta", title: "Minha Conta", icon: User },
  { id: "configuracoes", title: "Configurações", icon: Settings },
  {
    id: "venda",
    title: "Venda",
    icon: ShoppingCart,
    children: [
      { id: "venda-produtos", title: "Produtos" },
      { id: "venda-pedidos", title: "Pedidos" },
      { id: "venda-catalogo", title: "Catálogo" },
    ],
  },
  {
    id: "servicos",
    title: "Serviços",
    icon: Scissors,
    children: [
      { id: "servicos-agendamentos", title: "Agendamentos" },
      { id: "servicos-lista", title: "Lista de Serviços" },
    ],
  },
  { id: "inventario", title: "Inventário", icon: ClipboardList },
  { id: "consignantes", title: "Consignantes", icon: Handshake },
  { id: "fornecedores", title: "Fornecedores", icon: Truck },
  { id: "clientes", title: "Clientes", icon: Users },
  { id: "newsletter", title: "Newsletter", icon: Newspaper },
  {
    id: "pdv",
    title: "PDV",
    icon: Monitor,
    children: [
      { id: "pdv-caixa", title: "Caixa" },
      { id: "pdv-historico", title: "Histórico" },
    ],
  },
  { id: "funcionarios", title: "Funcionários", icon: UserCog },
  { id: "cupons", title: "Cupons", icon: Ticket },
  { id: "relatorios", title: "Relatórios", icon: FileBarChart },
  {
    id: "blog",
    title: "Blog",
    icon: BookOpen,
    children: [
      { id: "blog-posts", title: "Posts" },
      { id: "blog-categorias", title: "Categorias" },
    ],
  },
  { id: "meu-linktree", title: "Meu Linktree", icon: Link2 },
  { id: "lojas", title: "Lojas", icon: Building2 },
];

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isChildActive = (item: MenuItem) =>
    item.children?.some((c) => c.id === activeSection) ?? false;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Circular u-Shar" className="w-8 h-8 object-contain shrink-0" />
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
              {menuItems.map((item) =>
                item.children ? (
                  <Collapsible
                    key={item.id}
                    open={openGroups[item.id] || isChildActive(item)}
                    onOpenChange={() => toggleGroup(item.id)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="cursor-pointer justify-between"
                          isActive={isChildActive(item)}
                        >
                          <span className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.title}</span>}
                          </span>
                          {!collapsed && (
                            <ChevronDown
                              className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                                openGroups[item.id] || isChildActive(item) ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <div className="ml-6 mt-1 space-y-0.5 border-l border-border pl-3">
                            {item.children.map((child) => (
                              <button
                                key={child.id}
                                onClick={() => onSectionChange(child.id)}
                                className={`block w-full text-left text-sm py-1.5 px-2 rounded-md transition-colors ${
                                  activeSection === child.id
                                    ? "text-primary font-medium bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                }`}
                              >
                                {child.title}
                              </button>
                            ))}
                          </div>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                ) : item.externalLink ? (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => window.open(item.externalLink, "_blank")}
                      className="cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className="cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
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
