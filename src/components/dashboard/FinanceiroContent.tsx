import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  Droplets,
  Recycle,
  Shirt,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCSV } from "@/lib/export";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const cashFlowData = [
  { month: "Jul", entrada: 8200, saida: 4100 },
  { month: "Ago", entrada: 9100, saida: 4800 },
  { month: "Set", entrada: 7800, saida: 3900 },
  { month: "Out", entrada: 10500, saida: 5200 },
  { month: "Nov", entrada: 11200, saida: 5800 },
  { month: "Dez", entrada: 12450, saida: 6100 },
];

const paymentMethods = [
  { name: "PIX", value: 42, color: "hsl(180, 100%, 50%)" },
  { name: "Cartão Crédito", value: 28, color: "hsl(270, 80%, 60%)" },
  { name: "Cartão Débito", value: 18, color: "hsl(150, 80%, 45%)" },
  { name: "Dinheiro", value: 12, color: "hsl(0, 0%, 55%)" },
];

const recentPayments = [
  { id: 1, desc: "Venda #1247 — Vestido Floral", value: "R$ 89,90", type: "entrada", method: "PIX", date: "Hoje, 14:30" },
  { id: 2, desc: "Pagamento Consignante — Ana Paula", value: "R$ 340,00", type: "saida", method: "Transferência", date: "Hoje, 10:00" },
  { id: 3, desc: "Venda #1246 — Jaqueta Jeans", value: "R$ 159,00", type: "entrada", method: "Cartão Crédito", date: "Ontem, 18:45" },
  { id: 4, desc: "Fornecedor — Cabides Eco", value: "R$ 85,00", type: "saida", method: "PIX", date: "Ontem, 15:30" },
  { id: 5, desc: "Venda #1245 — Bolsa Retrô", value: "R$ 210,00", type: "entrada", method: "Cartão Débito", date: "22/12, 16:00" },
  { id: 6, desc: "Aluguel Loja", value: "R$ 2.800,00", type: "saida", method: "Boleto", date: "20/12, 09:00" },
  { id: 7, desc: "Venda #1244 — Tênis Vintage", value: "R$ 120,00", type: "entrada", method: "Dinheiro", date: "20/12, 14:20" },
];

const esgMonthly = [
  { month: "Jul", co2: 48, agua: 31200, pecas: 65 },
  { month: "Ago", co2: 55, agua: 35800, pecas: 72 },
  { month: "Set", co2: 42, agua: 28900, pecas: 58 },
  { month: "Out", co2: 68, agua: 42100, pecas: 89 },
  { month: "Nov", co2: 72, agua: 46200, pecas: 94 },
  { month: "Dez", co2: 76, agua: 50700, pecas: 102 },
];

const tooltipStyle = {
  background: "hsl(260, 10%, 8%)",
  border: "1px solid hsl(260, 15%, 16%)",
  borderRadius: "8px",
  color: "hsl(0, 0%, 95%)",
  fontSize: 12,
};

const KpiCard = ({ label, value, change, icon: Icon, positive, delay }: {
  label: string; value: string; change: string; icon: any; positive: boolean; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-4 rounded-xl border border-border bg-card"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? "text-success" : "text-destructive"}`}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {change}
      </span>
    </div>
    <p className="text-xl font-bold font-display text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </motion.div>
);

const FinanceiroContent = () => {
  const [paymentFilter, setPaymentFilter] = useState<"all" | "entrada" | "saida">("all");

  const filteredPayments = recentPayments.filter(
    p => paymentFilter === "all" || p.type === paymentFilter
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Financeiro</h1>
        <p className="text-muted-foreground text-sm">Fluxo de caixa, pagamentos e impacto ESG</p>
      </div>

      <Tabs defaultValue="fluxo" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="fluxo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger value="esg" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Leaf className="h-4 w-4 mr-2" />
            ESG
          </TabsTrigger>
        </TabsList>

        {/* FLUXO DE CAIXA */}
        <TabsContent value="fluxo" className="mt-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Receita Mensal" value="R$ 12.450" change="+12%" icon={TrendingUp} positive delay={0} />
            <KpiCard label="Despesas" value="R$ 6.100" change="+5%" icon={TrendingDown} positive={false} delay={0.05} />
            <KpiCard label="Lucro Líquido" value="R$ 6.350" change="+18%" icon={DollarSign} positive delay={0.1} />
            <KpiCard label="Margem" value="51%" change="+3pp" icon={TrendingUp} positive delay={0.15} />
          </div>

          {/* Chart */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Entradas vs Saídas</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(150, 80%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(150, 80%, 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 15%, 16%)" />
                <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(0, 0%, 55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="entrada" stroke="hsl(150, 80%, 45%)" fill="url(#colorEntrada)" strokeWidth={2} name="Entradas" />
                <Area type="monotone" dataKey="saida" stroke="hsl(0, 84%, 60%)" fill="url(#colorSaida)" strokeWidth={2} name="Saídas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment methods pie */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">Métodos de Pagamento</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                    {paymentMethods.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
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

            {/* Recent payments */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">Movimentações Recentes</h3>
                <div className="flex gap-1.5">
                  {(["all", "entrada", "saida"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setPaymentFilter(f)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                        paymentFilter === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
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

        {/* ESG */}
        <TabsContent value="esg" className="mt-6 space-y-6">
          {/* ESG KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="CO₂ Evitado (mês)" value="76 kg" change="+15%" icon={Leaf} positive delay={0} />
            <KpiCard label="Água Economizada" value="50.700 L" change="+12%" icon={Droplets} positive delay={0.05} />
            <KpiCard label="Peças Reaproveitadas" value="102" change="+8%" icon={Recycle} positive delay={0.1} />
            <KpiCard label="Itens Desviados Aterro" value="480" change="+22%" icon={Shirt} positive delay={0.15} />
          </div>

          {/* ESG Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">CO₂ Evitado (kg/mês)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={esgMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 15%, 16%)" />
                  <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(0, 0%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="co2" fill="hsl(150, 80%, 45%)" radius={[4, 4, 0, 0]} name="CO₂ (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">Peças Reaproveitadas</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={esgMonthly}>
                  <defs>
                    <linearGradient id="colorPecas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 15%, 16%)" />
                  <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(0, 0%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="pecas" stroke="hsl(180, 100%, 50%)" fill="url(#colorPecas)" strokeWidth={2} name="Peças" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ESG Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
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
    </div>
  );
};

export default FinanceiroContent;
