import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCog, Plus, Phone, Mail, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { toast } from "sonner";
import { getPlanPermissions } from "@/lib/permissions";

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  status: string;
  avatar: string;
  permissoes: string[];
}

const initialData: Funcionario[] = [
  { id: 1, nome: "Juliana Mendes", cargo: "Gerente", email: "juliana@loja.com", telefone: "(11) 99888-7766", status: "ativo", avatar: "JM", permissoes: ["dashboard", "venda", "clientes", "pdv", "relatorios", "cupons", "inventario"] },
  { id: 2, nome: "Carlos Ribeiro", cargo: "Vendedor", email: "carlos@loja.com", telefone: "(11) 99777-6655", status: "ativo", avatar: "CR", permissoes: ["dashboard", "venda", "pdv", "clientes"] },
  { id: 3, nome: "Fernanda Alves", cargo: "Costureira", email: "fernanda@loja.com", telefone: "(11) 99666-5544", status: "ativo", avatar: "FA", permissoes: ["dashboard", "servicos"] },
  { id: 4, nome: "Ricardo Lima", cargo: "Estoquista", email: "ricardo@loja.com", telefone: "(11) 99555-4433", status: "férias", avatar: "RL", permissoes: ["dashboard", "inventario", "venda"] },
  { id: 5, nome: "Beatriz Souza", cargo: "Vendedora", email: "beatriz@loja.com", telefone: "(11) 99444-3322", status: "ativo", avatar: "BS", permissoes: ["dashboard", "venda", "pdv", "clientes"] },
  { id: 6, nome: "Lucas Martins", cargo: "Social Media", email: "lucas@loja.com", telefone: "(11) 99333-2211", status: "inativo", avatar: "LM", permissoes: ["dashboard", "blog", "meu-linktree", "newsletter"] },
];

const statusColors: Record<string, string> = {
  ativo: "bg-success/10 text-success",
  inativo: "bg-destructive/10 text-destructive",
  férias: "bg-warning/10 text-warning",
};

const cargos = ["Todos", "Gerente", "Vendedor", "Vendedora", "Costureira", "Estoquista", "Social Media"];
const statusOptions = ["Todos", "ativo", "inativo", "férias"];

const FuncionariosContent = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterCargo, setFilterCargo] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{nome: string, cargo: string, email: string, telefone: string, status: string, permissoes: string[]}>({ nome: "", cargo: "", email: "", telefone: "", status: "ativo", permissoes: [] });
  const [availablePerms, setAvailablePerms] = useState<string[]>([]);

  useEffect(() => {
    try {
      const conf = JSON.parse(localStorage.getItem("storeConfig") || "{}");
      setAvailablePerms(getPlanPermissions(conf.planName));
    } catch {
      // fallback
    }
  }, []);

  const handleTogglePerm = (perm: string) => {
    setForm(prev => {
      if (prev.permissoes.includes(perm)) {
        return { ...prev, permissoes: prev.permissoes.filter(p => p !== perm) };
      }
      return { ...prev, permissoes: [...prev.permissoes, perm] };
    });
  };

  const filtered = funcionarios.filter((f) => {
    const matchSearch = f.nome.toLowerCase().includes(search.toLowerCase()) || f.cargo.toLowerCase().includes(search.toLowerCase());
    const matchCargo = filterCargo === "Todos" || f.cargo === filterCargo;
    const matchStatus = filterStatus === "Todos" || f.status === filterStatus;
    return matchSearch && matchCargo && matchStatus;
  });

  const handleEdit = (f: Funcionario) => {
    setForm({
      nome: f.nome,
      cargo: f.cargo,
      email: f.email,
      telefone: f.telefone,
      status: f.status,
      permissoes: f.permissoes,
    });
    setEditingId(f.id);
    setShowAddDialog(true);
  };

  const handleAdd = () => {
    if (!form.nome.trim() || !form.cargo.trim()) {
      toast.error("Nome e cargo são obrigatórios.");
      return;
    }

    if (editingId !== null) {
      setFuncionarios((prev) => prev.map((f) =>
        f.id === editingId
          ? { ...f, ...form }
          : f
      ));
      setForm({ nome: "", cargo: "", email: "", telefone: "", status: "ativo", permissoes: [] });
      setEditingId(null);
      setShowAddDialog(false);
      toast.success("Funcionário atualizado com sucesso!");
    } else {
      const initials = form.nome.split(" ").map((n) => n.charAt(0).toUpperCase()).slice(0, 2).join("");
      const newFunc: Funcionario = {
        id: Date.now(),
        nome: form.nome,
        cargo: form.cargo,
        email: form.email || `${form.nome.toLowerCase().split(" ")[0]}@loja.com`,
        telefone: form.telefone || "(00) 00000-0000",
        status: form.status || "ativo",
        avatar: initials,
        permissoes: form.permissoes,
      };
      setFuncionarios((prev) => [newFunc, ...prev]);
      setForm({ nome: "", cargo: "", email: "", telefone: "", status: "ativo", permissoes: [] });
      setShowAddDialog(false);
      toast.success(`Funcionário ${form.nome} cadastrado com sucesso!`);
    }
  };

  const handleDelete = (id: number) => {
    setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    toast.success("Funcionário removido.");
  };

  return (
    <section aria-label="Gestão de funcionários" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Funcionários</h2>
          <p className="text-muted-foreground text-sm">Gerencie a equipe da sua loja</p>
        </div>
        <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />Novo Funcionário
        </Button>
      </div>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar funcionário..."
        filters={[
          { key: "cargo", label: "Cargo", options: cargos, value: filterCargo, onChange: setFilterCargo },
          { key: "status", label: "Status", options: statusOptions, value: filterStatus, onChange: setFilterStatus },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f, i) => (
          <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">{f.avatar}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{f.nome}</h3>
                <p className="text-xs text-muted-foreground">{f.cargo}</p>
              </div>
              <Badge variant="outline" className={statusColors[f.status]}>{f.status}</Badge>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{f.email}</p>
              <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{f.telefone}</p>
            </div>
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleEdit(f)}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(f.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">Nenhum funcionário encontrado.</div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          setEditingId(null);
          setForm({ nome: "", cargo: "", email: "", telefone: "", status: "ativo", permissoes: [] });
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">{editingId ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome *</Label><Input placeholder="Nome completo" value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div>
              <Label>Cargo *</Label>
              <Select value={form.cargo} onValueChange={(v) => setForm((p) => ({ ...p, cargo: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                <SelectContent>
                  {cargos.filter((c) => c !== "Todos").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                <SelectContent>
                  {["ativo", "inativo", "férias"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>E-mail</Label><Input type="email" placeholder="email@loja.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>Telefone</Label><Input placeholder="(11) 99999-9999" value={form.telefone} onChange={(e) => setForm((p) => ({ ...p, telefone: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>

            <div className="space-y-2">
              <Label>Permissões</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border border-border rounded-md bg-secondary/50">
                {availablePerms.map(perm => (
                  <div key={perm} className="flex items-center space-x-2">
                    <Checkbox
                      id={`perm-${perm}`}
                      checked={form.permissoes.includes(perm)}
                      onCheckedChange={() => handleTogglePerm(perm)}
                    />
                    <label htmlFor={`perm-${perm}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {perm}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={handleAdd}>
              {editingId ? "Salvar Alterações" : "Cadastrar Funcionário"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FuncionariosContent;
