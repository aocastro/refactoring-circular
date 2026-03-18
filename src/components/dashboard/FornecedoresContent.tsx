import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Plus, Search, Phone, Mail, MapPin, Edit, Trash2, Download } from "lucide-react";
import { exportToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import PaginationControls, { usePagination } from "@/components/shared/PaginationControls";

interface Fornecedor {
  id: number;
  nome: string;
  categoria: string;
  contato: string;
  email: string;
  cidade: string;
  status: string;
}

const fornecedorSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  categoria: z.string().trim().min(1, "Categoria é obrigatória"),
  contato: z.string().trim().min(1, "Telefone é obrigatório").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  cidade: z.string().trim().min(1, "Cidade é obrigatória").max(100),
});

const FornecedoresContent = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Fornecedor | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    { id: 1, nome: "Eco Têxteis Brasil", categoria: "Tecidos", contato: "(11) 3456-7890", email: "contato@ecotexteis.com.br", cidade: "São Paulo, SP", status: "ativo" },
    { id: 2, nome: "Cabides Sustentáveis", categoria: "Embalagens", contato: "(21) 2345-6789", email: "vendas@cabidessust.com", cidade: "Rio de Janeiro, RJ", status: "ativo" },
    { id: 3, nome: "Aviamentos Verde", categoria: "Aviamentos", contato: "(31) 9876-5432", email: "orcamento@aviamentosverde.com", cidade: "Belo Horizonte, MG", status: "ativo" },
    { id: 4, nome: "Tintas Naturais Co.", categoria: "Tingimento", contato: "(41) 8765-4321", email: "contato@tintasnaturais.com", cidade: "Curitiba, PR", status: "inativo" },
    { id: 5, nome: "Botões & Cia", categoria: "Aviamentos", contato: "(11) 5678-1234", email: "pedidos@botoescia.com.br", cidade: "São Paulo, SP", status: "ativo" },
    { id: 6, nome: "Malhas Premium", categoria: "Tecidos", contato: "(51) 3344-5566", email: "contato@malhaspremium.com", cidade: "Porto Alegre, RS", status: "ativo" },
    { id: 7, nome: "Embalagens Eco Pack", categoria: "Embalagens", contato: "(47) 3322-1100", email: "vendas@ecopack.com.br", cidade: "Joinville, SC", status: "ativo" },
    { id: 8, nome: "Zíperes Brasil", categoria: "Aviamentos", contato: "(11) 2233-4455", email: "comercial@ziperesbr.com", cidade: "São Paulo, SP", status: "ativo" },
    { id: 9, nome: "Corantes Naturais Ltda", categoria: "Tingimento", contato: "(71) 3456-7890", email: "vendas@corantesnaturais.com", cidade: "Salvador, BA", status: "inativo" },
    { id: 10, nome: "Fios Orgânicos Sul", categoria: "Tecidos", contato: "(48) 9876-5432", email: "contato@fiosorganicos.com", cidade: "Florianópolis, SC", status: "ativo" },
    { id: 11, nome: "Etiquetas Verdes", categoria: "Embalagens", contato: "(62) 3344-2211", email: "pedidos@etiquetasverdes.com", cidade: "Goiânia, GO", status: "ativo" },
    { id: 12, nome: "Linhas & Agulhas", categoria: "Aviamentos", contato: "(85) 2233-4455", email: "vendas@linhasagulhas.com", cidade: "Fortaleza, CE", status: "ativo" },
    { id: 13, nome: "Tecidos Reciclados Norte", categoria: "Tecidos", contato: "(92) 3456-7890", email: "contato@tecidosreciclados.com", cidade: "Manaus, AM", status: "inativo" },
  ]);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contato, setContato] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");

  const filtered = fornecedores.filter((f) =>
    f.nome.toLowerCase().includes(search.toLowerCase()) || f.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const [page, setPage] = useState(1);
  const perPage = 6;
  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, perPage, page);

  const resetForm = () => { setNome(""); setCategoria(""); setContato(""); setEmail(""); setCidade(""); setEditing(null); setErrors({}); };

  const openEdit = (f: Fornecedor) => {
    setEditing(f);
    setNome(f.nome);
    setCategoria(f.categoria);
    setContato(f.contato);
    setEmail(f.email);
    setCidade(f.cidade);
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    const result = fornecedorSchema.safeParse({ nome, categoria, contato, email, cidade });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
      setErrors(fieldErrors);
      return;
    }
    if (editing) {
      setFornecedores((prev) => prev.map((f) => f.id === editing.id ? { ...f, nome, categoria, contato, email, cidade } : f));
      toast.success("Fornecedor atualizado!");
    } else {
      setFornecedores((prev) => [...prev, { id: Date.now(), nome, categoria, contato, email, cidade, status: "ativo" }]);
      toast.success("Fornecedor criado!");
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
    toast.success("Fornecedor removido!");
  };

  return (
    <section aria-label="Gestão de fornecedores" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Fornecedores</h2>
          <p className="text-muted-foreground text-sm">Gerencie seus fornecedores e parceiros</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border" onClick={() => exportToCSV(fornecedores.map(f => ({ Nome: f.nome, Categoria: f.categoria, Telefone: f.contato, Email: f.email, Cidade: f.cidade, Status: f.status })), "fornecedores")}><Download className="h-4 w-4 mr-2" />Exportar</Button>
          <Button size="sm" onClick={() => { resetForm(); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Novo Fornecedor</Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar fornecedor..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedItems.map((f, i) => (
          <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{f.nome}</h3>
                  <p className="text-xs text-muted-foreground">{f.categoria}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(f)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(f.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{f.contato}</p>
              <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{f.email}</p>
              <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{f.cidade}</p>
            </div>
            <Badge variant={f.status === "ativo" ? "default" : "secondary"}>{f.status}</Badge>
          </motion.div>
        ))}
      </div>

      <PaginationControls currentPage={safePage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={perPage} onPageChange={setPage} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">{editing ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da empresa" className="bg-secondary border-border" />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {["Tecidos", "Embalagens", "Aviamentos", "Tingimento", "Outros"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && <p className="text-xs text-destructive">{errors.categoria}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={contato} onChange={(e) => setContato(e.target.value)} placeholder="(00) 0000-0000" className="bg-secondary border-border" />
                {errors.contato && <p className="text-xs text-destructive">{errors.contato}</p>}
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@empresa.com" className="bg-secondary border-border" />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade, UF" className="bg-secondary border-border" />
              {errors.cidade && <p className="text-xs text-destructive">{errors.cidade}</p>}
            </div>
            <Button onClick={handleSave} className="w-full">{editing ? "Salvar Alterações" : "Criar Fornecedor"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FornecedoresContent;
