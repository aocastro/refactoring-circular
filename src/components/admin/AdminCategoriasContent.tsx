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

interface Categoria {
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

const AdminCategoriasContent = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    status: "Ativo"
  });

  const fetchCategorias = async () => {
    try {
      const res = await api.get("/api/admin/categorias");
      setCategorias(res.data);
    } catch (err) {
      console.error("Error fetching categorias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = categorias.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, 10, page);

  const handleOpenModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({ nome: categoria.nome, status: categoria.status });
    } else {
      setEditingCategoria(null);
      setFormData({ nome: "", status: "Ativo" });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast.error("O nome da categoria é obrigatório.");
      return;
    }

    try {
      if (editingCategoria) {
        await api.put(`/api/admin/categorias/${editingCategoria.id}`, formData);
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await api.post("/api/admin/categorias", formData);
        toast.success("Categoria criada com sucesso!");
      }
      setModalOpen(false);
      fetchCategorias();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar categoria.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await api.delete(`/api/admin/categorias/${id}`);
      toast.success("Categoria excluída com sucesso!");
      fetchCategorias();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir categoria.");
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Categorias</h2>
          <p className="text-sm text-muted-foreground">Gerencie as categorias disponíveis no sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Nova Categoria
        </Button>
      </header>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar categorias..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DataTable
          columns={columns}
          data={paginatedItems}
          emptyMessage="Nenhuma categoria encontrada."
          renderRow={(categoria: Categoria) => (
            <tr key={categoria.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 text-sm">{categoria.id}</td>
              <td className="px-4 py-3 text-sm font-medium">{categoria.nome}</td>
              <td className="px-4 py-3 text-sm">
                <Badge variant={categoria.status === "Ativo" ? "default" : "secondary"}>
                  {categoria.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(categoria)} aria-label={`Editar ${categoria.nome}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(categoria.id)} aria-label={`Excluir ${categoria.nome}`}>
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
            <DialogTitle>{editingCategoria ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Roupas, Calçados, etc."
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

export default AdminCategoriasContent;
