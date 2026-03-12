import { useState } from "react";
import { motion } from "framer-motion";
import { UserCog, Plus, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterToolbar from "@/components/shared/FilterToolbar";

const funcionariosData = [
  { id: 1, nome: "Juliana Mendes", cargo: "Gerente", email: "juliana@loja.com", telefone: "(11) 99888-7766", status: "ativo", avatar: "JM" },
  { id: 2, nome: "Carlos Ribeiro", cargo: "Vendedor", email: "carlos@loja.com", telefone: "(11) 99777-6655", status: "ativo", avatar: "CR" },
  { id: 3, nome: "Fernanda Alves", cargo: "Costureira", email: "fernanda@loja.com", telefone: "(11) 99666-5544", status: "ativo", avatar: "FA" },
  { id: 4, nome: "Ricardo Lima", cargo: "Estoquista", email: "ricardo@loja.com", telefone: "(11) 99555-4433", status: "férias", avatar: "RL" },
  { id: 5, nome: "Beatriz Souza", cargo: "Vendedora", email: "beatriz@loja.com", telefone: "(11) 99444-3322", status: "ativo", avatar: "BS" },
  { id: 6, nome: "Lucas Martins", cargo: "Social Media", email: "lucas@loja.com", telefone: "(11) 99333-2211", status: "inativo", avatar: "LM" },
];

const statusColors: Record<string, string> = {
  ativo: "bg-success/10 text-success",
  inativo: "bg-destructive/10 text-destructive",
  férias: "bg-warning/10 text-warning",
};

const cargos = ["Todos", "Gerente", "Vendedor", "Vendedora", "Costureira", "Estoquista", "Social Media"];
const statusOptions = ["Todos", "ativo", "inativo", "férias"];

const FuncionariosContent = () => {
  const [search, setSearch] = useState("");
  const [filterCargo, setFilterCargo] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");

  const filtered = funcionariosData.filter((f) => {
    const matchSearch = f.nome.toLowerCase().includes(search.toLowerCase()) || f.cargo.toLowerCase().includes(search.toLowerCase());
    const matchCargo = filterCargo === "Todos" || f.cargo === filterCargo;
    const matchStatus = filterStatus === "Todos" || f.status === filterStatus;
    return matchSearch && matchCargo && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Funcionários</h1>
          <p className="text-muted-foreground text-sm">Gerencie a equipe da sua loja</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Novo Funcionário</Button>
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
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">Nenhum funcionário encontrado.</div>
        )}
      </div>
    </div>
  );
};

export default FuncionariosContent;
