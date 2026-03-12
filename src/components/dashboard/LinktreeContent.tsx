import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Plus, GripVertical, ExternalLink, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import KpiCard from "@/components/shared/KpiCard";
import { TrendingUp, MousePointerClick } from "lucide-react";

const links = [
  { id: 1, titulo: "Loja Online", url: "https://fashionstore.com", cliques: 1240, ativo: true },
  { id: 2, titulo: "Instagram", url: "https://instagram.com/fashionstore", cliques: 890, ativo: true },
  { id: 3, titulo: "WhatsApp", url: "https://wa.me/5511999999999", cliques: 567, ativo: true },
  { id: 4, titulo: "Blog", url: "https://fashionstore.com/blog", cliques: 234, ativo: true },
  { id: 5, titulo: "Promoções", url: "https://fashionstore.com/promos", cliques: 456, ativo: false },
];

const LinktreeContent = () => {
  const totalCliques = links.reduce((a, l) => a + l.cliques, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Meu Linktree</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus links compartilháveis</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Novo Link</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <KpiCard label="Total de Cliques" value={totalCliques.toLocaleString()} change="+15%" icon={MousePointerClick} positive delay={0} />
        <KpiCard label="Links Ativos" value={String(links.filter((l) => l.ativo).length)} icon={Link2} positive delay={0.05} />
        <KpiCard label="CTR Médio" value="4.2%" change="+0.8%" icon={TrendingUp} positive delay={0.1} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-sm mb-2">Seus Links</h3>
        {links.map((link, i) => (
          <motion.div key={link.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{link.titulo}</p>
              <p className="text-xs text-muted-foreground truncate">{link.url}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{link.cliques} cliques</span>
            <Switch checked={link.ativo} />
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><ExternalLink className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LinktreeContent;
