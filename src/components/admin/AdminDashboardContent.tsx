import { motion } from "framer-motion";
import { Store, Users, DollarSign, TrendingUp, Leaf, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminKpis, adminMrrHistory, adminRevenueByPlan } from "@/data/admin";

const kpis = [
  { label: "Lojas Ativas", value: adminKpis.lojasAtivas, total: adminKpis.totalLojas, icon: Store, change: `+${adminKpis.novasLojasMes} este mês`, positive: true },
  { label: "Usuários", value: adminKpis.totalUsuarios.toLocaleString("pt-BR"), icon: Users, change: "+8.4%", positive: true },
  { label: "MRR", value: `R$ ${adminKpis.mrrAtual.toLocaleString("pt-BR")}`, icon: DollarSign, change: `+${(((adminKpis.mrrAtual - adminKpis.mrrAnterior) / adminKpis.mrrAnterior) * 100).toFixed(1)}%`, positive: true },
  { label: "Churn Rate", value: `${adminKpis.churnRate}%`, icon: TrendingUp, change: "-0.3pp", positive: true },
  { label: "Ticket Médio", value: `R$ ${adminKpis.ticketMedio}`, icon: DollarSign, change: "+5.2%", positive: true },
  { label: "Lojas ESG", value: "142", icon: Leaf, change: "+12 este mês", positive: true },
];

const AdminDashboardContent = () => (
  <div className="space-y-6">
    <header>
      <h2 className="font-display text-2xl font-bold text-foreground">Painel Administrativo</h2>
      <p className="text-sm text-muted-foreground">Visão geral da plataforma Circular u-Shar</p>
    </header>

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
                <p className={`flex items-center gap-1 text-xs ${kpi.positive ? "text-green-600" : "text-red-500"}`}>
                  {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

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
  </div>
);

export default AdminDashboardContent;
