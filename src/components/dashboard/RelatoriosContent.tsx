import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, TrendingDown, ShoppingBag, BarChart3, Download, Calendar,
  Leaf, Droplets, Recycle, Shirt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToCSV } from "@/lib/export";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import KpiCard from "@/components/shared/KpiCard";
import { cashFlowData, paymentMethods, recentPayments, esgMonthly } from "@/data/financeiro";
import { chartTooltipStyle, chartGridStroke, chartAxisStroke, chartAxisFontSize, chartColors } from "@/lib/chart-config";

/* ── Vendas data ── */
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
  { day: "Seg", vendas: 12 }, { day: "Ter", vendas: 15 }, { day: "Qua", vendas: 9 },
  { day: "Qui", vendas: 18 }, { day: "Sex", vendas: 22 }, { day: "Sáb", vendas: 28 }, { day: "Dom", vendas: 8 },
];
const topProducts = [
  { name: "Vestido Floral Vintage", qty: 18, revenue: 1620 },
  { name: "Jaqueta Jeans Upcycled", qty: 14, revenue: 2226 },
  { name: "Bolsa de Couro Retrô", qty: 12, revenue: 2520 },
  { name: "Tênis Vintage Adidas", qty: 11, revenue: 1320 },
  { name: "Colar Artesanal Boho", qty: 9, revenue: 405 },
];

const formatPrice = (p: number) => `R$ ${p.toFixed(2).replace(".", ",")}`;

interface Props {
  defaultTab?: string;
}

