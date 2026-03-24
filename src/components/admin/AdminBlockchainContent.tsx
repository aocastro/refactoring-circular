import { motion } from "framer-motion";
import { Link2, Hash, Shield, Store, ArrowUpRight, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blockchainStats, blockchainTransactions } from "@/data/admin";

const kpis = [
  { label: "Tokens Emitidos", value: blockchainStats.totalTokens.toLocaleString("pt-BR"), icon: Hash, change: "+342 este mês" },
  { label: "Transações/Mês", value: blockchainStats.transacoesMes.toString(), icon: Link2, change: "+18%" },
  { label: "Certificados", value: blockchainStats.certificadosEmitidos.toLocaleString("pt-BR"), icon: Shield, change: "+156" },
  { label: "Lojas Blockchain", value: blockchainStats.lojasBlockchain.toString(), icon: Store, change: "+8 este mês" },
];

const statusConfig: Record<string, { icon: React.ReactNode; variant: "default" | "secondary" | "destructive" }> = {
  confirmado: { icon: <CheckCircle className="h-3.5 w-3.5" />, variant: "default" },
  pendente: { icon: <Clock className="h-3.5 w-3.5" />, variant: "secondary" },
  falhou: { icon: <XCircle className="h-3.5 w-3.5" />, variant: "destructive" },
};

const typeLabel: Record<string, string> = { mint: "Mint", transfer: "Transferência", verify: "Verificação" };

const AdminBlockchainContent = () => (
  <div className="space-y-6">
    <header>
      <h2 className="font-display text-2xl font-bold text-foreground">Blockchain & Rastreabilidade</h2>
      <p className="text-sm text-muted-foreground">Tokens, certificados e transações de autenticidade na plataforma</p>
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
      <CardHeader><CardTitle className="text-base">Transações Recentes</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {blockchainTransactions.map((tx, i) => {
            const cfg = statusConfig[tx.status];
            return (
              <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{typeLabel[tx.type]}</Badge>
                    <span className="text-sm font-medium text-foreground">{tx.description}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>Hash: <code className="font-mono">{tx.hash}</code></span>
                    <span>Loja: {tx.store}</span>
                    <span>{tx.timestamp}</span>
                  </div>
                </div>
                <Badge variant={cfg.variant} className="flex items-center gap-1 self-start">
                  {cfg.icon}{tx.status}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminBlockchainContent;
