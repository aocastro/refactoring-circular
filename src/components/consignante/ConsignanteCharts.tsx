import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const salesByMonth = [
  { month: "Jul", vendas: 2, valor: 130 },
  { month: "Ago", vendas: 1, valor: 85 },
  { month: "Set", vendas: 1, valor: 68 },
  { month: "Out", vendas: 1, valor: 42 },
  { month: "Nov", vendas: 2, valor: 120 },
  { month: "Dez", vendas: 5, valor: 338 },
];

const categoryBreakdown = [
  { name: "Vestidos", value: 3 },
  { name: "Calças", value: 2 },
  { name: "Blusas", value: 2 },
  { name: "Casacos", value: 2 },
  { name: "Acessórios", value: 3 },
];

const COLORS = [
  "hsl(270, 80%, 60%)",
  "hsl(180, 100%, 50%)",
  "hsl(300, 80%, 55%)",
  "hsl(150, 80%, 45%)",
  "hsl(45, 90%, 55%)",
];

const ConsignanteCharts = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Sales evolution */}
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Evolução de Vendas</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={salesByMonth}>
          <defs>
            <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(270,80%,60%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(270,80%,60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(260,15%,20%)" />
          <XAxis dataKey="month" tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "hsl(260,10%,8%)", border: "1px solid hsl(260,15%,16%)", borderRadius: 8, color: "hsl(0,0%,95%)" }}
            labelStyle={{ color: "hsl(0,0%,55%)" }}
          />
          <Area type="monotone" dataKey="valor" stroke="hsl(270,80%,60%)" fill="url(#cGrad)" strokeWidth={2} name="Valor (R$)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* Revenue by month bar */}
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Itens Vendidos por Mês</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={salesByMonth}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(260,15%,20%)" />
          <XAxis dataKey="month" tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "hsl(260,10%,8%)", border: "1px solid hsl(260,15%,16%)", borderRadius: 8, color: "hsl(0,0%,95%)" }}
          />
          <Bar dataKey="vendas" fill="hsl(180,100%,50%)" radius={[4, 4, 0, 0]} name="Itens" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Category breakdown pie */}
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 lg:col-span-2">
      <h3 className="text-sm font-semibold text-foreground">Breakdown por Categoria</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <ResponsiveContainer width="100%" height={200} className="max-w-[250px]">
          <PieChart>
            <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
              {categoryBreakdown.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "hsl(260,10%,8%)", border: "1px solid hsl(260,15%,16%)", borderRadius: 8, color: "hsl(0,0%,95%)" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3">
          {categoryBreakdown.map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
              <span className="text-xs text-muted-foreground">{cat.name} ({cat.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ConsignanteCharts;
