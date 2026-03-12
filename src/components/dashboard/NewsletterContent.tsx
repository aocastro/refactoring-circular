import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Users, Mail, Send, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import KpiCard from "@/components/shared/KpiCard";

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

const NewsletterContent = () => {
  const [search, setSearch] = useState("");
  const filtered = subscribers.filter((s) => s.email.includes(search) || s.nome.toLowerCase().includes(search.toLowerCase()));

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
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Campanhas Recentes</h3>
        </div>
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
            {campaigns.map((c) => (
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

      {/* Assinantes */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground text-sm">Assinantes</h3>
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs bg-secondary border-border text-sm h-8" />
        </div>
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
            {filtered.map((s) => (
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
  );
};

export default NewsletterContent;
