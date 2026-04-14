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
  DollarSign,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { getPlanPermissions } from "@/lib/permissions";
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
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ElementType;
  children?: { id: string; title: string }[];
  externalLink?: string;
}

const getStoreSlug = (): string => {
  try {
    const config = JSON.parse(localStorage.getItem("storeConfig") || "{}");
    return config.slug || "fashion-store";
  } catch { return "fashion-store"; }
};

const menuItems: MenuItem[] = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
  { id: "minha-loja", title: "Minha Loja", icon: Store },
  { id: "minha-conta", title: "Minha Conta", icon: User },
  { id: "configuracoes", title: "Configurações", icon: Settings },
  { id: "financeiro", title: "Financeiro", icon: DollarSign, children: [
    { id: "financeiro-visao-geral", title: "Visão Geral" },
    { id: "financeiro-pagar", title: "Contas a Pagar" },
    { id: "financeiro-receber", title: "Contas a Receber" },
    { id: "financeiro-categorias", title: "Categorias" },
  ] },
  { id: "venda", title: "Venda", icon: ShoppingCart, children: [
    { id: "venda-produtos", title: "Produtos" },
    { id: "venda-smartlook", title: "SmartLook" },
    { id: "venda-pedidos", title: "Pedidos da Loja Online" },
    { id: "venda-subestoques", title: "Subestoques" },
    { id: "venda-sacolinhas", title: "Sacolinhas" },
  ] },
  { id: "servicos", title: "Serviços", icon: Scissors },
  { id: "inventario", title: "Inventário", icon: ClipboardList },
  { id: "consignantes", title: "Consignantes", icon: Handshake },
  { id: "fornecedores", title: "Fornecedores", icon: Truck },
  { id: "clientes", title: "Clientes", icon: Users },
  { id: "newsletter", title: "Newsletter", icon: Newspaper },
  { id: "pdv", title: "PDV", icon: Monitor },
  { id: "funcionarios", title: "Funcionários", icon: UserCog },
  { id: "cupons", title: "Cupons", icon: Ticket },
  { id: "relatorios", title: "Relatórios", icon: FileBarChart },
  { id: "blog", title: "Blog", icon: BookOpen },
  { id: "meu-linktree", title: "Meu Linktree", icon: Link2 },
  { id: "lojas", title: "Lojas", icon: Building2 },
  { id: "suporte", title: "Suporte / Tickets", icon: Ticket },
];

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const [userRole, setUserRole] = useState<string>("admin");
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [planMaxPerms, setPlanMaxPerms] = useState<string[]>([]);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.role === "lojista_funcionario") {
        setUserRole("lojista_funcionario");
        setUserPerms(u.permissoes || []);
      } else {
        setUserRole("admin");
      }

      const conf = JSON.parse(localStorage.getItem("storeConfig") || "{}");
      setPlanMaxPerms(getPlanPermissions(conf.planName));
    } catch {
      // fallback
    }
  }, []);

  const isChildActive = (item: MenuItem) => item.children?.some((c) => c.id === activeSection) ?? false;

  const isGroupOpen = (item: MenuItem) => openGroups[item.id] ?? isChildActive(item);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !isGroupOpen({ id, title: "", icon: LayoutDashboard, children: [] }) }));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border" aria-label="Barra lateral do dashboard">
      <SidebarContent className="pt-4">
        <div className="mb-6 px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Circular u-Shar" className="h-8 w-8 shrink-0 object-contain" />
            {!collapsed && (
              <span className="font-display text-sm font-bold text-foreground">
                Circular <span className="text-xs text-accent">u-Shar</span>
              </span>
            )}
          </div>
        </div>

        <nav aria-label="Navegação principal do dashboard">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems
                  .filter((item) => {
                    // Check plan max permissions first
                    if (!planMaxPerms.includes(item.id)) return false;

                    // If it's an employee, check their specific permissions
                    if (userRole === "lojista_funcionario") {
                      return userPerms.includes(item.id);
                    }

                    // Otherwise (store admin), show everything the plan allows
                    return true;
                  })
                  .map((item) =>
                  item.children ? (
                    <Collapsible key={item.id} open={isGroupOpen(item)}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          type="button"
                          className="cursor-pointer justify-between"
                          isActive={isChildActive(item)}
                          onClick={() => toggleGroup(item.id)}
                          aria-expanded={isGroupOpen(item)}
                          aria-controls={`dashboard-group-${item.id}`}
                        >
                          <span className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {!collapsed && <span>{item.title}</span>}
                          </span>
                          {!collapsed && (
                            <ChevronDown
                              className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isGroupOpen(item) ? "rotate-180" : ""}`}
                              aria-hidden="true"
                            />
                          )}
                        </SidebarMenuButton>
                        {!collapsed && (
                          <CollapsibleContent id={`dashboard-group-${item.id}`}>
                            <div className="ml-6 mt-1 space-y-0.5 border-l border-border pl-3">
                              {item.children.map((child) => (
                                <button
                                  key={child.id}
                                  type="button"
                                  onClick={() => {
                                    onSectionChange(child.id);
                                    setOpenMobile(false);
                                  }}
                                  aria-current={activeSection === child.id ? "page" : undefined}
                                  className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                                    activeSection === child.id
                                      ? "bg-primary/10 font-medium text-primary"
                                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
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
                        type="button"
                        onClick={() => window.open(item.externalLink, "_blank")}
                        className="cursor-pointer"
                        aria-label={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        {!collapsed && <span>{item.title}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        type="button"
                        onClick={() => {
                          onSectionChange(item.id);
                          setOpenMobile(false);
                        }}
                        isActive={activeSection === item.id}
                        className="cursor-pointer"
                        aria-current={activeSection === item.id ? "page" : undefined}
                        aria-label={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        {!collapsed && <span>{item.title}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton type="button" onClick={handleLogout} className="cursor-pointer text-destructive" aria-label="Sair da conta">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
