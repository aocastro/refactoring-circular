import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Tag, Plus, Eye, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Props {
  defaultTab?: string;
}

const posts = [
  { id: 1, titulo: "Como cuidar de roupas vintage", categoria: "Dicas", data: "10/03/2026", views: 234, status: "publicado" },
  { id: 2, titulo: "5 tendências de moda circular", categoria: "Tendências", data: "05/03/2026", views: 187, status: "publicado" },
  { id: 3, titulo: "Guia de upcycling para iniciantes", categoria: "Tutoriais", data: "01/03/2026", views: 312, status: "publicado" },
  { id: 4, titulo: "O impacto da moda sustentável", categoria: "Sustentabilidade", data: "20/03/2026", views: 0, status: "rascunho" },
  { id: 5, titulo: "Novidades da coleção outono", categoria: "Novidades", data: "25/03/2026", views: 0, status: "agendado" },
];

const categorias = [
  { id: 1, nome: "Dicas", posts: 8, cor: "hsl(var(--primary))" },
  { id: 2, nome: "Tendências", posts: 5, cor: "hsl(var(--accent))" },
  { id: 3, nome: "Tutoriais", posts: 4, cor: "hsl(var(--success))" },
  { id: 4, nome: "Sustentabilidade", posts: 6, cor: "hsl(var(--chart-4))" },
  { id: 5, nome: "Novidades", posts: 3, cor: "hsl(var(--chart-5))" },
];

const statusColors: Record<string, string> = {
  publicado: "bg-success/10 text-success",
  rascunho: "bg-muted text-muted-foreground",
  agendado: "bg-warning/10 text-warning",
};

const BlogContent = ({ defaultTab = "posts" }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Blog</h1>
          <p className="text-muted-foreground text-sm">Gerencie posts e categorias</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Novo Post</Button>
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

        <TabsContent value="posts" className="mt-6">
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
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{p.titulo}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.categoria}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{p.data}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={statusColors[p.status]}>{p.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${c.cor}20` }}>
                  <Tag className="h-5 w-5" style={{ color: c.cor }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{c.nome}</h3>
                  <p className="text-xs text-muted-foreground">{c.posts} posts</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogContent;
