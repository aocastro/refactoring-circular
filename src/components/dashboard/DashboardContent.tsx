import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Leaf,
  Droplets,
} from "lucide-react";
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

const kpis = [
  { label: "Receita do Mês", value: "R$ 12.450", change: "+12%", icon: DollarSign, positive: true },
  { label: "Vendas", value: "87", change: "+8%", icon: ShoppingBag, positive: true },
  { label: "Ticket Médio", value: "R$ 143", change: "+3%", icon: TrendingUp, positive: true },
  { label: "Consignantes Ativos", value: "23", change: "+2", icon: Users, positive: true },
  { label: "CO₂ Evitado", value: "361 kg", change: "+15%", icon: Leaf, positive: true },
  { label: "Água Economizada", value: "234.900 L", change: "+12%", icon: Droplets, positive: true },
];

const revenueData = [
  { month: "Jul", value: 8200 },
  { month: "Ago", value: 9100 },
  { month: "Set", value: 7800 },
  { month: "Out", value: 10500 },
  { month: "Nov", value: 11200 },
  { month: "Dez", value: 12450 },
];

const salesByCategory = [
  { category: "Roupas", value: 42 },
  { category: "Acessórios", value: 18 },
  { category: "Calçados", value: 15 },
  { category: "Bolsas", value: 12 },
];

const recentSales = [
  { id: 1, item: "Vestido Floral Vintage", price: "R$ 89,90", date: "Hoje, 14:30", status: "Pago" },
  { id: 2, item: "Jaqueta Jeans Upcycled", price: "R$ 159,00", date: "Hoje, 11:15", status: "Pago" },
  { id: 3, item: "Bolsa de Couro Retrô", price: "R$ 210,00", date: "Ontem, 18:45", status: "Pendente" },
  { id: 4, item: "Tênis Vintage Adidas", price: "R$ 120,00", date: "Ontem, 09:20", status: "Pago" },
  { id: 5, item: "Colar Artesanal Boho", price: "R$ 45,00", date: "22/12, 16:00", status: "Pago" },
];

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Bom dia, Maria! Seja bem-vinda ao seu painel.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-success">{kpi.change}</span>
            </div>
            <p className="text-2xl font-bold font-display text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </motion.div>
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
                  <stop offset="5%" stopColor="hsl(270, 80%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(270, 80%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 15%, 16%)" />
              <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(0, 0%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(260, 10%, 8%)",
                  border: "1px solid hsl(260, 15%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(0, 0%, 95%)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(270, 80%, 60%)" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Vendas por Categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 15%, 16%)" />
              <XAxis dataKey="category" stroke="hsl(0, 0%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(0, 0%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(260, 10%, 8%)",
                  border: "1px solid hsl(260, 15%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(0, 0%, 95%)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="hsl(180, 100%, 50%)" radius={[4, 4, 0, 0]} />
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
