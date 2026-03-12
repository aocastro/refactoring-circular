import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Plus, Search, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const fornecedores = [
  { id: 1, nome: "Eco Têxteis Brasil", categoria: "Tecidos", contato: "(11) 3456-7890", email: "contato@ecotexteis.com.br", cidade: "São Paulo, SP", status: "ativo" },
  { id: 2, nome: "Cabides Sustentáveis", categoria: "Embalagens", contato: "(21) 2345-6789", email: "vendas@cabidessust.com", cidade: "Rio de Janeiro, RJ", status: "ativo" },
  { id: 3, nome: "Aviamentos Verde", categoria: "Aviamentos", contato: "(31) 9876-5432", email: "orcamento@aviamentosverde.com", cidade: "Belo Horizonte, MG", status: "ativo" },
  { id: 4, nome: "Tintas Naturais Co.", categoria: "Tingimento", contato: "(41) 8765-4321", email: "contato@tintasnaturais.com", cidade: "Curitiba, PR", status: "inativo" },
  { id: 5, nome: "Botões & Cia", categoria: "Aviamentos", contato: "(11) 5678-1234", email: "pedidos@botoescia.com.br", cidade: "São Paulo, SP", status: "ativo" },
];

const FornecedoresContent = () => {
  const [search, setSearch] = useState("");
  const filtered = fornecedores.filter((f) =>
    f.nome.toLowerCase().includes(search.toLowerCase()) || f.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Fornecedores</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus fornecedores e parceiros</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Novo Fornecedor</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar fornecedor..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f, i) => (
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
              <Badge variant={f.status === "ativo" ? "default" : "secondary"}>{f.status}</Badge>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{f.contato}</p>
              <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{f.email}</p>
              <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{f.cidade}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FornecedoresContent;
