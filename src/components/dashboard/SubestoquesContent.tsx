import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Warehouse, Plus, Trash2, Package, MapPin, ArrowRightLeft, ArrowLeft, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { mockProducts } from "@/data/products";
import { getStatusColor } from "@/lib/status-colors";
import type { KpiItem, Product } from "@/types";

interface SubStockProduct {
  product: Product;
  quantity: number;
  position: string;
}

interface SubStock {
  id: number;
  name: string;
  location: string;
  capacity: number;
  responsible: string;
  status: "Ativo" | "Inativo";
  products: SubStockProduct[];
}

const initialSubStocks: SubStock[] = [
  {
    id: 1, name: "Arara Principal", location: "Loja - Térreo", capacity: 60, responsible: "Maria", status: "Ativo",
    products: [
      { product: mockProducts[0], quantity: 3, position: "Seção A" },
      { product: mockProducts[1], quantity: 2, position: "Seção A" },
      { product: mockProducts[5], quantity: 5, position: "Seção B" },
      { product: mockProducts[6], quantity: 4, position: "Seção C" },
    ],
  },
  {
    id: 2, name: "Vitrine Frontal", location: "Loja - Entrada", capacity: 15, responsible: "Ana", status: "Ativo",
    products: [
      { product: mockProducts[2], quantity: 1, position: "Display Central" },
      { product: mockProducts[7], quantity: 1, position: "Display Lateral" },
    ],
  },
  {
    id: 3, name: "Estoque Reserva", location: "Depósito - Subsolo", capacity: 200, responsible: "Carlos", status: "Ativo",
    products: [
      { product: mockProducts[0], quantity: 10, position: "Prateleira 1" },
      { product: mockProducts[1], quantity: 8, position: "Prateleira 1" },
      { product: mockProducts[2], quantity: 5, position: "Prateleira 2" },
      { product: mockProducts[3], quantity: 12, position: "Prateleira 2" },
      { product: mockProducts[4], quantity: 15, position: "Prateleira 3" },
      { product: mockProducts[5], quantity: 10, position: "Prateleira 3" },
      { product: mockProducts[6], quantity: 7, position: "Prateleira 4" },
      { product: mockProducts[7], quantity: 6, position: "Prateleira 4" },
    ],
  },
  {
    id: 4, name: "Arara Promoções", location: "Loja - Fundo", capacity: 40, responsible: "Juliana", status: "Ativo",
    products: [
      { product: mockProducts[3], quantity: 4, position: "Promoção 1" },
      { product: mockProducts[4], quantity: 6, position: "Promoção 2" },
    ],
  },
  {
    id: 5, name: "Pop-up Store Centro", location: "Externo - Shopping", capacity: 25, responsible: "Pedro", status: "Inativo",
    products: [],
  },
];

