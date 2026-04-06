import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import type { KpiItem } from "@/types";

type OrderStatus = "Pendente" | "Confirmado" | "Em Preparo" | "Enviado" | "Entregue" | "Cancelado";

interface Order {
  id: number;
  code: string;
  customer: string;
  email: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  date: string;
  payment: string;
  address: string;
}

const initialOrders: Order[] = [
  { id: 1, code: "PED-2401", customer: "Ana Silva", email: "ana@email.com", items: [{ name: "Vestido Floral Vintage", qty: 1, price: 89.9 }, { name: "Colar Artesanal Boho", qty: 1, price: 45 }], total: 134.9, status: "Pendente", date: "12/03/2026", payment: "PIX", address: "Rua das Flores, 123 - SP" },
  { id: 2, code: "PED-2402", customer: "Carlos Mendes", email: "carlos@email.com", items: [{ name: "Jaqueta Jeans Upcycled", qty: 1, price: 159 }], total: 159, status: "Confirmado", date: "11/03/2026", payment: "Cartão Crédito", address: "Av. Paulista, 456 - SP" },
  { id: 3, code: "PED-2403", customer: "Juliana Costa", email: "ju@email.com", items: [{ name: "Bolsa de Couro Retrô", qty: 1, price: 210 }], total: 210, status: "Enviado", date: "10/03/2026", payment: "Cartão Débito", address: "Rua Augusta, 789 - SP" },
  { id: 4, code: "PED-2404", customer: "Maria Oliveira", email: "maria@email.com", items: [{ name: "Tênis Vintage Adidas", qty: 1, price: 120 }, { name: "Camisa Hawaiana 90s", qty: 1, price: 65 }], total: 185, status: "Entregue", date: "08/03/2026", payment: "PIX", address: "Rua Oscar Freire, 321 - SP" },
  { id: 5, code: "PED-2405", customer: "Pedro Santos", email: "pedro@email.com", items: [{ name: "Óculos Retrô Ray-Ban", qty: 1, price: 195 }], total: 195, status: "Cancelado", date: "07/03/2026", payment: "Cartão Crédito", address: "Rua Haddock Lobo, 654 - SP" },
  { id: 6, code: "PED-2406", customer: "Fernanda Lima", email: "fer@email.com", items: [{ name: "Saia Midi Plissada", qty: 1, price: 78 }], total: 78, status: "Em Preparo", date: "12/03/2026", payment: "PIX", address: "Rua Consolação, 987 - SP" },
];

const statusColor = (s: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    "Pendente": "bg-accent/10 text-accent",
    "Confirmado": "bg-primary/10 text-primary",
    "Em Preparo": "bg-accent/10 text-accent",
    "Enviado": "bg-primary/10 text-primary",
    "Entregue": "bg-primary/10 text-primary",
    "Cancelado": "bg-destructive/10 text-destructive",
  };
  return map[s];
};

const statusSteps: OrderStatus[] = ["Pendente", "Confirmado", "Em Preparo", "Enviado", "Entregue"];

const PedidosContent = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ⚡ Bolt: Memoize filtered array to prevent unnecessary O(n) re-evaluations during unrelated re-renders
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = o.code.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  // ⚡ Bolt: Memoize KPIs to avoid redundant recalculations of aggregate data on every render
  const kpis: KpiItem[] = useMemo(() => [
    { label: "Total Pedidos", value: orders.length, icon: Package },
    { label: "Pendentes", value: orders.filter((o) => o.status === "Pendente").length, icon: Clock },
    { label: "Entregues", value: orders.filter((o) => o.status === "Entregue").length, icon: CheckCircle },
    { label: "Cancelados", value: orders.filter((o) => o.status === "Cancelado").length, icon: XCircle },
  ], [orders]);
  // ⚡ Bolt: Memoized filtered array to prevent unnecessary re-renders when other state changes
  const filtered = useMemo(() => orders.filter((o) => {
    const matchSearch = o.code.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
    return matchSearch && matchStatus;
  }), [orders, search, statusFilter]);

  // ⚡ Bolt: Single O(n) pass instead of O(3n) multiple filter calls, wrapped in useMemo
  const kpis: KpiItem[] = useMemo(() => {
    let pendentes = 0;
    let entregues = 0;
    let cancelados = 0;

    for (const o of orders) {
      if (o.status === "Pendente") pendentes++;
      else if (o.status === "Entregue") entregues++;
      else if (o.status === "Cancelado") cancelados++;
    }

    return [
      { label: "Total Pedidos", value: orders.length, icon: Package },
      { label: "Pendentes", value: pendentes, icon: Clock },
      { label: "Entregues", value: entregues, icon: CheckCircle },
      { label: "Cancelados", value: cancelados, icon: XCircle },
    ];
  }, [orders]);

  const advanceStatus = (id: number) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const idx = statusSteps.indexOf(o.status);
      if (idx < 0 || idx >= statusSteps.length - 1) return o;
      return { ...o, status: statusSteps[idx + 1] };
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Pedidos da Loja Online</h1>
        <p className="text-muted-foreground text-sm">Acompanhe e gerencie os pedidos recebidos pelo e-commerce</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por código ou cliente..."
        filters={[
          { key: "status", label: "Status", options: ["Todos", ...statusSteps, "Cancelado"], value: statusFilter, onChange: setStatusFilter },
        ]}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Pedido</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cliente</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Data</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Pagamento</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 text-foreground font-mono text-xs font-medium">{order.code}</td>
                  <td className="py-3 px-4 text-foreground">{order.customer}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{order.date}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{order.payment}</td>
                  <td className="py-3 px-4 text-foreground font-medium text-right">R$ {order.total.toFixed(2)}</td>
                  <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${statusColor(order.status)}`}>{order.status}</span></td>
                  <td className="py-3 px-4 text-right flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}><Eye className="h-4 w-4" /></Button>
                    {statusSteps.includes(order.status) && order.status !== "Entregue" && (
                      <Button size="sm" variant="ghost" onClick={() => advanceStatus(order.id)}><Truck className="h-4 w-4" /></Button>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Nenhum pedido encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Pedido {selectedOrder?.code}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cliente:</span><p className="font-medium text-foreground">{selectedOrder.customer}</p></div>
                <div><span className="text-muted-foreground">Data:</span><p className="font-medium text-foreground">{selectedOrder.date}</p></div>
                <div><span className="text-muted-foreground">Pagamento:</span><p className="font-medium text-foreground">{selectedOrder.payment}</p></div>
                <div><span className="text-muted-foreground">Status:</span><p><span className={`text-xs px-2 py-1 rounded-full ${statusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p></div>
              </div>
              <div><span className="text-muted-foreground text-sm">Endereço:</span><p className="text-sm text-foreground">{selectedOrder.address}</p></div>
              <div className="border-t border-border pt-3">
                <p className="text-sm font-medium text-foreground mb-2">Itens</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-foreground">{item.qty}x {item.name}</span>
                    <span className="text-muted-foreground">R$ {item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-border mt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">R$ {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PedidosContent;
