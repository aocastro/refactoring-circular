import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { Link2, Plus, GripVertical, ExternalLink, Trash2, TrendingUp, MousePointerClick, Pencil, Smartphone, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import KpiCard from "@/components/shared/KpiCard";
import { toast } from "sonner";
import axios from "axios";
import { sanitizeUrl } from "@/lib/utils";

interface LinkItem {
  id: number;
  titulo: string;
  url: string;
  cliques: number;
  ativo: boolean;
}

const getStoreSlug = (): string => {
  try {
    const config = JSON.parse(localStorage.getItem("storeConfig") || "{}");
    return config.slug || "fashion-store";
  } catch { return "fashion-store"; }
};

const LinktreeContent = () => {
  const storeSlug = getStoreSlug();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ titulo: "", url: "" });

  const [profileImage, setProfileImage] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#f3f4f6");
  const [buttonColor, setButtonColor] = useState<string>("#ffffff");
  const [buttonTextColor, setButtonTextColor] = useState<string>("#000000");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinktree = async () => {
      try {
        const response = await axios.get(`/api/linktree/${storeSlug}`);
        const data = response.data;
        setLinks(data.links || []);
        setProfileImage(data.profileImage || "");
        setBackgroundImage(data.backgroundImage || "");
        setBackgroundColor(data.backgroundColor || "#f3f4f6");
        setButtonColor(data.buttonColor || "#ffffff");
        setButtonTextColor(data.buttonTextColor || "#000000");
      } catch (error) {
        console.error("Erro ao buscar linktree", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinktree();
  }, [storeSlug]);

  const handlePublish = async () => {
    try {
      const data = {
        links,
        profileImage,
        backgroundImage,
        backgroundColor,
        buttonColor,
        buttonTextColor
      };
      await axios.put(`/api/linktree/${storeSlug}`, data);
      toast.success("Linktree publicado com sucesso!");
    } catch (error) {
      toast.error("Erro ao publicar Linktree.");
    }
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section aria-label="Gestão de links" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Meu Linktree</h2>
          <p className="text-muted-foreground text-sm">Gerencie seus links compartilháveis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => window.open(`/links/${storeSlug}`, "_blank")}>
            <Eye className="h-4 w-4 mr-2" />Ver Linktree
          </Button>
          <Button size="sm" variant="secondary" onClick={handlePublish}>
            <Save className="h-4 w-4 mr-2" />Publicar
          </Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />Novo Link
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <KpiCard label="Total de Cliques" value={totalCliques.toLocaleString()} change="+15%" icon={MousePointerClick} positive delay={0} />
        <KpiCard label="Links Ativos" value={String(activeLinks)} icon={Link2} positive delay={0.05} />
        <KpiCard label="CTR Médio" value="4.2%" change="+0.8%" icon={TrendingUp} positive delay={0.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customização */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <h3 className="font-semibold text-foreground text-sm mb-2">Personalização</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Foto do Perfil</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setProfileImage)} className="text-sm" />
                  {profileImage && <Button variant="ghost" size="icon" onClick={() => setProfileImage("")} className="shrink-0"><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagem de Fundo</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setBackgroundImage)} className="text-sm" />
                  {backgroundImage && <Button variant="ghost" size="icon" onClick={() => setBackgroundImage("")} className="shrink-0"><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor de Fundo</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                  <Input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cores do Botão</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className="w-10 h-10 p-1 cursor-pointer shrink-0" title="Cor de Fundo" />
                    <span className="text-xs text-muted-foreground">Fundo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="color" value={buttonTextColor} onChange={(e) => setButtonTextColor(e.target.value)} className="w-10 h-10 p-1 cursor-pointer shrink-0" title="Cor do Texto" />
                    <span className="text-xs text-muted-foreground">Texto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
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
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => window.open(sanitizeUrl(link.url), "_blank")}>
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
        </div>

        {/* Mobile Preview */}
        <div className="lg:col-span-1 hidden lg:flex flex-col items-center">
          <div className="relative w-[280px] h-[580px] rounded-[3rem] border-8 border-secondary/50 bg-background overflow-hidden shadow-xl">
            <div className="absolute top-0 inset-x-0 h-6 bg-secondary/50 rounded-b-3xl mx-16 z-10" />
            <div
              className="h-full w-full overflow-y-auto overflow-x-hidden p-6 pt-12 no-scrollbar flex flex-col items-center gap-4 bg-cover bg-center"
              style={{
                backgroundColor: backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
              }}
            >
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 bg-background border-background/50 flex items-center justify-center shrink-0">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Smartphone className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="text-center mb-4">
                <h4 className="font-bold text-lg" style={{ color: buttonTextColor }}>@suamarca</h4>
                <p className="text-xs opacity-80" style={{ color: buttonTextColor }}>Confira nossos links abaixo</p>
              </div>

              <div className="w-full flex flex-col gap-3">
                {links.filter(l => l.ativo).map(link => (
                  <a key={link.id} href={sanitizeUrl(link.url)} target="_blank" rel="noopener noreferrer"
                     className="w-full py-3 px-4 rounded-xl shadow-sm text-center text-sm font-medium hover:scale-105 transition-transform duration-200"
                     style={{
                       backgroundColor: buttonColor,
                       color: buttonTextColor,
                       border: `1px solid ${buttonTextColor}20`
                     }}>
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
