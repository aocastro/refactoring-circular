import { useState, useEffect } from "react";
import api from "@/api/axios";
import { motion } from "framer-motion";
import { Store, Users, DollarSign, Leaf, ArrowUpRight, ArrowDownRight, TrendingDown, Timer, Clock } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line, ComposedChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, parseISO } from "date-fns";



const AdminDashboardContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminKpis, setAdminKpis] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminMrrHistory, setAdminMrrHistory] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminRevenueByPlan, setAdminRevenueByPlan] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminChurnHistory, setAdminChurnHistory] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminLtvByPlan, setAdminLtvByPlan] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [freeTrialStores, setFreeTrialStores] = useState<any[]>([]);
  const [period, setPeriod] = useState("Mensal");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_adminKpis = await api.get('/api/admin/kpis');
        setAdminKpis(res_adminKpis.data);
        const res_adminMrrHistory = await api.get('/api/admin/mrr-history');
        setAdminMrrHistory(res_adminMrrHistory.data);
        const res_adminRevenueByPlan = await api.get('/api/admin/revenue-by-plan');
        setAdminRevenueByPlan(res_adminRevenueByPlan.data);
        const res_adminChurnHistory = await api.get('/api/admin/churn-history');
        setAdminChurnHistory(res_adminChurnHistory.data);
        const res_adminLtvByPlan = await api.get('/api/admin/ltv-by-plan');
        setAdminLtvByPlan(res_adminLtvByPlan.data);

        const res_adminStores = await api.get('/api/admin/stores');
        const stores = res_adminStores.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const trialStores = stores.filter((s: any) => s.trialEnd);
        setFreeTrialStores(trialStores);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  if (loadingData || !adminKpis || Object.keys(adminKpis).length === 0) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  const getPeriodLabel = () => {
    switch (period) {
      case "Hoje": return "hoje";
      case "Semanal": return "esta semana";
      case "Trimestral": return "neste trimestre";
      case "Semestral": return "neste semestre";
      case "Anual": return "este ano";
      case "Mensal":
      default: return "este mês";
    }
  };

  const getMultiplier = () => {
    switch (period) {
      case "Hoje": return 0.05;
      case "Semanal": return 0.25;
      case "Trimestral": return 3;
      case "Semestral": return 6;
      case "Anual": return 12;
      case "Mensal":
      default: return 1;
    }
  };

  const multiplier = getMultiplier();
  const periodLabel = getPeriodLabel();

const kpis = [
  { label: "Lojas Ativas", value: adminKpis.lojasAtivas, icon: Store, change: `+${Math.ceil(adminKpis.novasLojasMes * multiplier)} ${periodLabel}`, positive: true },
  { label: "Usuários", value: adminKpis.totalUsuarios?.toLocaleString("pt-BR"), icon: Users, change: `+${(8.4 * multiplier).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% ${periodLabel}`, positive: true },
  { label: "MRR", value: `R$ ${adminKpis.mrrAtual?.toLocaleString("pt-BR")}`, icon: DollarSign, change: `+${(((adminKpis.mrrAtual - adminKpis.mrrAnterior) / adminKpis.mrrAnterior) * 100 * multiplier).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`, positive: true },
  { label: "Churn Rate", value: `${adminKpis.churnRate.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`, icon: TrendingDown, change: "-0,3pp", positive: true },
  { label: "Ticket Médio", value: `R$ ${adminKpis.ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, change: "+5,2%", positive: true },
  { label: "Lojas com Selo ESG", value: `142 / ${adminKpis.totalLojas || 247}`, icon: Leaf, change: `+${Math.ceil(12 * multiplier)} ${periodLabel}`, positive: true },
];




  return (
  <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Painel Administrativo</h2>
        <p className="text-sm text-muted-foreground">Visão geral da plataforma Circular u-Shar</p>
      </div>

      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-48"
      >
        <option value="Hoje">Hoje</option>
        <option value="Semanal">Semanal</option>
        <option value="Mensal">Mensal</option>
        <option value="Trimestral">Trimestral</option>
        <option value="Semestral">Semestral</option>
        <option value="Anual">Anual</option>
      </select>
    </header>

    {/* KPIs */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi, i) => (
        <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <kpi.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                <p className="flex items-center gap-1 text-xs text-green-600">
                  {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* MRR + Receita por Plano */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base">Evolução do MRR</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto pb-4">
          <div className="min-w-[600px] h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminMrrHistory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / .15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Receita por Plano</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto pb-4">
          <div className="min-w-[300px] h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                data={adminRevenueByPlan}
                dataKey="value"
                nameKey="plan"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ plan, percent }) => `${plan} (${(percent * 100).toFixed(0)}%)`}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {adminRevenueByPlan.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
                <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Churn Rate + LTV */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingDown className="h-4 w-4 text-destructive" />
            Churn Rate (%)
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto pb-4">
          <div className="min-w-[600px] h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adminChurnHistory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis yAxisId="left" className="text-xs fill-muted-foreground" domain={[0, 6]} tickFormatter={(v) => `${v}%`} />
              <YAxis yAxisId="right" orientation="right" className="text-xs fill-muted-foreground" />
              <Tooltip formatter={(v: number, name: string) => name === "Churn (%)" ? `${v}%` : v} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="churn" name="Churn (%)" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="newStores" name="Novas Lojas" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="cancelled" name="Cancelamentos" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Timer className="h-4 w-4 text-primary" />
            Lifetime Value (LTV) por Plano
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto pb-4">
          <div className="min-w-[600px] h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={adminLtvByPlan}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="plan" className="text-xs fill-muted-foreground" />
              <YAxis yAxisId="left" className="text-xs fill-muted-foreground" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" className="text-xs fill-muted-foreground" tickFormatter={(v) => `${v}m`} />
              <Tooltip
                formatter={(v: number, name: string) =>
                  name === "LTV (R$)" ? `R$ ${v.toLocaleString("pt-BR")}` : `${v} meses`
                }
              />
              <Legend />
              <Bar yAxisId="left" dataKey="ltv" name="LTV (R$)" radius={[4, 4, 0, 0]}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {adminLtvByPlan.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.color} />
                ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="avgMonths" name="Tempo Médio" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {adminLtvByPlan.map((p) => (
              <div key={p.plan} className="text-center">
                <p className="text-[10px] text-muted-foreground">{p.plan}</p>
                <p className="text-xs font-semibold text-foreground">~{p.avgMonths} meses</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Lojas em Período de Teste */}
    <div className="grid grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" />
            Lojas em Período de Teste (Free Trial)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {freeTrialStores.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma loja em período de teste no momento.</p>
            ) : (
              freeTrialStores.map((store) => {
                const daysRemaining = differenceInDays(parseISO(store.trialEnd), new Date());
                const isEndingSoon = daysRemaining <= 3;

                return (
                  <div key={store.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{store.name}</span>
                        <Badge variant="outline" className="text-[10px]">{store.plan}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{store.owner} • {store.email}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <Badge variant={isEndingSoon ? "destructive" : "secondary"}>
                        {daysRemaining > 0 ? `${daysRemaining} dias restantes` : "Expirado"}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
};

export default AdminDashboardContent;
