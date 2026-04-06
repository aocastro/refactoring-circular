import api from "@/api/axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CreditCard } from "lucide-react";
import * as Icons from "lucide-react";
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
  Cell,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KpiCard from "@/components/shared/KpiCard";
import { type DashboardPeriod } from "@/data/dashboard";
import { chartTooltipStyle, chartGridStroke, chartAxisStroke, chartAxisFontSize, chartColors } from "@/lib/chart-config";

interface DashboardContentProps {
  onSectionChange?: (section: string) => void;
}

const DashboardContent = ({ onSectionChange }: DashboardContentProps) => {
  const [loadingData, setLoadingData] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardKpisByPeriod, setdashboardKpisByPeriod] = useState<any>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [revenueData, setrevenueData] = useState<any>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [salesByCategory, setsalesByCategory] = useState<any>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentSales, setrecentSales] = useState<any>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [abcProductsData, setabcProductsData] = useState<any>([]);
  const [trialDays, setTrialDays] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>("hoje");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Bolt ⚡ Optimization: Parallelize independent API calls to prevent network waterfall
        const [
          res_dashboardKpisByPeriod,
          res_revenueData,
          res_salesByCategory,
          res_recentSales,
          res_abcProductsData,
        ] = await Promise.all([
          api.get('/api/dashboard/kpis-by-period'),
          api.get('/api/dashboard/revenue-data'),
          api.get('/api/dashboard/sales-by-category'),
          api.get('/api/dashboard/recent-sales'),
          api.get('/api/dashboard/abc-products'),
        ]);

        setdashboardKpisByPeriod(res_dashboardKpisByPeriod.data);
        setrevenueData(res_revenueData.data);
        setsalesByCategory(res_salesByCategory.data);
        setrecentSales(res_recentSales.data);
        setabcProductsData(res_abcProductsData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storeConfig = JSON.parse(localStorage.getItem("storeConfig") || "{}");
    if (storeConfig.trialEndsAt) {
      const now = Date.now();
      const diff = storeConfig.trialEndsAt - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days >= 0) {
        setTrialDays(days);
      }
    }
  }, []);



  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      {trialDays !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Período de teste grátis (7 dias)</p>
              <p className="text-xs text-muted-foreground">
                Sua loja está no período experimental. Você tem <span className="text-primary font-bold">{trialDays} {trialDays === 1 ? "dia" : "dias"}</span> restante(s).
              </p>
            </div>
          </div>
          <button
            onClick={() => onSectionChange?.("minha-conta")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold transition-all hover:bg-primary/90 hover:scale-105"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Configurar Pagamento
          </button>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Visão geral</h2>
          <p className="text-muted-foreground text-sm">Bom dia, Maria! Seja bem-vinda ao seu painel.</p>
        </div>

        <Tabs
          defaultValue="hoje"
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value as DashboardPeriod)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-5 w-full sm:w-auto h-9 p-1 bg-muted/50">
            <TabsTrigger value="hoje" className="text-[10px] sm:text-xs">Hoje</TabsTrigger>
            <TabsTrigger value="mensal" className="text-[10px] sm:text-xs">Mensal</TabsTrigger>
            <TabsTrigger value="trimestral" className="text-[10px] sm:text-xs">Trimestral</TabsTrigger>
            <TabsTrigger value="semestral" className="text-[10px] sm:text-xs">Semestral</TabsTrigger>
            <TabsTrigger value="anual" className="text-[10px] sm:text-xs">Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {dashboardKpisByPeriod[selectedPeriod]?.map((kpi: any, i: number) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const IconComponent = typeof kpi.icon === 'string' ? (Icons as any)[kpi.icon] : kpi.icon;
          return (
            <KpiCard
              key={kpi.label}
              {...kpi}
              icon={IconComponent}
              delay={i * 0.05}
              onClick={kpi.target ? () => onSectionChange?.(kpi.target!) : undefined}
            />
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Receita Mensal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
              <XAxis dataKey="month" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
              <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="value" stroke={chartColors.primary} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Vendas por Categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
              <XAxis dataKey="category" stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
              <YAxis stroke={chartAxisStroke} fontSize={chartAxisFontSize} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="value" fill={chartColors.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Curva ABC por Produto (Análise de Receita)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={abcProductsData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} horizontal={false} />
              <XAxis type="number" stroke={chartAxisStroke} fontSize={chartAxisFontSize} unit="%" hide />
              <YAxis dataKey="product" type="category" stroke={chartAxisStroke} fontSize={chartAxisFontSize} width={120} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={chartTooltipStyle} 
                formatter={(value: number, _name: string, props: { payload: { revenue: number } }) => [`${value}% (R$ ${props.payload.revenue.toLocaleString('pt-BR')})`, "Participação"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {abcProductsData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.category === 'A' ? chartColors.primary : entry.category === 'B' ? chartColors.accent : '#94a3b8'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex gap-4 justify-center text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors.primary }} /> <span>Classe A (Principais)</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors.accent }} /> <span>Classe B (Intermediários)</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#94a3b8' }} /> <span>Classe C (Cauda Longa)</span></div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Destaques da Curva</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Top Produto</p>
              <p className="text-lg font-bold text-foreground leading-tight">{abcProductsData?.[0]?.product || 'N/A'}</p>
              <p className="text-xs text-success font-medium mt-1">Responsável por {abcProductsData?.[0]?.value || 0}% da sua receita total.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Otimização Sugerida:</p>
              <ul className="text-xs text-foreground space-y-1.5 list-disc pl-4">
                <li>Aumentar estoque de <strong>{abcProductsData?.[0]?.product || 'N/A'}</strong> e {abcProductsData?.[1]?.product || 'N/A'}.</li>
                <li>Fazer liquidação de itens na Classe C para liberar espaço.</li>
                <li>Reavaliar margens de produtos na Classe B.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Vendas Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Item</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Valor</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Data</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3 px-2 text-foreground">{sale.item}</td>
                  <td className="py-3 px-2 text-foreground font-medium">{sale.price}</td>
                  <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{sale.date}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sale.status === "Pago"
                        ? "bg-success/10 text-success"
                        : "bg-accent/10 text-accent"
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