const SubestoquesContent = () => {
  const [subStocks, setSubStocks] = useState(initialSubStocks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", capacity: "", responsible: "" });
  const [selectedStock, setSelectedStock] = useState<SubStock | null>(null);
  const [productSearch, setProductSearch] = useState("");

  const filtered = subStocks.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalItems = subStocks.reduce((a, b) => a + b.products.reduce((x, y) => x + y.quantity, 0), 0);
  const totalCapacity = subStocks.reduce((a, b) => a + b.capacity, 0);

  const kpis: KpiItem[] = [
    { label: "Subestoques", value: subStocks.filter((s) => s.status === "Ativo").length, icon: Warehouse },
    { label: "Itens Alocados", value: totalItems, icon: Package },
    { label: "Capacidade Total", value: totalCapacity, icon: MapPin },
    { label: "Ocupação", value: `${Math.round((totalItems / totalCapacity) * 100)}%`, icon: ArrowRightLeft },
  ];

  const handleAdd = () => {
    if (!form.name) return;
    setSubStocks((prev) => [...prev, {
      id: Date.now(),
      name: form.name,
      location: form.location,
      capacity: parseInt(form.capacity) || 50,
      responsible: form.responsible,
      status: "Ativo" as const,
      products: [],
    }]);
    setForm({ name: "", location: "", capacity: "", responsible: "" });
    setDialogOpen(false);
  };

  const handleRemove = (id: number) => setSubStocks((prev) => prev.filter((s) => s.id !== id));

  const filteredStockProducts = useMemo(() => {
    if (!selectedStock) return [];
    if (!productSearch) return selectedStock.products;
    return selectedStock.products.filter((sp) =>
      sp.product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      sp.product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      sp.position.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [selectedStock, productSearch]);

  // Detail view for a selected substock
  if (selectedStock) {
    const stockItemCount = selectedStock.products.reduce((a, b) => a + b.quantity, 0);
    const pct = Math.round((stockItemCount / selectedStock.capacity) * 100);

    return (
      <div className="space-y-6">
        <button onClick={() => { setSelectedStock(null); setProductSearch(""); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar aos subestoques
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">{selectedStock.name}</h1>
            <p className="text-muted-foreground text-sm">{selectedStock.location} • Responsável: {selectedStock.responsible}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${selectedStock.status === "Ativo" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{selectedStock.status}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Produtos Únicos" value={selectedStock.products.length} icon={Package} delay={0} />
          <KpiCard label="Total de Peças" value={stockItemCount} icon={Warehouse} delay={0.05} />
          <KpiCard label="Capacidade" value={selectedStock.capacity} icon={MapPin} delay={0.1} />
          <KpiCard label="Ocupação" value={`${pct}%`} icon={ArrowRightLeft} delay={0.15} />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar produto por nome, SKU ou posição..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
        </div>

        {filteredStockProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">{selectedStock.products.length === 0 ? "Nenhum produto neste subestoque." : "Nenhum produto encontrado na busca."}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Produto</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">SKU</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Categoria</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Posição</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Qtd</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Preço Un.</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStockProducts.map((sp, i) => (
                    <motion.tr key={`${sp.product.id}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{sp.product.image}</span>
                          <span className="text-foreground font-medium">{sp.product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell font-mono text-xs">{sp.product.sku}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{sp.product.category}</td>
                      <td className="py-3 px-4 text-muted-foreground">{sp.position}</td>
                      <td className="py-3 px-4 text-center font-bold text-foreground">{sp.quantity}</td>
                      <td className="py-3 px-4 text-right text-foreground">R$ {sp.product.price.toFixed(2)}</td>
                      <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sp.product.status)}`}>{sp.product.status}</span></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Subestoques</h1>
        <p className="text-muted-foreground text-sm">Gerencie os pontos de armazenamento e distribuição de produtos</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />)}
      </div>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar subestoque..."
        filters={[
          { key: "status", label: "Status", options: ["Todos", "Ativo", "Inativo"], value: statusFilter, onChange: setStatusFilter },
        ]}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Novo Subestoque</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo Subestoque</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Arara A1" /></div>
                <div><Label>Localização</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: Loja - Térreo" /></div>
                <div><Label>Capacidade</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="50" /></div>
                <div><Label>Responsável</Label><Input value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} placeholder="Nome" /></div>
                <Button onClick={handleAdd} className="w-full bg-gradient-primary text-primary-foreground">Criar Subestoque</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sub, i) => {
          const itemCount = sub.products.reduce((a, b) => a + b.quantity, 0);
          const pct = sub.capacity > 0 ? Math.round((itemCount / sub.capacity) * 100) : 0;
          return (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card space-y-3 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
              onClick={() => setSelectedStock(sub)}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground">{sub.location}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${sub.status === "Ativo" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{sub.status}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{itemCount} / {sub.capacity} itens</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary">
                  <div className={`h-full rounded-full transition-all ${pct > 85 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Resp: {sub.responsible} • {sub.products.length} produtos</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <Button size="sm" variant="ghost" className="text-destructive h-7" onClick={(e) => { e.stopPropagation(); handleRemove(sub.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-8">Nenhum subestoque encontrado.</p>}
      </div>
    </div>
  );
};

export default SubestoquesContent;
