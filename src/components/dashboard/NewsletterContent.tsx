import { useState } from "react";
import { Users, Mail, Send, Plus, TrendingUp, Download, Pencil, Trash2, Eye } from "lucide-react";
import { exportToCSV } from "@/lib/export";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SparklineKpiCard from "@/components/shared/SparklineKpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import PaginationControls, { usePagination } from "@/components/shared/PaginationControls";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { chartTooltipStyle, chartGridStroke, chartAxisStroke, chartAxisFontSize, chartColors } from "@/lib/chart-config";
import CampaignFormDialog, { type Campaign } from "./CampaignFormDialog";
import CampaignPreviewDialog from "./CampaignPreviewDialog";

const subscribers = [
  { id: 1, email: "maria@email.com", nome: "Maria Silva", data: "10/01/2026", status: "ativo" },
  { id: 2, email: "joao@email.com", nome: "João Santos", data: "15/01/2026", status: "ativo" },
  { id: 3, email: "ana@email.com", nome: "Ana Costa", data: "20/02/2026", status: "ativo" },
  { id: 4, email: "pedro@email.com", nome: "Pedro Lima", data: "05/03/2026", status: "inativo" },
  { id: 5, email: "carla@email.com", nome: "Carla Dias", data: "08/03/2026", status: "ativo" },
];

const initialCampaigns: Campaign[] = [
  { id: 1, titulo: "Novidades de Março", assunto: "Confira as novidades!", conteudo: "Conteúdo da campanha de março.", enviados: 342, abertos: 198, cliques: 45, data: "01/03/2026", status: "enviada" },
  { id: 2, titulo: "Promoção de Verão", assunto: "Descontos especiais de verão", conteudo: "Aproveite os descontos de verão.", enviados: 310, abertos: 215, cliques: 72, data: "15/02/2026", status: "enviada" },
  { id: 3, titulo: "Lançamento Coleção Eco", assunto: "Nova coleção sustentável", conteudo: "Conheça nossa nova coleção eco-friendly.", enviados: 0, abertos: 0, cliques: 0, data: "20/03/2026", status: "rascunho" },
  { id: 4, titulo: "Black Friday Sustentável", assunto: "Black Friday chegou!", conteudo: "Ofertas imperdíveis na Black Friday.", enviados: 450, abertos: 290, cliques: 95, data: "25/11/2025", status: "enviada" },
  { id: 5, titulo: "Natal Consciente", assunto: "Presentes com propósito", conteudo: "Sugestões de presentes sustentáveis.", enviados: 380, abertos: 245, cliques: 68, data: "20/12/2025", status: "enviada" },
  { id: 6, titulo: "Ano Novo, Moda Nova", assunto: "Comece o ano com estilo", conteudo: "Tendências para o novo ano.", enviados: 290, abertos: 170, cliques: 42, data: "05/01/2026", status: "enviada" },
];

const performanceData = [
  { mes: "Out", abertura: 48, cliques: 10 },
  { mes: "Nov", abertura: 64, cliques: 21 },
  { mes: "Dez", abertura: 61, cliques: 18 },
  { mes: "Jan", abertura: 55, cliques: 14 },
  { mes: "Fev", abertura: 69, cliques: 23 },
  { mes: "Mar", abertura: 58, cliques: 13 },
];

const statusSubOptions = ["Todos", "ativo", "inativo"];
const statusCampOptions = ["Todos", "enviada", "rascunho"];

