import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Download, Calendar } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KpiCard from "@/components/shared/KpiCard";
import type { KpiItem } from "@/types";

const salesByMonth = [
  { month: "Jan", vendas: 52, receita: 7400 },
  { month: "Fev", vendas: 61, receita: 8700 },
  { month: "Mar", vendas: 48, receita: 6900 },
  { month: "Abr", vendas: 73, receita: 10400 },
  { month: "Mai", vendas: 65, receita: 9300 },
  { month: "Jun", vendas: 80, receita: 11500 },
  { month: "Jul", vendas: 58, receita: 8200 },
  { month: "Ago", vendas: 67, receita: 9100 },
  { month: "Set", vendas: 55, receita: 7800 },
  { month: "Out", vendas: 74, receita: 10500 },
  { month: "Nov", vendas: 82, receita: 11200 },
  { month: "Dez", vendas: 87, receita: 12450 },
];

const salesByCategory = [
  { name: "Roupas", value: 42, color: "hsl(var(--primary))" },
  { name: "Acessórios", value: 18, color: "hsl(var(--accent))" },
  { name: "Calçados", value: 15, color: "hsl(var(--success))" },
  { name: "Bolsas", value: 12, color: "hsl(var(--chart-4))" },
];

const salesByPayment = [
  { name: "Pix", value: 38 },
  { name: "Cartão Crédito", value: 32 },
  { name: "Cartão Débito", value: 15 },
  { name: "Dinheiro", value: 10 },
  { name: "Boleto", value: 5 },
];

const dailySales = [
  { day: "Seg", vendas: 12 },
  { day: "Ter", vendas: 15 },
  { day: "Qua", vendas: 9 },
  { day: "Qui", vendas: 18 },
  { day: "Sex", vendas: 22 },
  { day: "Sáb", vendas: 28 },
  { day: "Dom", vendas: 8 },
];

const topProducts = [
  { name: "Vestido Floral Vintage", qty: 18, revenue: 1620 },
  { name: "Jaqueta Jeans Upcycled", qty: 14, revenue: 2226 },
  { name: "Bolsa de Couro Retrô", qty: 12, revenue: 2520 },
  { name: "Tênis Vintage Adidas", qty: 11, revenue: 1320 },
  { name: "Colar Artesanal Boho", qty: 9, revenue: 405 },
];

const RelatoriosVendasContent = () => {
  const [period, setPeriod] = useState("12m");

  const totalRevenue = salesByMonth.reduce((a, m) => a + m.receita, 0);
  const totalSales = salesByMonth.reduce((a, m) => a + m.vendas, 0);
  const avgTicket = totalRevenue / totalSales;
  const formatPrice = (p: number) => `R$ ${p.toFixed(2).replace(".", ",")}`;

  const kpis: KpiItem[] = [
    { label: "Receita Total", value: `R$ ${(totalRevenue / 1000).toFixed(1)}k`, icon: DollarSign, change: "+18%", positive: true },
    { label: "Total de Vendas", value: totalSales, icon: ShoppingBag, change: "+12%", positive: true },
    { label: "Ticket Médio", value: formatPrice(avgTicket), icon: TrendingUp, change: "+5%", positive: true },
    { label: "Taxa de Conversão", value: "3.8%", icon: BarChart3, change: "+0.5%", positive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Relatório de Vendas</h1>
          <p className="text-muted-foreground text-sm">Análise de desempenho comercial</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] bg-secondary border-border">
              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="12m">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="border-border">
            <Download className="h-4 w-4 mr-2" />Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      {/* Revenue over time */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display font-bold text-foreground text-sm mb-4">Receita Mensal</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesByMonth}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => [formatPrice(v), "Receita"]} />
              <Area type="monotone" dataKey="receita" stroke="hsl(var(--primary))" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by category */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-4">Vendas por Categoria</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={salesByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {salesByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sales by payment method */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-4">Vendas por Forma de Pagamento</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByPayment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => [`${v}%`, "Participação"]} />
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily sales pattern */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-4">Vendas por Dia da Semana</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top products */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.qty} vendas</p>
                </div>
                <span className="text-sm font-bold text-foreground shrink-0">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RelatoriosVendasContent;
