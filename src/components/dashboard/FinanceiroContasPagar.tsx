import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, Filter, Calendar as CalendarIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DataTable from "@/components/shared/DataTable";
import type { DataTableColumn } from "@/components/shared/DataTable";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControls from "@/components/shared/PaginationControls";
import { parse, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from "date-fns";

export interface Despesa {
  id: number;
  descricao: string;
  categoria: string;
  vencimento: string;
  valor: number;
  status: "Pendente" | "Pago" | "Atrasado";
}

const initialData: Despesa[] = [
  { id: 1, descricao: "Aluguel da Loja", categoria: "Infraestrutura", vencimento: "10/04/2026", valor: 3500, status: "Pendente" },
  { id: 2, descricao: "Fornecedor - Camisetas", categoria: "Fornecedores", vencimento: "15/04/2026", valor: 4200, status: "Pendente" },
  { id: 3, descricao: "Conta de Luz", categoria: "Infraestrutura", vencimento: "05/04/2026", valor: 450, status: "Pago" },
  { id: 4, descricao: "Marketing Social", categoria: "Marketing", vencimento: "01/04/2026", valor: 1500, status: "Atrasado" },
];

export function FinanceiroContasPagar() {
  const [data, setData] = useState<Despesa[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [monthFilter, setMonthFilter] = useState("todos");
  const [sortKey, setSortKey] = useState<keyof Despesa | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  const handleSort = (key: string) => {
    const k = key as keyof Despesa;
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
      conta.id === id ? { ...conta, status: "Pago" as const } : conta
    ));
  };

  const { paginatedItems, totalPages, totalItems } = usePagination(filteredAndSortedData, itemsPerPage, page);

  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepetir, setIsRepetir] = useState(false);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const columns: DataTableColumn[] = [
    { key: "descricao", label: "Descrição", sortable: true },
    { key: "categoria", label: "Categoria", hideOn: "sm", sortable: true },
    { key: "vencimento", label: "Vencimento", sortable: true },
    { key: "valor", label: "Valor", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "acoes", label: "Ações", align: "right" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Contas a Pagar</h3>
          <p className="text-sm text-muted-foreground">Gerencie suas obrigações financeiras.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-secondary rounded-md p-1">
             <Button
               variant={viewMode === "table" ? "secondary" : "ghost"}
               size="sm"
               className="h-8 px-2"
               onClick={() => setViewMode("table")}
             >
               <List className="h-4 w-4 mr-1" /> Lista
             </Button>
             <Button
               variant={viewMode === "calendar" ? "secondary" : "ghost"}
               size="sm"
               className="h-8 px-2"
               onClick={() => setViewMode("calendar")}
             >
               <CalendarIcon className="h-4 w-4 mr-1" /> Calendário
             </Button>
           </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Conta</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Despesa</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input id="descricao" placeholder="Ex: Conta de Luz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor R$</Label>
                  <Input id="valor" type="number" placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select>
                    <SelectTrigger id="categoria"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infra">Infraestrutura</SelectItem>
                      <SelectItem value="forn">Fornecedores</SelectItem>
                      <SelectItem value="mkt">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vencimento">Vencimento</Label>
                  <Input id="vencimento" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliente">Associar Cliente (Opcional)</Label>
                  <Select>
                    <SelectTrigger id="cliente"><SelectValue placeholder="Selecione um cliente..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cli1">Cliente A</SelectItem>
                      <SelectItem value="cli2">Cliente B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_manual">Nome Manual (Opcional)</Label>
                  <Input id="nome_manual" placeholder="Nome para referência" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="obs">Observações</Label>
                  <Textarea id="obs" placeholder="Detalhes adicionais..." />
                </div>

                <div className="space-y-4 md:col-span-2 p-4 border rounded-lg bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="repetir" className="font-semibold">Repetir essa conta?</Label>
                    <Switch id="repetir" checked={isRepetir} onCheckedChange={setIsRepetir} />
                  </div>

                  {isRepetir && (
                    <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="frequencia">Frequência</Label>
                        <Select>
                          <SelectTrigger id="frequencia"><SelectValue placeholder="Selecione a frequência" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diario">Diário</SelectItem>
                            <SelectItem value="semanal">Semanal</SelectItem>
                            <SelectItem value="quinzenal">Quinzenal</SelectItem>
                            <SelectItem value="mensal">Mensal</SelectItem>
                            <SelectItem value="trimestral">Trimestral</SelectItem>
                            <SelectItem value="semestral">Semestral</SelectItem>
                            <SelectItem value="anual">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parcelas">Número de parcelas</Label>
                        <Input id="parcelas" type="number" min="2" placeholder="Ex: 12" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={() => setIsModalOpen(false)}>Salvar Despesa</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
              <SelectItem value="Pago">Pago</SelectItem>
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

      {viewMode === "table" ? (
        <>
          <DataTable<Despesa>
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
                <td className="px-4 py-3 font-medium">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={conta.status === "Pago" ? "bg-success/10 text-success" : conta.status === "Atrasado" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
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
        </>
      ) : (
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>Mês Anterior</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>Próximo Mês</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => {
              const dayStr = format(day, "dd/MM/yyyy");
              const dayExpenses = filteredAndSortedData.filter(d => d.vencimento === dayStr);

              return (
                <div
                  key={idx}
                  className={`min-h-[100px] p-2 border border-border rounded-md ${!isSameMonth(day, currentDate) ? "bg-muted/50 opacity-50" : "bg-card"} ${isToday(day) ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="text-right text-xs font-medium mb-1">{format(day, "d")}</div>
                  <div className="space-y-1">
                    {dayExpenses.map(expense => (
                      <div key={expense.id} className={`text-xs p-1 rounded-sm truncate ${expense.status === "Pago" ? "bg-success/20 text-success-foreground" : expense.status === "Atrasado" ? "bg-destructive/20 text-destructive-foreground" : "bg-warning/20 text-warning-foreground"}`} title={`${expense.descricao} - R$ ${expense.valor}`}>
                        R$ {expense.valor}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
