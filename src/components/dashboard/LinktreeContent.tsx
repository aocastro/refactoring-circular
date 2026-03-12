import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Plus, GripVertical, ExternalLink, Trash2, TrendingUp, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import KpiCard from "@/components/shared/KpiCard";
import { toast } from "sonner";

interface LinkItem {
  id: number;
  titulo: string;
  url: string;
  cliques: number;
  ativo: boolean;
}

const initialLinks: LinkItem[] = [
  { id: 1, titulo: "Loja Online", url: "https://fashionstore.com", cliques: 1240, ativo: true },
  { id: 2, titulo: "Instagram", url: "https://instagram.com/fashionstore", cliques: 890, ativo: true },
  { id: 3, titulo: "WhatsApp", url: "https://wa.me/5511999999999", cliques: 567, ativo: true },
  { id: 4, titulo: "Blog", url: "https://fashionstore.com/blog", cliques: 234, ativo: true },
  { id: 5, titulo: "Promoções", url: "https://fashionstore.com/promos", cliques: 456, ativo: false },
];

const LinktreeContent = () => {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({ titulo: "", url: "" });

  const totalCliques = links.reduce((a, l) => a + l.cliques, 0);
  const activeLinks = links.filter((l) => l.ativo).length;

  const handleAdd = () => {
    if (!form.titulo.trim() || !form.url.trim()) {
      toast.error("Título e URL são obrigatórios.");
      return;
    }
    const newLink: LinkItem = {
      id: Date.now(),
      titulo: form.titulo,
      url: form.url.startsWith("http") ? form.url : `https://${form.url}`,
      cliques: 0,
      ativo: true,
    };
    setLinks((prev) => [...prev, newLink]);
    setForm({ titulo: "", url: "" });
    setShowAddDialog(false);
    toast.success(`Link "${form.titulo}" adicionado!`);
  };

  const handleDelete = (id: number) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success("Link removido.");
  };

  const handleToggle = (id: number) => {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, ativo: !l.ativo } : l));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Meu Linktree</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus links compartilháveis</p>
        </div>
        <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />Novo Link
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <KpiCard label="Total de Cliques" value={totalCliques.toLocaleString()} change="+15%" icon={MousePointerClick} positive delay={0} />
        <KpiCard label="Links Ativos" value={String(activeLinks)} icon={Link2} positive delay={0.05} />
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
            <Switch checked={link.ativo} onCheckedChange={() => handleToggle(link.id)} />
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => window.open(link.url, "_blank")}>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => handleDelete(link.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        ))}
        {links.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-6">Nenhum link cadastrado.</p>
        )}
      </div>

      {/* Add Link Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">Novo Link</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input placeholder="Ex: Meu Instagram" value={form.titulo} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>URL *</Label><Input placeholder="https://exemplo.com" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={handleAdd}>Adicionar Link</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinktreeContent;
