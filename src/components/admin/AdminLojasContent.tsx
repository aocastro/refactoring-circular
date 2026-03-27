import api from "@/api/axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { Store, CheckCircle, XCircle, Clock, Eye, ExternalLink, ShieldCheck, Truck, Instagram, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterToolbar from "@/components/shared/FilterToolbar";
import DataTable from "@/components/shared/DataTable";
import PaginationControls from "@/components/shared/PaginationControls";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePagination } from "@/hooks/use-pagination";
import { useEffect } from "react";
import { type AdminStore } from "@/data/admin";
import { toast } from "sonner";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ativa": return <CheckCircle className="h-3.5 w-3.5 text-green-600" />;
    case "suspensa": return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    case "pendente": return <Clock className="h-3.5 w-3.5 text-yellow-500" />;
    default: return null;
  }
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
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminStores, setAdminStores] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_adminStores = await api.get('/api/admin/stores');
        setAdminStores(res_adminStores.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);



  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = adminStores.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, 10, page);

  const [selectedStore, setSelectedStore] = useState<AdminStore | null>(null);

  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

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
          data={paginatedItems}
          emptyMessage="Nenhuma loja encontrada."
          renderRow={(store: AdminStore) => (
            <tr key={store.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 text-sm text-foreground">{store.name}</td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{store.owner}</td>
              <td className="px-4 py-3 text-sm"><Badge variant="outline">{store.plan}</Badge></td>
              <td className="hidden px-4 py-3 text-right text-sm text-muted-foreground md:table-cell">{store.products}</td>
              <td className="px-4 py-3 text-right text-sm font-medium text-foreground">R$ {store.revenue.toLocaleString("pt-BR")}</td>
              <td className="px-4 py-3 text-sm">
                <span className="flex items-center gap-1.5 capitalize">{getStatusIcon(store.status)}{store.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedStore(store)} aria-label={`Ver loja ${store.name}`}><Eye className="h-4 w-4" /></Button>
                  {store.status === "pendente" && <Button size="sm" variant="outline" onClick={() => toast.success(`${store.name} aprovada`)}>Aprovar</Button>}
                  {store.status === "ativa" && <Button size="sm" variant="destructive" onClick={() => toast.success(`${store.name} suspensa`)}>Suspender</Button>}
                  {store.storeUrl && (
                    <Button variant="ghost" size="sm" asChild aria-label={`Acessar site da loja ${store.name}`}>
                      <a href={store.storeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          )}
        />
        <PaginationControls
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </motion.div>

      <Dialog open={!!selectedStore} onOpenChange={(open) => !open && setSelectedStore(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Painel de Acompanhamento: {selectedStore?.name}</span>
              <Badge variant="outline" className="mr-4">{selectedStore?.plan}</Badge>
            </DialogTitle>
            <DialogDescription>
              Proprietário: {selectedStore?.owner} | Email: {selectedStore?.email}
            </DialogDescription>
          </DialogHeader>

          {selectedStore && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground mb-1">Status da Loja</div>
                  <div className="font-medium capitalize flex items-center gap-1.5">
                    {getStatusIcon(selectedStore.status)} {selectedStore.status}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground mb-1">Clientes Cadastrados</div>
                  <div className="font-medium">{selectedStore.clients?.toLocaleString("pt-BR") || 0}</div>
                </div>
                {selectedStore.trialEnd && (
                  <div className="rounded-lg border p-3 col-span-2 bg-primary/5 border-primary/20">
                    <div className="text-sm text-primary font-medium mb-1">Período de Teste</div>
                    <div className="text-sm">Vencimento: {selectedStore.trialEnd}</div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 mt-2">Integrações Conectadas</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={selectedStore.integrations?.includes("PagBank") ? "default" : "secondary"}>
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> PagBank
                  </Badge>
                  <Badge variant={selectedStore.integrations?.includes("Melhor Envio") ? "default" : "secondary"}>
                    <Truck className="h-3.5 w-3.5 mr-1" /> Melhor Envio
                  </Badge>
                  <Badge variant={selectedStore.integrations?.includes("Instagram") ? "default" : "secondary"}>
                    <Instagram className="h-3.5 w-3.5 mr-1" /> Instagram
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 mt-2 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Log de Atividades (Recentes)
                </h4>
                <div className="space-y-2 border rounded-md p-3 text-sm h-32 overflow-y-auto">
                  <div className="flex justify-between border-b pb-1 last:border-0">
                    <span className="text-muted-foreground">Hoje, 10:23</span>
                    <span>Novo produto cadastrado</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 last:border-0">
                    <span className="text-muted-foreground">Ontem, 15:45</span>
                    <span>Venda realizada (R$ 150,00)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 last:border-0">
                    <span className="text-muted-foreground">22/10, 09:10</span>
                    <span>Integração com Instagram ativada</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLojasContent;
