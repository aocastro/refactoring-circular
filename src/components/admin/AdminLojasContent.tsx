import { useState } from "react";
import { motion } from "framer-motion";
import { Store, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterToolbar from "@/components/shared/FilterToolbar";
import DataTable from "@/components/shared/DataTable";
import { adminStores, type AdminStore } from "@/data/admin";
import type { TableColumn } from "@/types";
import { toast } from "sonner";

const statusIcon: Record<string, React.ReactNode> = {
  ativa: <CheckCircle className="h-3.5 w-3.5 text-green-600" />,
  suspensa: <XCircle className="h-3.5 w-3.5 text-red-500" />,
  pendente: <Clock className="h-3.5 w-3.5 text-yellow-500" />,
};

const columns: TableColumn<AdminStore>[] = [
  { key: "name", label: "Loja" },
  { key: "owner", label: "Proprietário", hideOn: "sm" },
  { key: "plan", label: "Plano" },
  { key: "products", label: "Produtos", align: "right", hideOn: "md" },
  { key: "revenue", label: "Receita", align: "right", render: (r) => `R$ ${r.revenue.toLocaleString("pt-BR")}` },
  { key: "status", label: "Status", render: (r) => (
    <span className="flex items-center gap-1.5 capitalize">{statusIcon[r.status]}{r.status}</span>
  )},
  { key: "actions", label: "", render: (r) => (
    <div className="flex gap-1">
      <Button variant="ghost" size="sm" aria-label={`Ver loja ${r.name}`}><Eye className="h-4 w-4" /></Button>
      {r.status === "pendente" && <Button size="sm" variant="outline" onClick={() => toast.success(`${r.name} aprovada`)}>Aprovar</Button>}
      {r.status === "ativa" && <Button size="sm" variant="destructive" onClick={() => toast.success(`${r.name} suspensa`)}>Suspender</Button>}
    </div>
  )},
];

const AdminLojasContent = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filtered = adminStores.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Lojas</h2>
          <p className="text-sm text-muted-foreground">Gerencie todas as lojas cadastradas na plataforma</p>
        </div>
        <Badge variant="outline" className="text-sm"><Store className="mr-1 h-4 w-4" />{adminStores.length} lojas</Badge>
      </header>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar loja ou proprietário..."
        filters={[{ key: "status", label: "Status", options: ["Todos", "ativa", "suspensa", "pendente"], value: statusFilter, onChange: setStatusFilter }]}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DataTable columns={columns} data={filtered} emptyMessage="Nenhuma loja encontrada." />
      </motion.div>
    </div>
  );
};

export default AdminLojasContent;
