import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Tag, Plus, Eye, Edit, Trash2 } from "lucide-react";
import PaginationControls, { usePagination } from "@/components/shared/PaginationControls";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  defaultTab?: string;
}

interface Post {
  id: number;
  titulo: string;
  categoria: string;
  data: string;
  views: number;
  status: string;
  conteudo?: string;
}

interface Categoria {
  id: number;
  nome: string;
  posts: number;
  cor: string;
}

const postSchema = z.object({
  titulo: z.string().trim().min(1, "Título é obrigatório").max(200),
  categoria: z.string().trim().min(1, "Selecione uma categoria"),
  conteudo: z.string().trim().min(1, "Conteúdo é obrigatório").max(10000),
  status: z.string().trim().min(1, "Selecione o status"),
});

const categoriaSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(50),
});

const statusColors: Record<string, string> = {
  publicado: "bg-success/10 text-success",
  rascunho: "bg-muted text-muted-foreground",
  agendado: "bg-warning/10 text-warning",
};

const BlogContent = ({ defaultTab = "posts" }: Props) => {
  const [postsList, setPostsList] = useState<Post[]>([
    { id: 1, titulo: "Como cuidar de roupas vintage", categoria: "Dicas", data: "10/03/2026", views: 234, status: "publicado", conteudo: "Conteúdo do post..." },
    { id: 2, titulo: "5 tendências de moda circular", categoria: "Tendências", data: "05/03/2026", views: 187, status: "publicado", conteudo: "Conteúdo..." },
    { id: 3, titulo: "Guia de upcycling para iniciantes", categoria: "Tutoriais", data: "01/03/2026", views: 312, status: "publicado", conteudo: "Conteúdo..." },
    { id: 4, titulo: "O impacto da moda sustentável", categoria: "Sustentabilidade", data: "20/03/2026", views: 0, status: "rascunho", conteudo: "Rascunho..." },
    { id: 5, titulo: "Novidades da coleção outono", categoria: "Novidades", data: "25/03/2026", views: 0, status: "agendado", conteudo: "Em breve..." },
  ]);

  const [categoriasList, setCategoriasList] = useState<Categoria[]>([
    { id: 1, nome: "Dicas", posts: 8, cor: "hsl(var(--primary))" },
    { id: 2, nome: "Tendências", posts: 5, cor: "hsl(var(--accent))" },
    { id: 3, nome: "Tutoriais", posts: 4, cor: "hsl(var(--success))" },
    { id: 4, nome: "Sustentabilidade", posts: 6, cor: "hsl(var(--chart-4))" },
    { id: 5, nome: "Novidades", posts: 3, cor: "hsl(var(--chart-5))" },
  ]);

  const [postDialog, setPostDialog] = useState(false);
  const [catDialog, setCatDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingCat, setEditingCat] = useState<Categoria | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Post form
  const [pTitulo, setPTitulo] = useState("");
  const [pCategoria, setPCategoria] = useState("");
  const [pConteudo, setPConteudo] = useState("");
  const [pStatus, setPStatus] = useState("rascunho");

  // Categoria form
  const [cNome, setCNome] = useState("");

  const resetPostForm = () => { setPTitulo(""); setPCategoria(""); setPConteudo(""); setPStatus("rascunho"); setEditingPost(null); setErrors({}); };
  const resetCatForm = () => { setCNome(""); setEditingCat(null); setErrors({}); };

  const openEditPost = (p: Post) => {
    setEditingPost(p);
    setPTitulo(p.titulo);
    setPCategoria(p.categoria);
    setPConteudo(p.conteudo || "");
    setPStatus(p.status);
    setErrors({});
    setPostDialog(true);
  };

  const openEditCat = (c: Categoria) => {
    setEditingCat(c);
    setCNome(c.nome);
    setErrors({});
    setCatDialog(true);
  };

  const handleSavePost = () => {
    const result = postSchema.safeParse({ titulo: pTitulo, categoria: pCategoria, conteudo: pConteudo, status: pStatus });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
      setErrors(fieldErrors);
      return;
    }
    const today = new Date().toLocaleDateString("pt-BR");
    if (editingPost) {
      setPostsList((prev) => prev.map((p) => p.id === editingPost.id ? { ...p, titulo: pTitulo, categoria: pCategoria, conteudo: pConteudo, status: pStatus } : p));
      toast.success("Post atualizado!");
    } else {
      setPostsList((prev) => [...prev, { id: Date.now(), titulo: pTitulo, categoria: pCategoria, data: today, views: 0, status: pStatus, conteudo: pConteudo }]);
      toast.success("Post criado!");
    }
    setPostDialog(false);
    resetPostForm();
  };

  const handleSaveCat = () => {
    const result = categoriaSchema.safeParse({ nome: cNome });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
      setErrors(fieldErrors);
      return;
    }
    if (editingCat) {
      setCategoriasList((prev) => prev.map((c) => c.id === editingCat.id ? { ...c, nome: cNome } : c));
      toast.success("Categoria atualizada!");
    } else {
      setCategoriasList((prev) => [...prev, { id: Date.now(), nome: cNome, posts: 0, cor: "hsl(var(--primary))" }]);
      toast.success("Categoria criada!");
    }
    setCatDialog(false);
    resetCatForm();
  };

  const deletePost = (id: number) => { setPostsList((prev) => prev.filter((p) => p.id !== id)); toast.success("Post removido!"); };
  const deleteCat = (id: number) => { setCategoriasList((prev) => prev.filter((c) => c.id !== id)); toast.success("Categoria removida!"); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Blog</h1>
          <p className="text-muted-foreground text-sm">Gerencie posts e categorias</p>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="posts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4 mr-2" />Posts
          </TabsTrigger>
          <TabsTrigger value="categorias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Tag className="h-4 w-4 mr-2" />Categorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { resetPostForm(); setPostDialog(true); }}><Plus className="h-4 w-4 mr-2" />Novo Post</Button>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Título</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Categoria</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Data</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Views</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {postsList.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{p.titulo}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.categoria}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{p.data}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</span>
                    </td>
                    <td className="py-3 px-4"><Badge variant="outline" className={statusColors[p.status]}>{p.status}</Badge></td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditPost(p)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deletePost(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { resetCatForm(); setCatDialog(true); }}><Plus className="h-4 w-4 mr-2" />Nova Categoria</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriasList.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${c.cor}20` }}>
                  <Tag className="h-5 w-5" style={{ color: c.cor }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{c.nome}</h3>
                  <p className="text-xs text-muted-foreground">{c.posts} posts</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditCat(c)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCat(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Post */}
      <Dialog open={postDialog} onOpenChange={setPostDialog}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle className="text-foreground">{editingPost ? "Editar Post" : "Novo Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={pTitulo} onChange={(e) => setPTitulo(e.target.value)} placeholder="Título do post" className="bg-secondary border-border" />
              {errors.titulo && <p className="text-xs text-destructive">{errors.titulo}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={pCategoria} onValueChange={setPCategoria}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {categoriasList.map((c) => <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.categoria && <p className="text-xs text-destructive">{errors.categoria}</p>}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={pStatus} onValueChange={setPStatus}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="agendado">Agendado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea value={pConteudo} onChange={(e) => setPConteudo(e.target.value)} placeholder="Escreva o conteúdo do post..." rows={6} className="bg-secondary border-border" />
              {errors.conteudo && <p className="text-xs text-destructive">{errors.conteudo}</p>}
            </div>
            <Button onClick={handleSavePost} className="w-full">{editingPost ? "Salvar Alterações" : "Criar Post"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Categoria */}
      <Dialog open={catDialog} onOpenChange={setCatDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">{editingCat ? "Editar Categoria" : "Nova Categoria"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={cNome} onChange={(e) => setCNome(e.target.value)} placeholder="Nome da categoria" className="bg-secondary border-border" />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>
            <Button onClick={handleSaveCat} className="w-full">{editingCat ? "Salvar" : "Criar Categoria"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogContent;
