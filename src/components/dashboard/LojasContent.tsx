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
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Lojas</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas unidades e canais de venda com landmarks e ações acessíveis.</p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Loja</Button>
      </header>

      <section aria-labelledby="stores-filter-heading" aria-describedby="stores-filter-description" className="space-y-4">
        <div className="sr-only">
          <h3 id="stores-filter-heading">Filtros de lojas</h3>
          <p id="stores-filter-description">Busque por lojas e filtre por status e tipo.</p>
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
      </section>

      <section aria-labelledby="stores-list-heading" aria-describedby="stores-list-description" className="space-y-4">
        <div>
          <h3 id="stores-list-heading" className="text-sm font-semibold text-foreground">Unidades cadastradas</h3>
          <p id="stores-list-description" className="text-sm text-muted-foreground">Lista de lojas físicas e online com métricas resumidas e ações rápidas.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((loja, i) => (
            <motion.article key={loja.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="space-y-4 rounded-xl border border-border bg-card p-6" aria-labelledby={`store-card-${loja.id}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-foreground">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 id={`store-card-${loja.id}`} className="font-semibold text-foreground">{loja.nome}</h4>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{loja.endereco}</p>
                  </div>
                </div>
                <Badge variant="default">{loja.status}</Badge>
              </div>
              <dl className="flex gap-6 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Vendas (mês)</dt>
                  <dd className="font-bold text-foreground">{loja.vendas}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Receita (mês)</dt>
                  <dd className="font-bold text-foreground">{loja.receita}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tipo</dt>
                  <dd className="font-bold text-foreground">{loja.tipo}</dd>
                </div>
              </dl>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-border"><Settings className="mr-1 h-3.5 w-3.5" />Configurar</Button>
                <Button variant="outline" size="sm" className="border-border"><ExternalLink className="mr-1 h-3.5 w-3.5" />Visitar</Button>
              </div>
            </motion.article>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">Nenhuma loja encontrada.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LojasContent;
