import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Meh, BarChart2, TrendingUp, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/DataTable";
import PaginationControls from "@/components/shared/PaginationControls";
import { usePagination } from "@/hooks/use-pagination";
import { useEffect } from "react";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { adminNpsStats, adminNpsHistory, adminNpsResponses, type NPSResponse } from "@/data/admin";
import { toast } from "sonner";

const kpis = [
  { label: "NPS Score", value: adminNpsStats.score, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  { label: "Promotores (9-10)", value: adminNpsStats.promoters, icon: Smile, color: "text-green-600", bg: "bg-green-600/10", perc: "60%" },
  { label: "Neutros (7-8)", value: adminNpsStats.passives, icon: Meh, color: "text-amber-500", bg: "bg-amber-500/10", perc: "28%" },
  { label: "Detratores (0-6)", value: adminNpsStats.detractors, icon: Frown, color: "text-destructive", bg: "bg-destructive/10", perc: "11%" },
];

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  novo: "default",
  analisado: "secondary",
  contatado: "outline",
};

const columns = [
  { key: "score", label: "Nota", align: "center" as const },
  { key: "user", label: "Usuário / Loja" },
  { key: "comment", label: "Comentário", hideOn: "md" as const },
  { key: "date", label: "Data", hideOn: "sm" as const },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const getScoreColor = (score: number) => {
  if (score >= 9) return "bg-green-600/10 text-green-600 border-green-600/20";
  if (score >= 7) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
};

const AdminNPSContent = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [responses, setResponses] = useState<NPSResponse[]>(adminNpsResponses);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = responses.filter((r) => {
    const matchSearch = r.user.toLowerCase().includes(search.toLowerCase()) || r.store.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, 10, page);

  const handleAction = (id: number, action: "analisar" | "contatar") => {
    setResponses((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: action === "analisar" ? "analisado" : "contatado" }
          : r
      )
    );
    toast.success(`Status atualizado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Net Promoter Score (NPS)</h2>
          <p className="text-sm text-muted-foreground">Avaliação de satisfação dos usuários e lojistas da plataforma</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <BarChart2 className="mr-1 h-4 w-4" />{adminNpsStats.totalResponses} Respostas
        </Badge>
      </header>

      {/* KPIs & Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${kpi.bg} ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                      {kpi.perc && <p className="mb-1 text-xs text-muted-foreground">({kpi.perc})</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Evolução do Score (6 meses)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={adminNpsHistory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / .15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Responses Table */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-display text-lg font-bold text-foreground">Respostas Recentes</h3>

        <FilterToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por usuário, loja ou comentário..."
          filters={[{
            key: "status", label: "Status",
            options: ["Todos", "novo", "analisado", "contatado"],
            value: statusFilter, onChange: setStatusFilter,
          }]}
        />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <DataTable
            columns={columns}
            data={paginatedItems}
            emptyMessage="Nenhuma resposta encontrada."
            renderRow={(r: NPSResponse) => (
              <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold ${getScoreColor(r.score)}`}>
                    {r.score}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{r.user}</span>
                    <span className="text-xs text-muted-foreground">{r.store}</span>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell max-w-sm">
                  <p className="truncate" title={r.comment}>{r.comment}</p>
                </td>
                <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                  {r.date}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[r.status]} className="capitalize">
                    {r.status === "novo" && <Clock className="mr-1 h-3 w-3" />}
                    {r.status === "analisado" && <CheckCircle className="mr-1 h-3 w-3" />}
                    {r.status === "contatado" && <MessageSquare className="mr-1 h-3 w-3" />}
                    {r.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {r.status === "novo" && (
                      <Button size="sm" variant="outline" onClick={() => handleAction(r.id, "analisar")}>
                        Analisar
                      </Button>
                    )}
                    {r.status !== "contatado" && (
                      <Button size="sm" variant="outline" onClick={() => handleAction(r.id, "contatar")}>
                        <MessageSquare className="h-4 w-4 mr-1" /> Contatar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          />
          <PaginationControls
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={10}
            onPageChange={setPage}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNPSContent;
