import { useState, useEffect } from "react";
import api from "@/api/axios";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, ArrowUpRight, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



const AdminFinanceiroContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminFinancial, setAdminFinancial] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminMonthlyRevenue, setAdminMonthlyRevenue] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_adminFinancial = await api.get('/api/admin/financial');
        setAdminFinancial(res_adminFinancial.data);
        const res_adminMonthlyRevenue = await api.get('/api/admin/monthly-revenue');
        setAdminMonthlyRevenue(res_adminMonthlyRevenue.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);


  const kpis = [
    { label: "Receita Total", value: `R$ ${(adminFinancial?.revenueTotal || 0).toLocaleString("pt-BR")}`, icon: DollarSign, change: "+18.2%", positive: true },
    { label: "Receita Mensal", value: `R$ ${(adminFinancial?.revenueMes || 0).toLocaleString("pt-BR")}`, icon: TrendingUp, change: "+10.3%", positive: true },
    { label: "Comissões Pendentes", value: `R$ ${(adminFinancial?.comissoesPendentes || 0).toLocaleString("pt-BR")}`, icon: DollarSign, change: "8 lojas", positive: false },
    { label: "Taxa de Conversão", value: `${adminFinancial?.taxaConversao || 0}%`, icon: Percent, change: "+0.6pp", positive: true },
  ];




  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-2xl font-bold text-foreground">Financeiro da Plataforma</h2>
        <p className="text-sm text-muted-foreground">Receitas, comissões e métricas financeiras</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                  <p className={`text-xs ${kpi.positive ? "text-green-600" : "text-muted-foreground"}`}>
                    {kpi.positive && <ArrowUpRight className="mr-0.5 inline h-3 w-3" />}{kpi.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Receita vs Custos Operacionais</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={adminMonthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
              <Legend />
              <Bar dataKey="receita" name="Receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="custos" name="Custos" fill="hsl(var(--muted-foreground) / .3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinanceiroContent;
