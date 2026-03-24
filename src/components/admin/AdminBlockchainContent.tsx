import { motion } from "framer-motion";
import { Link2, Hash, Shield, Store, ArrowUpRight, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blockchainStats, blockchainTransactions, type BlockchainTransaction } from "@/data/admin";
import DataTable from "@/components/shared/DataTable";

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

const columns = [
  { key: "type", label: "Tipo / Descrição" },
  { key: "hash", label: "Hash", hideOn: "md" as const },
  { key: "store", label: "Loja", hideOn: "sm" as const },
  { key: "timestamp", label: "Data/Hora", hideOn: "sm" as const },
  { key: "status", label: "Status" },
];

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

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DataTable
        columns={columns}
        data={blockchainTransactions}
        emptyMessage="Nenhuma transação encontrada."
        header={<h3 className="text-base font-semibold text-foreground">Transações Recentes</h3>}
        renderRow={(tx: BlockchainTransaction) => {
          const cfg = statusConfig[tx.status];
          return (
            <tr key={tx.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{typeLabel[tx.type]}</Badge>
                    <span className="text-sm font-medium text-foreground">{tx.description}</span>
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                <code className="font-mono">{tx.hash}</code>
              </td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                {tx.store}
              </td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                {tx.timestamp}
              </td>
              <td className="px-4 py-3">
                <Badge variant={cfg.variant} className="flex w-fit items-center gap-1">
                  {cfg.icon}{tx.status}
                </Badge>
              </td>
            </tr>
          );
        }}
      />
    </motion.div>
  </div>
);

export default AdminBlockchainContent;
