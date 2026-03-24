import { useState } from "react";
import { motion } from "framer-motion";
import { Store, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterToolbar from "@/components/shared/FilterToolbar";
import DataTable from "@/components/shared/DataTable";
import { adminStores, type AdminStore } from "@/data/admin";
import { toast } from "sonner";

const statusIcon: Record<string, React.ReactNode> = {
  ativa: <CheckCircle className="h-3.5 w-3.5 text-green-600" />,
  suspensa: <XCircle className="h-3.5 w-3.5 text-red-500" />,
  pendente: <Clock className="h-3.5 w-3.5 text-yellow-500" />,
};

const columns = [
  { key: "name", label: "Loja" },
  { key: "owner", label: "Proprietário", hideOn: "sm" as const },
  { key: "plan", label: "Plano" },
  { key: "products", label: "Produtos", align: "right" as const, hideOn: "md" as const },
  { key: "revenue", label: "Receita", align: "right" as const },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
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
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Nenhuma loja encontrada."
          renderRow={(store: AdminStore) => (
            <>
              <td className="px-4 py-3 text-sm text-foreground">{store.name}</td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{store.owner}</td>
              <td className="px-4 py-3 text-sm"><Badge variant="outline">{store.plan}</Badge></td>
              <td className="hidden px-4 py-3 text-right text-sm text-muted-foreground md:table-cell">{store.products}</td>
              <td className="px-4 py-3 text-right text-sm font-medium text-foreground">R$ {store.revenue.toLocaleString("pt-BR")}</td>
              <td className="px-4 py-3 text-sm">
                <span className="flex items-center gap-1.5 capitalize">{statusIcon[store.status]}{store.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" aria-label={`Ver loja ${store.name}`}><Eye className="h-4 w-4" /></Button>
                  {store.status === "pendente" && <Button size="sm" variant="outline" onClick={() => toast.success(`${store.name} aprovada`)}>Aprovar</Button>}
                  {store.status === "ativa" && <Button size="sm" variant="destructive" onClick={() => toast.success(`${store.name} suspensa`)}>Suspender</Button>}
                </div>
              </td>
            </>
          )}
        />
      </motion.div>
    </div>
  );
};

export default AdminLojasContent;
