import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/api/axios";
import DataTable from "@/components/shared/DataTable";
import PaginationControls from "@/components/shared/PaginationControls";
import { usePagination } from "@/hooks/use-pagination";

interface Marca {
  id: number;
  nome: string;
  status: "Ativo" | "Inativo";
}

const columns = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const AdminMarcasContent = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    status: "Ativo"
  });

  const fetchMarcas = async () => {
    try {
      const res = await api.get("/api/admin/marcas");
      setMarcas(res.data);
    } catch (err) {
      console.error("Error fetching marcas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = marcas.filter((m) =>
    m.nome.toLowerCase().includes(search.toLowerCase())
  );

  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, 10, page);

  const handleOpenModal = (marca?: Marca) => {
    if (marca) {
      setEditingMarca(marca);
      setFormData({ nome: marca.nome, status: marca.status });
    } else {
      setEditingMarca(null);
      setFormData({ nome: "", status: "Ativo" });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast.error("O nome da marca é obrigatório.");
      return;
    }

    try {
      if (editingMarca) {
        await api.put(`/api/admin/marcas/${editingMarca.id}`, formData);
        toast.success("Marca atualizada com sucesso!");
      } else {
        await api.post("/api/admin/marcas", formData);
        toast.success("Marca criada com sucesso!");
      }
      setModalOpen(false);
      fetchMarcas();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar marca.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta marca?")) return;
    try {
      await api.delete(`/api/admin/marcas/${id}`);
      toast.success("Marca excluída com sucesso!");
      fetchMarcas();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir marca.");
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Marcas</h2>
          <p className="text-sm text-muted-foreground">Gerencie as marcas disponíveis no sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Nova Marca
        </Button>
      </header>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar marcas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DataTable
          columns={columns}
          data={paginatedItems}
          emptyMessage="Nenhuma marca encontrada."
          renderRow={(marca: Marca) => (
            <tr key={marca.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 text-sm">{marca.id}</td>
              <td className="px-4 py-3 text-sm font-medium">{marca.nome}</td>
              <td className="px-4 py-3 text-sm">
                <Badge variant={marca.status === "Ativo" ? "default" : "secondary"}>
                  {marca.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(marca)} aria-label={`Editar ${marca.nome}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(marca.id)} aria-label={`Excluir ${marca.nome}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMarca ? "Editar Marca" : "Nova Marca"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Nike, Zara, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMarcasContent;
