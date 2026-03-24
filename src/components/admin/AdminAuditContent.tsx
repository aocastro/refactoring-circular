import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Shield, Store, CreditCard, Users, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import FilterToolbar from "@/components/shared/FilterToolbar";
import DataTable from "@/components/shared/DataTable";

interface AuditLog {
  id: number;
  action: string;
  category: "store" | "plan" | "user" | "config" | "financial";
  actor: string;
  target: string;
  details: string;
  timestamp: string;
  ip: string;
}

const logs: AuditLog[] = [
  { id: 1, action: "Loja aprovada", category: "store", actor: "Admin Master", target: "Circular Shop", details: "Loja aprovada e ativada na plataforma", timestamp: "Hoje, 14:32", ip: "189.42.xxx.xxx" },
  { id: 2, action: "Plano alterado", category: "plan", actor: "Admin Master", target: "Fashion Store", details: "Upgrade de Essential para Growth", timestamp: "Hoje, 11:15", ip: "189.42.xxx.xxx" },
  { id: 3, action: "Usuário bloqueado", category: "user", actor: "Admin Master", target: "Fernanda Alves", details: "Bloqueio por inadimplência (3 meses)", timestamp: "Hoje, 10:00", ip: "189.42.xxx.xxx" },
  { id: 4, action: "Loja suspensa", category: "store", actor: "Sistema", target: "Second Hand SP", details: "Suspensão automática por falta de pagamento", timestamp: "Ontem, 18:45", ip: "—" },
  { id: 5, action: "Comissão processada", category: "financial", actor: "Sistema", target: "8 lojas", details: "Distribuição mensal de comissões — R$ 2.400", timestamp: "Ontem, 15:00", ip: "—" },
  { id: 6, action: "Configuração alterada", category: "config", actor: "Admin Master", target: "Plataforma", details: "Taxa de comissão atualizada de 12% para 10%", timestamp: "Ontem, 09:30", ip: "189.42.xxx.xxx" },
  { id: 7, action: "Usuário desbloqueado", category: "user", actor: "Admin Master", target: "Pedro Costa", details: "Desbloqueio manual após regularização", timestamp: "22/12, 16:00", ip: "189.42.xxx.xxx" },
  { id: 8, action: "Novo plano criado", category: "plan", actor: "Admin Master", target: "Plano Enterprise", details: "Plano customizado para grandes redes", timestamp: "22/12, 10:00", ip: "189.42.xxx.xxx" },
  { id: 9, action: "Loja aprovada", category: "store", actor: "Admin Master", target: "GreenWear", details: "Aprovação com verificação de documentos", timestamp: "20/12, 14:20", ip: "189.42.xxx.xxx" },
  { id: 10, action: "Backup realizado", category: "config", actor: "Sistema", target: "Banco de dados", details: "Backup automático diário concluído", timestamp: "20/12, 03:00", ip: "—" },
];

const categoryIcon: Record<string, React.ReactNode> = {
  store: <Store className="h-4 w-4 text-blue-500" />,
  plan: <CreditCard className="h-4 w-4 text-purple-500" />,
  user: <Users className="h-4 w-4 text-amber-500" />,
  config: <Settings className="h-4 w-4 text-muted-foreground" />,
  financial: <Shield className="h-4 w-4 text-green-600" />,
};

const categoryLabel: Record<string, string> = {
  store: "Loja",
  plan: "Plano",
  user: "Usuário",
  config: "Sistema",
  financial: "Financeiro",
};

const columns = [
  { key: "action", label: "Ação" },
  { key: "actor", label: "Autor / Alvo", hideOn: "sm" as const },
  { key: "details", label: "Detalhes", hideOn: "md" as const },
  { key: "timestamp", label: "Data/Hora" },
  { key: "ip", label: "IP", align: "right" as const, hideOn: "lg" as const },
];

const AdminAuditContent = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "Todos" || l.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Logs de Auditoria</h2>
          <p className="text-sm text-muted-foreground">Histórico de ações administrativas na plataforma</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <FileText className="mr-1 h-4 w-4" />{logs.length} registros
        </Badge>
      </header>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por ação, alvo ou autor..."
        filters={[{
          key: "category",
          label: "Categoria",
          options: ["Todos", "store", "plan", "user", "config", "financial"],
          value: categoryFilter,
          onChange: setCategoryFilter,
        }]}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Nenhum registro encontrado."
          renderRow={(log: AuditLog) => (
            <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">{categoryIcon[log.category]}</div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{log.action}</span>
                      <Badge variant="outline" className="text-[10px]">{categoryLabel[log.category]}</Badge>
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                <span className="font-medium text-foreground">{log.actor}</span> → {log.target}
              </td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                {log.details}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {log.timestamp}
              </td>
              <td className="hidden px-4 py-3 text-right font-mono text-[10px] text-muted-foreground lg:table-cell">
                {log.ip}
              </td>
            </tr>
          )}
        />
      </motion.div>
    </div>
  );
};

export default AdminAuditContent;
