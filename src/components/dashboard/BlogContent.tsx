import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Tag, Plus, Eye, Edit, Trash2 } from "lucide-react";
import PaginationControls from "@/components/shared/PaginationControls";
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
    { id: 6, titulo: "Tecidos orgânicos: vale a pena?", categoria: "Sustentabilidade", data: "28/02/2026", views: 145, status: "publicado", conteudo: "Conteúdo..." },
    { id: 7, titulo: "Como montar um closet cápsula", categoria: "Dicas", data: "22/02/2026", views: 298, status: "publicado", conteudo: "Conteúdo..." },
    { id: 8, titulo: "Economia circular na prática", categoria: "Tutoriais", data: "18/02/2026", views: 176, status: "publicado", conteudo: "Conteúdo..." },
    { id: 9, titulo: "Entrevista: designers locais", categoria: "Novidades", data: "12/02/2026", views: 89, status: "publicado", conteudo: "Conteúdo..." },
    { id: 10, titulo: "Moda ética e consumo consciente", categoria: "Sustentabilidade", data: "05/02/2026", views: 421, status: "publicado", conteudo: "Conteúdo..." },
    { id: 11, titulo: "DIY: transforme sua calça jeans", categoria: "Tutoriais", data: "30/01/2026", views: 267, status: "publicado", conteudo: "Conteúdo..." },
    { id: 12, titulo: "Cores tendência para 2026", categoria: "Tendências", data: "25/01/2026", views: 334, status: "publicado", conteudo: "Conteúdo..." },
    { id: 13, titulo: "Brechós online: guia completo", categoria: "Dicas", data: "18/01/2026", views: 198, status: "publicado", conteudo: "Conteúdo..." },
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

  // Pagination
  const [postsPage, setPostsPage] = useState(1);
  const postsPerPage = 5;
  const totalItems = postsList.length;
  const totalPages = Math.ceil(totalItems / postsPerPage);
  const safePage = Math.max(1, Math.min(postsPage, totalPages));
  const startIndex = (safePage - 1) * postsPerPage;
  const paginatedItems = postsList.slice(startIndex, startIndex + postsPerPage);

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
      <header>
        <h2 className="font-display text-2xl font-bold text-foreground">Blog</h2>
        <p className="text-sm text-muted-foreground">Gerencie posts e categorias com tabs, tabelas e diálogos acessíveis.</p>
      </header>

      <Tabs defaultValue={defaultTab} className="w-full" aria-label="Seções do blog">
        <TabsList className="border border-border bg-secondary">
          <TabsTrigger value="posts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="mr-2 h-4 w-4" />Posts
          </TabsTrigger>
          <TabsTrigger value="categorias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Tag className="mr-2 h-4 w-4" />Categorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6 space-y-4" aria-labelledby="radix-:r0:-trigger-posts">
          <section aria-labelledby="blog-posts-heading" aria-describedby="blog-posts-description" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 id="blog-posts-heading" className="text-sm font-semibold text-foreground">Posts publicados e rascunhos</h3>
                <p id="blog-posts-description" className="text-sm text-muted-foreground">Navegue pela lista de posts e use ações de editar e remover por teclado.</p>
              </div>
              <Button size="sm" onClick={() => { resetPostForm(); setPostDialog(true); }}><Plus className="mr-2 h-4 w-4" />Novo Post</Button>
            </div>
            {(() => {

              return (
                <>
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <table className="w-full text-sm">
                      <caption className="sr-only">Tabela de posts do blog.</caption>
                      <thead>
                        <tr className="border-b border-border bg-secondary/30">
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Título</th>
                          <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Categoria</th>
                          <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Data</th>
                          <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Views</th>
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedItems.map((p) => (
                          <tr key={p.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/20 focus-within:bg-secondary/20">
                            <td className="px-4 py-3 font-medium text-foreground">{p.titulo}</td>
                            <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.categoria}</td>
                            <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{p.data}</td>
                            <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</span>
                            </td>
                            <td className="px-4 py-3"><Badge variant="outline" className={statusColors[p.status]}>{p.status}</Badge></td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Editar post ${p.titulo}`} onClick={() => openEditPost(p)}><Edit className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Excluir post ${p.titulo}`} onClick={() => deletePost(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls currentPage={safePage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={postsPerPage} onPageChange={setPostsPage} />
                </>
              );
            })()}
          </section>
        </TabsContent>

        <TabsContent value="categorias" className="mt-6 space-y-4" aria-labelledby="radix-:r0:-trigger-categorias">
          <section aria-labelledby="blog-categories-heading" aria-describedby="blog-categories-description" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 id="blog-categories-heading" className="text-sm font-semibold text-foreground">Categorias do blog</h3>
                <p id="blog-categories-description" className="text-sm text-muted-foreground">Organize as categorias disponíveis para publicação e edição de posts.</p>
              </div>
              <Button size="sm" onClick={() => { resetCatForm(); setCatDialog(true); }}><Plus className="mr-2 h-4 w-4" />Nova Categoria</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoriasList.map((c, i) => (
                <motion.article key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-5" aria-labelledby={`blog-category-${c.id}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 id={`blog-category-${c.id}`} className="font-semibold text-foreground">{c.nome}</h4>
                    <p className="text-xs text-muted-foreground">{c.posts} posts</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Editar categoria ${c.nome}`} onClick={() => openEditCat(c)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Excluir categoria ${c.nome}`} onClick={() => deleteCat(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </motion.article>
              ))}
            </div>
          </section>
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
