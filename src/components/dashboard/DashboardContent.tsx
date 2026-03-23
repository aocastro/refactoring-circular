import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CreditCard } from "lucide-react";
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
} from "recharts";
import KpiCard from "@/components/shared/KpiCard";
import { dashboardKpis, revenueData, salesByCategory, recentSales } from "@/data/dashboard";
import { chartTooltipStyle, chartGridStroke, chartAxisStroke, chartAxisFontSize, chartColors } from "@/lib/chart-config";

interface DashboardContentProps {
  onSectionChange?: (section: string) => void;
}

const DashboardContent = ({ onSectionChange }: DashboardContentProps) => {
  const [trialDays, setTrialDays] = useState<number | null>(null);

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

      <div>
        <h2 className="text-xl font-bold font-display text-foreground">Visão geral</h2>
        <p className="text-muted-foreground text-sm">Bom dia, Maria! Seja bem-vinda ao seu painel.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardKpis.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            {...kpi}
            delay={i * 0.05}
            onClick={kpi.target ? () => onSectionChange?.(kpi.target!) : undefined}
          />
        ))}
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
