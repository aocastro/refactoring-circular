import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable from "@/components/shared/DataTable";
import type { DataTableColumn } from "@/components/shared/DataTable";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControls from "@/components/shared/PaginationControls";
import { parse, format } from "date-fns";

export interface Conta {
  id: number;
  descricao: string;
  categoria: string;
  vencimento: string;
  valor: number;
  status: "Pendente" | "Pago" | "Atrasado" | "Recebido";
}

const initialData: Conta[] = [
  { id: 1, descricao: "Vendas Online (Cartão)", categoria: "Vendas", vencimento: "12/04/2026", valor: 8500, status: "Pendente" },
  { id: 2, descricao: "Vendas PDV (Pix)", categoria: "Vendas", vencimento: "10/04/2026", valor: 3200, status: "Recebido" },
  { id: 3, descricao: "Marketplace X", categoria: "Plataformas", vencimento: "15/04/2026", valor: 4100, status: "Pendente" },
  { id: 4, descricao: "Parceria Influenciador", categoria: "Parcerias", vencimento: "05/04/2026", valor: 1200, status: "Recebido" },
];

export function FinanceiroContasReceber() {
  const [data, setData] = useState<Conta[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [monthFilter, setMonthFilter] = useState("todos");
  const [sortKey, setSortKey] = useState<keyof Conta | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: string) => {
    const k = key as keyof Conta;
    if (sortKey === k) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(k);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) => item.descricao.toLowerCase().includes(lowerSearch));
    }

    if (statusFilter !== "todos") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (monthFilter !== "todos") {
      result = result.filter((item) => {
        try {
          const date = parse(item.vencimento, "dd/MM/yyyy", new Date());
          const monthYear = format(date, "MM/yyyy");
          return monthYear === monthFilter;
        } catch {
          return true; // Fallback se a data for inválida
        }
      });
    }

    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];

        if (sortKey === "vencimento") {
          try {
            aVal = parse(a.vencimento, "dd/MM/yyyy", new Date()).getTime();
            bVal = parse(b.vencimento, "dd/MM/yyyy", new Date()).getTime();
          } catch {
             // Fallback to string comparison
          }
        }

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, statusFilter, monthFilter, sortKey, sortDirection]);

  // Extrair meses únicos para o filtro
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    data.forEach(item => {
      try {
        const date = parse(item.vencimento, "dd/MM/yyyy", new Date());
        months.add(format(date, "MM/yyyy"));
      } catch {
        // Ignora datas inválidas
      }
    });
    return Array.from(months).sort((a, b) => {
      const dateA = parse(`01/${a}`, "dd/MM/yyyy", new Date());
      const dateB = parse(`01/${b}`, "dd/MM/yyyy", new Date());
      return dateB.getTime() - dateA.getTime(); // Mais recente primeiro
    });
  }, [data]);

  const handleBaixa = (id: number) => {
    setData(prev => prev.map(conta =>
      conta.id === id ? { ...conta, status: "Recebido" as const } : conta
    ));
  };

  const { paginatedItems, totalPages, totalItems } = usePagination(filteredAndSortedData, itemsPerPage, page);

  const columns: DataTableColumn[] = [
    { key: "descricao", label: "Descrição", sortable: true },
    { key: "categoria", label: "Categoria", hideOn: "sm", sortable: true },
    { key: "vencimento", label: "Recebimento", sortable: true },
    { key: "valor", label: "Valor", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "acoes", label: "Ações", align: "right" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Contas a Receber</h3>
          <p className="text-sm text-muted-foreground">Acompanhe suas receitas pendentes e recebidas.</p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Receita</Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Status</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Recebido">Recebido</SelectItem>
              <SelectItem value="Atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Mês de Referência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Meses</SelectItem>
              {availableMonths.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      <DataTable<Conta>
        columns={columns}
        data={paginatedItems}
        onSort={handleSort}
        sortKey={sortKey || undefined}
        sortDirection={sortDirection}
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
                {conta.status === "Pendente" && (
                  <Button variant="outline" size="sm" onClick={() => handleBaixa(conta.id)} className="mr-2">Dar Baixa</Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        )}
      />
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
      />
    </div>
  );
}
