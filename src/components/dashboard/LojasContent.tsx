import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, MapPin, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterToolbar from "@/components/shared/FilterToolbar";

const lojasData = [
  { id: 1, nome: "Fashion Store — Vila Madalena", endereco: "Rua Harmonia, 123 — São Paulo, SP", status: "ativa", vendas: 87, receita: "R$ 12.450", tipo: "Física" },
  { id: 2, nome: "Fashion Store — Pinheiros", endereco: "Rua dos Pinheiros, 456 — São Paulo, SP", status: "ativa", vendas: 62, receita: "R$ 8.900", tipo: "Física" },
  { id: 3, nome: "Fashion Store — Online", endereco: "fashionstore.com.br", status: "ativa", vendas: 134, receita: "R$ 19.200", tipo: "Online" },
];

const statusOptions = ["Todos", "ativa", "inativa"];
const tipoOptions = ["Todos", "Física", "Online"];

const LojasContent = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterTipo, setFilterTipo] = useState("Todos");

  const filtered = lojasData.filter((l) => {
    const matchSearch = l.nome.toLowerCase().includes(search.toLowerCase()) || l.endereco.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Todos" || l.status === filterStatus;
    const matchTipo = filterTipo === "Todos" || l.tipo === filterTipo;
    return matchSearch && matchStatus && matchTipo;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Lojas</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas unidades e canais de venda</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Nova Loja</Button>
      </div>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar loja..."
        filters={[
          { key: "status", label: "Status", options: statusOptions, value: filterStatus, onChange: setFilterStatus },
          { key: "tipo", label: "Tipo", options: tipoOptions, value: filterTipo, onChange: setFilterTipo },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((loja, i) => (
          <motion.div key={loja.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{loja.nome}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{loja.endereco}</p>
                </div>
              </div>
              <Badge variant="default">{loja.status}</Badge>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Vendas (mês)</p>
                <p className="font-bold text-foreground">{loja.vendas}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Receita (mês)</p>
                <p className="font-bold text-foreground">{loja.receita}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Tipo</p>
                <p className="font-bold text-foreground">{loja.tipo}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border"><Settings className="h-3.5 w-3.5 mr-1" />Configurar</Button>
              <Button variant="outline" size="sm" className="border-border"><ExternalLink className="h-3.5 w-3.5 mr-1" />Visitar</Button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">Nenhuma loja encontrada.</div>
        )}
      </div>
    </div>
  );
};

export default LojasContent;