const RelatoriosContent = ({ defaultTab = "vendas" }: Props) => {
  const [period, setPeriod] = useState("12m");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "entrada" | "saida">("all");

  const totalRevenue = salesByMonth.reduce((a, m) => a + m.receita, 0);
  const totalSales = salesByMonth.reduce((a, m) => a + m.vendas, 0);
  const avgTicket = totalRevenue / totalSales;

  const filteredPayments = recentPayments.filter(
    (p) => paymentFilter === "all" || p.type === paymentFilter
  );

  return (
    <section className="space-y-6" aria-labelledby="relatorios-section-title" aria-describedby="relatorios-section-description">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 id="relatorios-section-title" className="text-2xl font-bold font-display text-foreground">Relatórios</h2>
          <p id="relatorios-section-description" className="text-muted-foreground text-sm">Painéis de vendas, fluxo financeiro e impacto ESG com abas acessíveis, filtros e exportação por teclado.</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] bg-secondary border-border" aria-label="Selecionar período do relatório">
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
          <Button variant="outline" size="sm" className="border-border" onClick={() => {
            exportToCSV(
              recentPayments.map((p) => ({ Descrição: p.desc, Valor: p.value, Tipo: p.type, Método: p.method, Data: p.date })),
              "relatorio-financeiro"
            );
          }}>
            <Download className="h-4 w-4 mr-2" />Exportar
          </Button>
        </div>
      </header>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="vendas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingBag className="h-4 w-4 mr-2" />Vendas
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <DollarSign className="h-4 w-4 mr-2" />Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger value="esg" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Leaf className="h-4 w-4 mr-2" />ESG
          </TabsTrigger>
        </TabsList>

        {/* ─── VENDAS ─── */}
        <TabsContent value="vendas" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard label="Receita Total" value={`R$ ${(totalRevenue / 1000).toFixed(1)}k`} icon={DollarSign} change="+18%" positive delay={0} />
            <KpiCard label="Total de Vendas" value={String(totalSales)} icon={ShoppingBag} change="+12%" positive delay={0.05} />
            <KpiCard label="Ticket Médio" value={formatPrice(avgTicket)} icon={TrendingUp} change="+5%" positive delay={0.1} />
            <KpiCard label="Taxa de Conversão" value="3.8%" icon={BarChart3} change="+0.5%" positive delay={0.15} />
          </div>

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
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                  <XAxis dataKey="month" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                  <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [formatPrice(v), "Receita"]} />
                  <Area type="monotone" dataKey="receita" stroke="hsl(var(--primary))" fill="url(#revenueGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-bold text-foreground text-sm mb-4">Vendas por Categoria</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {salesByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-bold text-foreground text-sm mb-4">Vendas por Forma de Pagamento</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByPayment} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} horizontal={false} />
                    <XAxis type="number" stroke={chartAxisStroke} fontSize={chartAxisFontSize} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" stroke={chartAxisStroke} fontSize={11} width={100} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, "Participação"]} />
                    <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-bold text-foreground text-sm mb-4">Vendas por Dia da Semana</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                    <XAxis dataKey="day" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                    <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

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
        </TabsContent>

        {/* ─── FLUXO DE CAIXA ─── */}
        <TabsContent value="financeiro" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Receita Mensal" value="R$ 12.450" change="+12%" icon={TrendingUp} positive delay={0} />
            <KpiCard label="Despesas" value="R$ 6.100" change="+5%" icon={TrendingDown} positive={false} delay={0.05} />
            <KpiCard label="Lucro Líquido" value="R$ 6.350" change="+18%" icon={DollarSign} positive delay={0.1} />
            <KpiCard label="Margem" value="51%" change="+3pp" icon={TrendingUp} positive delay={0.15} />
          </div>

          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Entradas vs Saídas</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorEntrada2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColors.success} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaida2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.destructive} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColors.destructive} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                <XAxis dataKey="month" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="entrada" stroke={chartColors.success} fill="url(#colorEntrada2)" strokeWidth={2} name="Entradas" />
                <Area type="monotone" dataKey="saida" stroke={chartColors.destructive} fill="url(#colorSaida2)" strokeWidth={2} name="Saídas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">Métodos de Pagamento</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                    {paymentMethods.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {paymentMethods.map((m) => (
                  <div key={m.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                    {m.name} ({m.value}%)
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">Movimentações Recentes</h3>
                <div className="flex gap-1.5">
                  {(["all", "entrada", "saida"] as const).map((f) => (
                    <button key={f} onClick={() => setPaymentFilter(f)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${paymentFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {f === "all" ? "Todos" : f === "entrada" ? "Entradas" : "Saídas"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Descrição</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Valor</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Método</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-4 text-foreground">{p.desc}</td>
                        <td className={`py-3 px-4 font-medium ${p.type === "entrada" ? "text-success" : "text-destructive"}`}>
                          {p.type === "entrada" ? "+" : "−"} {p.value}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.method}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─── ESG ─── */}
        <TabsContent value="esg" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="CO₂ Evitado (mês)" value="76 kg" change="+15%" icon={Leaf} positive delay={0} />
            <KpiCard label="Água Economizada" value="50.700 L" change="+12%" icon={Droplets} positive delay={0.05} />
            <KpiCard label="Peças Reaproveitadas" value="102" change="+8%" icon={Recycle} positive delay={0.1} />
            <KpiCard label="Itens Desviados Aterro" value="480" change="+22%" icon={Shirt} positive delay={0.15} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">CO₂ Evitado (kg/mês)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={esgMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                  <XAxis dataKey="month" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                  <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="co2" fill={chartColors.success} radius={[4, 4, 0, 0]} name="CO₂ (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">Peças Reaproveitadas</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={esgMonthly}>
                  <defs>
                    <linearGradient id="colorPecas2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColors.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                  <XAxis dataKey="month" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                  <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="pecas" stroke={chartColors.accent} fill="url(#colorPecas2)" strokeWidth={2} name="Peças" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Resumo de Impacto Ambiental (acumulado)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "CO₂ Total Evitado", value: "361 kg", icon: Leaf },
                { label: "Água Total Economizada", value: "234.900 L", icon: Droplets },
                { label: "Peças Reaproveitadas", value: "480", icon: Recycle },
                { label: "Equivalente Árvores", value: "18", icon: Leaf },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="text-lg font-bold font-display text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default RelatoriosContent;
