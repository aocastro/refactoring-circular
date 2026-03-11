import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  LogOut,
  Sun,
  Moon,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { exportToCSV } from "@/lib/export";
import ConsignanteCharts from "@/components/consignante/ConsignanteCharts";

const myProducts = [
  { id: 1, name: "Vestido Floral Vintage", price: "R$ 89,90", status: "Vendido", date: "15/12/2025" },
  { id: 2, name: "Saia Midi Plissada", price: "R$ 78,00", status: "Vendido", date: "18/12/2025" },
  { id: 3, name: "Blusa de Seda", price: "R$ 65,00", status: "Disponível", date: "10/12/2025" },
  { id: 4, name: "Casaco Lã Vintage", price: "R$ 120,00", status: "Disponível", date: "12/12/2025" },
  { id: 5, name: "Calça Jeans Retrô", price: "R$ 55,00", status: "Vendido", date: "20/12/2025" },
  { id: 6, name: "Jaqueta Couro Eco", price: "R$ 195,00", status: "Reservado", date: "22/12/2025" },
  { id: 7, name: "Vestido Longo Boho", price: "R$ 110,00", status: "Disponível", date: "08/12/2025" },
  { id: 8, name: "Top Crochê Artesanal", price: "R$ 45,00", status: "Vendido", date: "05/12/2025" },
  { id: 9, name: "Shorts Vintage Levis", price: "R$ 68,00", status: "Disponível", date: "01/12/2025" },
  { id: 10, name: "Bolsa Tecido Upcycled", price: "R$ 85,00", status: "Vendido", date: "25/11/2025" },
  { id: 11, name: "Chapéu Palha Vintage", price: "R$ 35,00", status: "Disponível", date: "28/11/2025" },
  { id: 12, name: "Cinto Couro Artesanal", price: "R$ 42,00", status: "Vendido", date: "30/11/2025" },
];

const myPayments = [
  { id: 1, period: "Dez/2025", items: 4, gross: "R$ 287,90", commission: "40%", net: "R$ 172,74", status: "Pendente" },
  { id: 2, period: "Nov/2025", items: 3, gross: "R$ 195,00", commission: "40%", net: "R$ 117,00", status: "Pago" },
  { id: 3, period: "Out/2025", items: 1, gross: "R$ 85,00", commission: "40%", net: "R$ 51,00", status: "Pago" },
];

const ConsignantePainel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("consignante");
    if (!stored) {
      navigate("/consignante");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("consignante");
    navigate("/consignante");
  };

  const soldCount = myProducts.filter(p => p.status === "Vendido").length;
  const availableCount = myProducts.filter(p => p.status === "Disponível").length;

  const handleExportProducts = () => {
    exportToCSV(
      myProducts.map(p => ({ Produto: p.name, Preço: p.price, Status: p.status, Data: p.date })),
      "meus-produtos"
    );
  };

  const handleExportPayments = () => {
    exportToCSV(
      myPayments.map(p => ({ Período: p.period, Itens: p.items, Bruto: p.gross, Comissão: p.commission, Líquido: p.net, Status: p.status })),
      "meus-pagamentos"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold font-display text-sm">
              C
            </div>
            <span className="font-display font-bold text-foreground text-sm">
              Circular <span className="text-accent text-xs">Consignante</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user.name.charAt(0)}
            </div>
            <span className="text-sm text-foreground hidden sm:block">{user.name}</span>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Olá, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground text-sm">Acompanhe seus produtos e pagamentos</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total de Peças", value: myProducts.length, icon: Package },
            { label: "Vendidas", value: soldCount, icon: CheckCircle },
            { label: "Disponíveis", value: availableCount, icon: Clock },
            { label: "Pendente", value: "R$ 172,74", icon: DollarSign },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-xl font-bold font-display text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Contract info */}
        <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center gap-3">
          <FileText className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Contrato Ativo — Brechó da Maria</p>
            <p className="text-xs text-muted-foreground">Divisão: 60/40 (Loja/Consignante) • Desde Mar/2025</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium shrink-0">Vigente</span>
        </div>

        {/* Charts */}
        <ConsignanteCharts />

        {/* Products */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Meus Produtos</h3>
            <Button variant="outline" size="sm" className="border-border" onClick={handleExportProducts}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Produto</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Preço</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Data Entrada</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myProducts.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{p.name}</td>
                      <td className="py-3 px-4 text-foreground">{p.price}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.date}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          p.status === "Vendido" ? "bg-success/10 text-success" :
                          p.status === "Reservado" ? "bg-accent/10 text-accent" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Meus Pagamentos</h3>
            <Button variant="outline" size="sm" className="border-border" onClick={handleExportPayments}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Período</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Itens</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Bruto</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Líquido</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myPayments.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{p.period}</td>
                      <td className="py-3 px-4 text-foreground hidden sm:table-cell">{p.items}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{p.gross}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{p.net}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          p.status === "Pago" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsignantePainel;