const NewsletterContent = () => {
  const [subSearch, setSubSearch] = useState("");
  const [subStatus, setSubStatus] = useState("Todos");
  const [campSearch, setCampSearch] = useState("");
  const [campStatus, setCampStatus] = useState("Todos");
  const [campPage, setCampPage] = useState(1);
  const [subPage, setSubPage] = useState(1);
  const perPage = 5;

  const [campaignsList, setCampaignsList] = useState<Campaign[]>(initialCampaigns);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);

  // Real-time KPI metrics derived from campaign state
  const totalAssinantes = subscribers.filter(s => s.status === "ativo").length;
  const campanhasEnviadas = campaignsList.filter(c => c.status === "enviada");
  const totalEnviados = campanhasEnviadas.reduce((sum, c) => sum + c.enviados, 0);
  const totalAbertos = campanhasEnviadas.reduce((sum, c) => sum + c.abertos, 0);
  const totalCliques = campanhasEnviadas.reduce((sum, c) => sum + c.cliques, 0);
  const taxaAbertura = totalEnviados > 0 ? Math.round((totalAbertos / totalEnviados) * 100) : 0;
  const taxaCliques = totalEnviados > 0 ? Math.round((totalCliques / totalEnviados) * 100) : 0;

  const filteredSubs = subscribers.filter((s) => {
    const matchSearch = s.email.includes(subSearch) || s.nome.toLowerCase().includes(subSearch.toLowerCase());
    const matchStatus = subStatus === "Todos" || s.status === subStatus;
    return matchSearch && matchStatus;
  });

  const filteredCamps = campaignsList.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(campSearch.toLowerCase());
    const matchStatus = campStatus === "Todos" || c.status === campStatus;
    return matchSearch && matchStatus;
  });

  const campPagination = usePagination(filteredCamps, perPage, campPage);
  const subPagination = usePagination(filteredSubs, perPage, subPage);

  const handleSaveCampaign = (campaign: Campaign) => {
    setCampaignsList((prev) => {
      const exists = prev.find((c) => c.id === campaign.id);
      if (exists) return prev.map((c) => (c.id === campaign.id ? campaign : c));
      return [campaign, ...prev];
    });
    setEditingCampaign(null);
  };

  const handleNewCampaign = () => {
    setEditingCampaign(null);
    setDialogOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setDialogOpen(true);
  };

  const handleDeleteCampaign = () => {
    if (deletingCampaign) {
      setCampaignsList((prev) => prev.filter((c) => c.id !== deletingCampaign.id));
      setDeletingCampaign(null);
      toast.success("Campanha excluída!");
    }
  };

  const handleSendCampaign = (campaign: Campaign) => {
    setCampaignsList((prev) =>
      prev.map((c) =>
        c.id === campaign.id
          ? { ...c, status: "enviada", enviados: 342, abertos: 0, cliques: 0, data: new Date().toLocaleDateString("pt-BR") }
          : c
      )
    );
    setPreviewCampaign(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Newsletter</h2>
          <p className="text-sm text-muted-foreground">Gerencie assinantes, campanhas e métricas de entrega com estrutura acessível.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border" onClick={() => {
            exportToCSV(subscribers.map(s => ({ Nome: s.nome, Email: s.email, Data: s.data, Status: s.status })), "newsletter-assinantes");
          }}><Download className="mr-2 h-4 w-4" />Exportar</Button>
          <Button size="sm" onClick={handleNewCampaign}><Plus className="mr-2 h-4 w-4" />Nova Campanha</Button>
        </div>
      </header>

      <section aria-labelledby="newsletter-kpis-heading" aria-describedby="newsletter-kpis-description" className="space-y-3">
        <div className="sr-only">
          <h3 id="newsletter-kpis-heading">Indicadores de newsletter</h3>
          <p id="newsletter-kpis-description">Resumo do desempenho de assinantes, abertura, cliques e campanhas enviadas.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SparklineKpiCard label="Assinantes Ativos" value={String(totalAssinantes)} change="+18" icon={Users} positive delay={0} sparklineData={[{value:2},{value:2},{value:3},{value:3},{value:3},{value:totalAssinantes}]} sparklineColor="hsl(var(--primary))" />
          <SparklineKpiCard label="Taxa de Abertura" value={`${taxaAbertura}%`} change="+3%" icon={Mail} positive delay={0.05} sparklineData={[{value:48},{value:55},{value:61},{value:55},{value:69},{value:taxaAbertura}]} sparklineColor="hsl(var(--accent))" />
          <SparklineKpiCard label="Taxa de Cliques" value={`${taxaCliques}%`} change="+2%" icon={TrendingUp} positive delay={0.1} sparklineData={[{value:10},{value:14},{value:18},{value:14},{value:23},{value:taxaCliques}]} sparklineColor="hsl(var(--success))" />
          <SparklineKpiCard label="Campanhas Enviadas" value={String(campanhasEnviadas.length)} change="+2" icon={Send} positive delay={0.15} sparklineData={[{value:1},{value:2},{value:3},{value:4},{value:5},{value:campanhasEnviadas.length}]} sparklineColor="hsl(var(--warning))" />
        </div>
      </section>

      <section aria-labelledby="newsletter-performance-heading" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="space-y-3 rounded-xl border border-border bg-card p-5" aria-labelledby="newsletter-open-rate-heading">
          <h3 id="newsletter-open-rate-heading" className="text-sm font-semibold text-foreground">Taxa de Abertura (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="gradAbertura" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
              <XAxis dataKey="mes" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
              <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} unit="%" />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="abertura" stroke={chartColors.primary} fill="url(#gradAbertura)" strokeWidth={2} name="Abertura" />
            </AreaChart>
          </ResponsiveContainer>
        </article>
        <article className="space-y-3 rounded-xl border border-border bg-card p-5" aria-labelledby="newsletter-comparison-heading">
          <h3 id="newsletter-comparison-heading" className="text-sm font-semibold text-foreground">Abertura vs Cliques por Campanha</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
              <XAxis dataKey="mes" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
              <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} unit="%" />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              <Bar dataKey="abertura" fill={chartColors.primary} name="Abertura" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cliques" fill={chartColors.accent} name="Cliques" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </section>

      <section aria-labelledby="newsletter-campaigns-heading" aria-describedby="newsletter-campaigns-description" className="space-y-3">
        <div>
          <h3 id="newsletter-campaigns-heading" className="text-sm font-semibold text-foreground">Campanhas</h3>
          <p id="newsletter-campaigns-description" className="text-sm text-muted-foreground">Use busca, filtros e ações por teclado para revisar e administrar campanhas.</p>
        </div>
        <FilterToolbar
          search={campSearch}
          onSearchChange={setCampSearch}
          searchPlaceholder="Buscar campanha..."
          filters={[
            { key: "status", label: "Status", options: statusCampOptions, value: campStatus, onChange: setCampStatus },
          ]}
        />
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <caption className="sr-only">Lista de campanhas de newsletter.</caption>
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Título</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Enviados</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Abertos</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Data</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="w-12 px-4 py-3 text-left font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {campPagination.paginatedItems.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhuma campanha encontrada.</td></tr>
              ) : campPagination.paginatedItems.map((c) => (
                <tr key={c.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/20 focus-within:bg-secondary/20">
                  <td className="px-4 py-3 font-medium text-foreground">{c.titulo}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{c.enviados}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{c.abertos}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{c.data}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "enviada" ? "default" : "secondary"}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Preview e enviar" aria-label={`Visualizar campanha ${c.titulo}`} onClick={() => setPreviewCampaign(c)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Editar campanha ${c.titulo}`} onClick={() => handleEditCampaign(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label={`Excluir campanha ${c.titulo}`} onClick={() => setDeletingCampaign(c)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControls currentPage={campPagination.safePage} totalPages={campPagination.totalPages} totalItems={campPagination.totalItems} itemsPerPage={perPage} onPageChange={setCampPage} />
      </section>

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
              {subPagination.paginatedItems.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">Nenhum assinante encontrado.</td></tr>
              ) : subPagination.paginatedItems.map((s) => (
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
        <PaginationControls currentPage={subPagination.safePage} totalPages={subPagination.totalPages} totalItems={subPagination.totalItems} itemsPerPage={perPage} onPageChange={setSubPage} />
      </div>

      <CampaignFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        campaign={editingCampaign}
        onSave={handleSaveCampaign}
      />

      <AlertDialog open={!!deletingCampaign} onOpenChange={(open) => !open && setDeletingCampaign(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir campanha</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deletingCampaign?.titulo}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCampaign} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CampaignPreviewDialog
        open={!!previewCampaign}
        onOpenChange={(open) => !open && setPreviewCampaign(null)}
        campaign={previewCampaign}
        onSend={handleSendCampaign}
      />
    </div>
  );
};

export default NewsletterContent;
