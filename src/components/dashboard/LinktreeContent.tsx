import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Link2, Plus, GripVertical, ExternalLink, Trash2, TrendingUp, MousePointerClick, Pencil, Smartphone } from "lucide-react";
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ titulo: "", url: "" });

  const totalCliques = links.reduce((a, l) => a + l.cliques, 0);
  const activeLinks = links.filter((l) => l.ativo).length;

  const handleAdd = () => {
    if (!form.titulo.trim() || !form.url.trim()) {
      toast.error("Título e URL são obrigatórios.");
      return;
    }

    const formattedUrl = form.url.startsWith("http") ? form.url : `https://${form.url}`;

    if (editingId) {
      setLinks((prev) => prev.map(l => l.id === editingId ? { ...l, titulo: form.titulo, url: formattedUrl } : l));
      toast.success(`Link "${form.titulo}" atualizado!`);
    } else {
      const newLink: LinkItem = {
        id: Date.now(),
        titulo: form.titulo,
        url: formattedUrl,
        cliques: 0,
        ativo: true,
      };
      setLinks((prev) => [...prev, newLink]);
      toast.success(`Link "${form.titulo}" adicionado!`);
    }

    setForm({ titulo: "", url: "" });
    setEditingId(null);
    setShowAddDialog(false);
  };

  const openEdit = (link: LinkItem) => {
    setForm({ titulo: link.titulo, url: link.url });
    setEditingId(link.id);
    setShowAddDialog(true);
  };

  const handleDelete = (id: number) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success("Link removido.");
  };

  const handleToggle = (id: number) => {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, ativo: !l.ativo } : l));
  };

  return (
    <section aria-label="Gestão de links" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Meu Linktree</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-semibold text-foreground text-sm mb-2">Seus Links</h3>
          <Reorder.Group axis="y" values={links} onReorder={setLinks} className="space-y-3">
            {links.map((link, i) => (
              <Reorder.Item key={link.id} value={link} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-default">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{link.titulo}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{link.cliques} cliques</span>
                <Switch checked={link.ativo} onCheckedChange={() => handleToggle(link.id)} />
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => openEdit(link)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => window.open(link.url, "_blank")}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => handleDelete(link.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {links.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-6">Nenhum link cadastrado.</p>
          )}
        </div>

        {/* Mobile Preview */}
        <div className="lg:col-span-1 hidden lg:flex flex-col items-center">
          <div className="relative w-[280px] h-[580px] rounded-[3rem] border-8 border-secondary/50 bg-background overflow-hidden shadow-xl">
            <div className="absolute top-0 inset-x-0 h-6 bg-secondary/50 rounded-b-3xl mx-16 z-10" />
            <div className="h-full w-full overflow-y-auto overflow-x-hidden p-6 pt-12 no-scrollbar bg-gradient-to-b from-secondary/20 to-background flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-primary p-[2px]">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h4 className="font-bold text-lg">@suamarca</h4>
                <p className="text-xs text-muted-foreground">Confira nossos links abaixo</p>
              </div>

              <div className="w-full flex flex-col gap-3">
                {links.filter(l => l.ativo).map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                     className="w-full py-3 px-4 rounded-xl bg-card border border-border shadow-sm text-center text-sm font-medium hover:scale-105 transition-transform duration-200">
                    {link.titulo}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Link Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          setForm({ titulo: "", url: "" });
          setEditingId(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">{editingId ? 'Editar Link' : 'Novo Link'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input placeholder="Ex: Meu Instagram" value={form.titulo} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label>URL *</Label><Input placeholder="https://exemplo.com" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={handleAdd}>
              {editingId ? 'Salvar Alterações' : 'Adicionar Link'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LinktreeContent;
