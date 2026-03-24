import { motion } from "framer-motion";
import { Store, Users, DollarSign, Leaf, ArrowUpRight, ArrowDownRight, TrendingDown, Timer } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminKpis, adminMrrHistory, adminRevenueByPlan, adminChurnHistory, adminLtvByPlan } from "@/data/admin";

const kpis = [
  { label: "Lojas Ativas", value: adminKpis.lojasAtivas, icon: Store, change: `+${adminKpis.novasLojasMes} este mês`, positive: true },
  { label: "Usuários", value: adminKpis.totalUsuarios.toLocaleString("pt-BR"), icon: Users, change: "+8.4%", positive: true },
  { label: "MRR", value: `R$ ${adminKpis.mrrAtual.toLocaleString("pt-BR")}`, icon: DollarSign, change: `+${(((adminKpis.mrrAtual - adminKpis.mrrAnterior) / adminKpis.mrrAnterior) * 100).toFixed(1)}%`, positive: true },
  { label: "Churn Rate", value: `${adminKpis.churnRate}%`, icon: TrendingDown, change: "-0.3pp", positive: true },
  { label: "Ticket Médio", value: `R$ ${adminKpis.ticketMedio}`, icon: DollarSign, change: "+5.2%", positive: true },
  { label: "Lojas ESG", value: "142", icon: Leaf, change: "+12 este mês", positive: true },
];

const AdminDashboardContent = () => (
  <div className="space-y-6">
    <header>
      <h2 className="font-display text-2xl font-bold text-foreground">Painel Administrativo</h2>
      <p className="text-sm text-muted-foreground">Visão geral da plataforma Circular u-Shar</p>
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
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={adminMrrHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / .15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Receita por Plano</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={adminRevenueByPlan} dataKey="value" nameKey="plan" cx="50%" cy="50%" outerRadius={90} label={({ plan }) => plan}>
                {adminRevenueByPlan.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
            </PieChart>
          </ResponsiveContainer>
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
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={adminChurnHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" domain={[0, 6]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number, name: string) => name === "churn" ? `${v}%` : v} />
              <Legend />
              <Line type="monotone" dataKey="churn" name="Churn (%)" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="newStores" name="Novas Lojas" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="cancelled" name="Cancelamentos" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Timer className="h-4 w-4 text-primary" />
            Lifetime Value (LTV) por Plano
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={adminLtvByPlan}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="plan" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number, name: string) =>
                  name === "ltv" ? `R$ ${v.toLocaleString("pt-BR")}` : `${v} meses`
                }
              />
              <Legend />
              <Bar dataKey="ltv" name="LTV (R$)" radius={[4, 4, 0, 0]}>
                {adminLtvByPlan.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
  </div>
);

export default AdminDashboardContent;
