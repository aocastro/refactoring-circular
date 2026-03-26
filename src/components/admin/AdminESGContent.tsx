import { useState, useEffect } from "react";
import api from "@/api/axios";
import { motion } from "framer-motion";
import { Leaf, Droplets, Recycle, Store, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminESGContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminEsg, setAdminEsg] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminEsgMonthly, setAdminEsgMonthly] = useState<any>([]);

const AdminESGContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminEsg, setadminEsg] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminEsgMonthly, setadminEsgMonthly] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_adminEsg = await api.get('/api/admin/esg');
        setAdminEsg(res_adminEsg.data);
        const res_adminEsgMonthly = await api.get('/api/admin/esg-monthly');
        setAdminEsgMonthly(res_adminEsgMonthly.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);
  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;



  return (
  <div className="space-y-6">
    <header>
      <h2 className="font-display text-2xl font-bold text-foreground">Impacto Ambiental</h2>
      <p className="text-sm text-muted-foreground">Métricas de sustentabilidade e economia circular da plataforma</p>
    </header>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, i) => (
        <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                <p className="flex items-center gap-0.5 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />{kpi.change}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Evolução Mensal do Impacto</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={adminEsgMonthly}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="co2" name="CO₂ (kg)" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%, .15)" strokeWidth={2} />
            <Area type="monotone" dataKey="pecas" name="Peças" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / .15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);
};

export default AdminESGContent;
