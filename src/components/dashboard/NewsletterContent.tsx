import { useState } from "react";
import { Users, Mail, Send, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";

const subscribers = [
  { id: 1, email: "maria@email.com", nome: "Maria Silva", data: "10/01/2026", status: "ativo" },
  { id: 2, email: "joao@email.com", nome: "João Santos", data: "15/01/2026", status: "ativo" },
  { id: 3, email: "ana@email.com", nome: "Ana Costa", data: "20/02/2026", status: "ativo" },
  { id: 4, email: "pedro@email.com", nome: "Pedro Lima", data: "05/03/2026", status: "inativo" },
  { id: 5, email: "carla@email.com", nome: "Carla Dias", data: "08/03/2026", status: "ativo" },
];

const campaigns = [
  { id: 1, titulo: "Novidades de Março", enviados: 342, abertos: 198, cliques: 45, data: "01/03/2026", status: "enviada" },
  { id: 2, titulo: "Promoção de Verão", enviados: 310, abertos: 215, cliques: 72, data: "15/02/2026", status: "enviada" },
  { id: 3, titulo: "Lançamento Coleção Eco", enviados: 0, abertos: 0, cliques: 0, data: "20/03/2026", status: "rascunho" },
];

const statusSubOptions = ["Todos", "ativo", "inativo"];
const statusCampOptions = ["Todos", "enviada", "rascunho"];

const NewsletterContent = () => {
  const [subSearch, setSubSearch] = useState("");
  const [subStatus, setSubStatus] = useState("Todos");
  const [campSearch, setCampSearch] = useState("");
  const [campStatus, setCampStatus] = useState("Todos");

  const filteredSubs = subscribers.filter((s) => {
    const matchSearch = s.email.includes(subSearch) || s.nome.toLowerCase().includes(subSearch.toLowerCase());
    const matchStatus = subStatus === "Todos" || s.status === subStatus;
    return matchSearch && matchStatus;
  });

  const filteredCamps = campaigns.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(campSearch.toLowerCase());
    const matchStatus = campStatus === "Todos" || c.status === campStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Newsletter</h1>
          <p className="text-muted-foreground text-sm">Gerencie assinantes e campanhas</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Nova Campanha</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Assinantes" value="342" change="+18" icon={Users} positive delay={0} />
        <KpiCard label="Taxa de Abertura" value="57%" change="+3%" icon={Mail} positive delay={0.05} />
        <KpiCard label="Taxa de Cliques" value="13%" change="+2%" icon={TrendingUp} positive delay={0.1} />
        <KpiCard label="Campanhas Enviadas" value="12" change="+2" icon={Send} positive delay={0.15} />
      </div>

      {/* Campanhas */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-sm">Campanhas</h3>
        <FilterToolbar
          search={campSearch}
          onSearchChange={setCampSearch}
          searchPlaceholder="Buscar campanha..."
          filters={[
            { key: "status", label: "Status", options: statusCampOptions, value: campStatus, onChange: setCampStatus },
          ]}
        />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Título</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Enviados</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Abertos</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Data</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCamps.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Nenhuma campanha encontrada.</td></tr>
              ) : filteredCamps.map((c) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{c.titulo}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{c.enviados}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{c.abertos}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{c.data}</td>
                  <td className="py-3 px-4">
                    <Badge variant={c.status === "enviada" ? "default" : "secondary"}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assinantes */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-sm">Assinantes</h3>
        <FilterToolbar
          search={subSearch}
          onSearchChange={setSubSearch}
          searchPlaceholder="Buscar assinante..."
          filters={[
            { key: "status", label: "Status", options: statusSubOptions, value: subStatus, onChange: setSubStatus },
          ]}
        />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nome</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">E-mail</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Data</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">Nenhum assinante encontrado.</td></tr>
              ) : filteredSubs.map((s) => (
                <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{s.nome}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.email}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{s.data}</td>
                  <td className="py-3 px-4">
                    <Badge variant={s.status === "ativo" ? "default" : "secondary"}>{s.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsletterContent;
