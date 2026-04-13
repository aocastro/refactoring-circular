import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Tags, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Conta {
  id: number;
  descricao: string;
  categoria: string;
  vencimento: string;
  valor: number;
  status: "Pendente" | "Pago" | "Atrasado" | "Recebido";
}

interface FinCategoria {
  id: number;
  nome: string;
  tipo: "Despesa" | "Receita";
  cor: string;
}

interface FinanceiroContentProps {
  defaultTab?: string;
  onSectionChange?: (section: string) => void;
}

const FinanceiroContent = ({ defaultTab = "visao-geral", onSectionChange }: FinanceiroContentProps) => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-2xl font-bold text-foreground sr-only">Financeiro</h2>
        <p className="text-sm text-muted-foreground">Gerencie suas contas a pagar, a receber e categorias.</p>
      </header>

      <Tabs value={defaultTab} onValueChange={(value) => {
        if (onSectionChange) {
          onSectionChange(
            value === "visao-geral" ? "financeiro-visao-geral" :
            value === "contas-pagar" ? "financeiro-pagar" :
            value === "contas-receber" ? "financeiro-receber" : "financeiro-categorias"
          );
        }
      }} className="w-full" aria-label="Seções do financeiro">
        <TabsList className="border border-border bg-secondary flex flex-wrap h-auto">
          <TabsTrigger value="visao-geral" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none">
            <DollarSign className="mr-2 h-4 w-4" />Visão Geral
          </TabsTrigger>
          <TabsTrigger value="contas-pagar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none">
            <ArrowDownCircle className="mr-2 h-4 w-4" />Contas a Pagar
          </TabsTrigger>
          <TabsTrigger value="contas-receber" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none">
            <ArrowUpCircle className="mr-2 h-4 w-4" />Contas a Receber
          </TabsTrigger>
          <TabsTrigger value="categorias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none">
            <Tags className="mr-2 h-4 w-4" />Categorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
                  <p className="text-2xl font-display font-bold text-foreground mt-1">R$ 15.450,00</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receitas do Mês</p>
                  <p className="text-2xl font-display font-bold text-success mt-1">R$ 28.300,00</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Despesas do Mês</p>
                  <p className="text-2xl font-display font-bold text-destructive mt-1">R$ 12.850,00</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <TrendingDown className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-4">Fluxo de Caixa (Últimos 6 meses)</h3>
              <div className="h-[300px] w-full min-w-0 overflow-x-auto">
                <div className="min-w-[400px] h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { mes: "Jan", receitas: 22000, despesas: 15000 },
                      { mes: "Fev", receitas: 25000, despesas: 14000 },
                      { mes: "Mar", receitas: 28000, despesas: 16000 },
                      { mes: "Abr", receitas: 24000, despesas: 13000 },
                      { mes: "Mai", receitas: 29000, despesas: 17000 },
                      { mes: "Jun", receitas: 32000, despesas: 15000 },
                    ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(value) => `R$${value/1000}k`} />
                      <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                      <Bar dataKey="receitas" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Receitas" />
                      <Bar dataKey="despesas" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Despesas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-4">Despesas por Categoria</h3>
              <div className="h-[300px] w-full min-w-0 overflow-x-auto">
                <div className="min-w-[400px] h-full flex flex-col sm:flex-row items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Fornecedores", value: 6500 },
                          { name: "Salários", value: 4200 },
                          { name: "Marketing", value: 1500 },
                          { name: "Impostos", value: 2000 },
                          { name: "Outros", value: 650 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          "hsl(var(--chart-1))",
                          "hsl(var(--chart-2))",
                          "hsl(var(--chart-3))",
                          "hsl(var(--chart-4))",
                          "hsl(var(--chart-5))",
                        ].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 px-4">
                    {[
                      { name: "Fornecedores", color: "bg-chart-1" },
                      { name: "Salários", color: "bg-chart-2" },
                      { name: "Marketing", color: "bg-chart-3" },
                      { name: "Impostos", color: "bg-chart-4" },
                      { name: "Outros", color: "bg-chart-5" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="contas-pagar" className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Contas a Pagar</h3>
              <p className="text-sm text-muted-foreground">Gerencie suas obrigações financeiras.</p>
            </div>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Conta</Button>
          </div>
          <DataTable<Conta>
            columns={[
              { key: "descricao", label: "Descrição" },
              { key: "categoria", label: "Categoria", hideOn: "sm" },
              { key: "vencimento", label: "Vencimento" },
              { key: "valor", label: "Valor" },
              { key: "status", label: "Status" },
              { key: "acoes", label: "Ações", align: "right" },
            ]}
            data={[
              { id: 1, descricao: "Aluguel da Loja", categoria: "Infraestrutura", vencimento: "10/04/2026", valor: 3500, status: "Pendente" },
              { id: 2, descricao: "Fornecedor - Camisetas", categoria: "Fornecedores", vencimento: "15/04/2026", valor: 4200, status: "Pendente" },
              { id: 3, descricao: "Conta de Luz", categoria: "Infraestrutura", vencimento: "05/04/2026", valor: 450, status: "Pago" },
              { id: 4, descricao: "Marketing Social", categoria: "Marketing", vencimento: "01/04/2026", valor: 1500, status: "Atrasado" },
            ]}
            renderRow={(conta) => (
              <tr key={conta.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3 font-medium text-foreground">{conta.descricao}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{conta.categoria}</td>
                <td className="px-4 py-3 text-muted-foreground">{conta.vencimento}</td>
                <td className="px-4 py-3 font-medium">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={conta.status === "Pago" ? "bg-success/10 text-success" : conta.status === "Atrasado" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
                    {conta.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </TabsContent>

        <TabsContent value="contas-receber" className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Contas a Receber</h3>
              <p className="text-sm text-muted-foreground">Acompanhe suas receitas pendentes e recebidas.</p>
            </div>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Receita</Button>
          </div>
          <DataTable<Conta>
            columns={[
              { key: "descricao", label: "Descrição" },
              { key: "categoria", label: "Categoria", hideOn: "sm" },
              { key: "vencimento", label: "Recebimento" },
              { key: "valor", label: "Valor" },
              { key: "status", label: "Status" },
              { key: "acoes", label: "Ações", align: "right" },
            ]}
            data={[
              { id: 1, descricao: "Vendas Online (Cartão)", categoria: "Vendas", vencimento: "12/04/2026", valor: 8500, status: "Pendente" },
              { id: 2, descricao: "Vendas PDV (Pix)", categoria: "Vendas", vencimento: "10/04/2026", valor: 3200, status: "Recebido" },
              { id: 3, descricao: "Marketplace X", categoria: "Plataformas", vencimento: "15/04/2026", valor: 4100, status: "Pendente" },
              { id: 4, descricao: "Parceria Influenciador", categoria: "Parcerias", vencimento: "05/04/2026", valor: 1200, status: "Recebido" },
            ]}
            renderRow={(conta) => (
              <tr key={conta.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3 font-medium text-foreground">{conta.descricao}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{conta.categoria}</td>
                <td className="px-4 py-3 text-muted-foreground">{conta.vencimento}</td>
                <td className="px-4 py-3 font-medium text-success">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={conta.status === "Recebido" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                    {conta.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </TabsContent>

        <TabsContent value="categorias" className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Categorias Financeiras</h3>
              <p className="text-sm text-muted-foreground">Gerencie as categorias de receitas e despesas.</p>
            </div>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Categoria</Button>
          </div>
          <DataTable<FinCategoria>
            columns={[
              { key: "nome", label: "Nome" },
              { key: "tipo", label: "Tipo" },
              { key: "cor", label: "Cor de Exibição" },
              { key: "acoes", label: "Ações", align: "right" },
            ]}
            data={[
              { id: 1, nome: "Fornecedores", tipo: "Despesa", cor: "bg-chart-1" },
              { id: 2, nome: "Salários", tipo: "Despesa", cor: "bg-chart-2" },
              { id: 3, nome: "Vendas", tipo: "Receita", cor: "bg-success" },
              { id: 4, nome: "Marketing", tipo: "Despesa", cor: "bg-chart-3" },
              { id: 5, nome: "Infraestrutura", tipo: "Despesa", cor: "bg-chart-4" },
              { id: 6, nome: "Parcerias", tipo: "Receita", cor: "bg-primary" },
            ]}
            renderRow={(cat) => (
              <tr key={cat.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3 font-medium text-foreground">{cat.nome}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={cat.tipo === "Receita" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                    {cat.tipo}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full ${cat.cor}`} />
                    <span className="text-sm text-muted-foreground">{cat.cor.replace("bg-", "")}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceiroContent;
