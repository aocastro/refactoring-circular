import { useState, useMemo } from "react";
import { Plus, Users, FileText, DollarSign, Clock, CheckCircle, AlertCircle, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { mockConsignantes, mockContracts, consignanteStatusOptions, pendingRanges } from "@/data/consignacao";
import { getStatusColor } from "@/lib/status-colors";
import { exportToCSV } from "@/lib/export";
import type { KpiItem } from "@/types";

const ConsignacaoContent = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [pendingFilter, setPendingFilter] = useState("Todos");

  const filtered = useMemo(() => {
    const range = pendingRanges.find((p) => p.label === pendingFilter) || pendingRanges[0];
    return mockConsignantes.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
      let matchPending = true;
      if (pendingFilter === "Sem pendência") {
        matchPending = c.pendingValue === 0;
      } else if (pendingFilter !== "Todos") {
        matchPending = c.pendingValue >= range.min && c.pendingValue <= range.max;
      }
      return matchSearch && matchStatus && matchPending;
    });
  }, [search, statusFilter, pendingFilter]);

  const totalPending = mockConsignantes.reduce((acc, c) => acc + c.pendingValue, 0);

  const kpis: KpiItem[] = [
    { label: "Consignantes", value: mockConsignantes.length, icon: Users },
    { label: "Contratos Ativos", value: mockContracts.filter((c) => c.status === "Vigente").length, icon: FileText },
    { label: "Pagamento Pendente", value: `R$ ${totalPending.toFixed(2).replace(".", ",")}`, icon: DollarSign },
    { label: "Itens Consignados", value: mockConsignantes.reduce((a, c) => a + c.items, 0), icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Consignação</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus consignantes e contratos</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border"
          onClick={() => {
            exportToCSV(
              mockConsignantes.map((c) => ({ Nome: c.name, Itens: c.items, Vendidos: c.sold, Pendente: c.pending, Status: c.status, Desde: c.since })),
              "consignantes"
            );
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />
        ))}
      </div>

      {/* Consignantes */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Consignantes</h3>

        <FilterToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar consignante..."
          filters={[
            { key: "status", label: "Status", options: consignanteStatusOptions, value: statusFilter, onChange: setStatusFilter },
            { key: "pending", label: "Valor Pendente", options: pendingRanges.map((p) => p.label), value: pendingFilter, onChange: setPendingFilter },
          ]}
          actions={
            <Button size="sm" className="bg-gradient-primary text-primary-foreground shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          }
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Consignante</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Itens</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Vendidos</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Pendente</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Nenhum consignante encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-foreground font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">Desde {c.since}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground hidden sm:table-cell">{c.items}</td>
                      <td className="py-3 px-4 text-foreground hidden md:table-cell">{c.sold}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{c.pending}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(c.status)}`}>
                          {c.status === "Ativo" ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contracts */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Contratos Recentes</h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Consignante</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Itens</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Data</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Divisão</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-foreground">{contract.consignante}</td>
                    <td className="py-3 px-4 text-foreground hidden sm:table-cell">{contract.items}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{contract.date}</td>
                    <td className="py-3 px-4 text-foreground font-mono text-xs">{contract.split}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status === "Vigente" ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsignacaoContent;
