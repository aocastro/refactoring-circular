import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Warehouse, Plus, Trash2, Package, MapPin, ArrowRightLeft, ArrowLeft, Search, Eye, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { getStatusColor } from "@/lib/status-colors";
import type { KpiItem } from "@/types";
import api from "@/api/axios";
import { SubStock, SubStockProduct } from "@/data/dashboard";

const SubestoquesContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mockProducts, setmockProducts] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_mockProducts = await api.get('/api/products');
        setMockProducts(res_mockProducts.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;


  const [subStocks, setSubStocks] = useState<SubStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState({ name: "", location: "" });
  const [pendingProducts, setPendingProducts] = useState<SubStockProduct[]>([]);
  const [newProductForm, setNewProductForm] = useState({ productId: "", quantity: "" });

  const [selectedStock, setSelectedStock] = useState<SubStock | null>(null);
  const [productSearch, setProductSearch] = useState("");

  // States for adding/editing product in existing stock
  const [addExistingProductDialogOpen, setAddExistingProductDialogOpen] = useState(false);
  const [editExistingProductDialogOpen, setEditExistingProductDialogOpen] = useState(false);
  const [existingProductForm, setExistingProductForm] = useState({ productId: "", quantity: "" });
  const [editingProduct, setEditingProduct] = useState<SubStockProduct | null>(null);

  useEffect(() => {
    const fetchSubStocks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/subestoques');
        setSubStocks(res.data);
        if (selectedStock) {
          const updated = res.data.find((s: SubStock) => s.id === selectedStock.id);
          if (updated) setSelectedStock(updated);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubStocks();
  }, [selectedStock]);

  const refreshSubStocks = async () => {
    try {
      const res = await api.get('/api/subestoques');
      setSubStocks(res.data);
      if (selectedStock) {
        const updated = res.data.find((s: SubStock) => s.id === selectedStock.id);
        if (updated) setSelectedStock(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    return subStocks.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.location.toLowerCase().includes(search.toLowerCase()) ||
                          s.responsible.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, subStocks]);

  const totalItems = subStocks.reduce((a, b) => a + b.products.reduce((x, y) => x + y.quantity, 0), 0);
  const totalCapacity = subStocks.reduce((a, b) => a + b.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalItems / totalCapacity) * 100) : 0;

  const kpis: KpiItem[] = [
    { label: "Subestoques", value: subStocks.filter((s) => s.status === "Ativo").length, icon: Warehouse },
    { label: "Itens Alocados", value: totalItems, icon: Package },
    { label: "Capacidade Total", value: totalCapacity, icon: MapPin },
    { label: "Ocupação", value: `${occupancyRate}%`, icon: ArrowRightLeft },
  ];

  const handleAddPendingProduct = () => {
    if (!newProductForm.productId || !newProductForm.quantity) return;
    const product = mockProducts.find(p => p.id === newProductForm.productId);
    if (!product) return;

    setPendingProducts([...pendingProducts, {
      product,
      quantity: parseInt(newProductForm.quantity, 10)
    }]);
    setNewProductForm({ productId: "", quantity: "" });
  };

  const handleRemovePendingProduct = (index: number) => {
    setPendingProducts(pendingProducts.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    if (!form.name) return;
    try {
      await api.post('/api/subestoques', {
        name: form.name,
        location: form.location,
        capacity: 0,
        responsible: "",
        products: pendingProducts
      });
      refreshSubStocks();
      setForm({ name: "", location: "" });
      setPendingProducts([]);
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/api/subestoques/${id}`);
      refreshSubStocks();
      if (selectedStock?.id === id) setSelectedStock(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProductToExistingStock = async () => {
    if (!selectedStock || !existingProductForm.productId || !existingProductForm.quantity) return;

    const product = mockProducts.find(p => p.id === existingProductForm.productId);
    if (!product) return;

    try {
      const quantity = parseInt(existingProductForm.quantity, 10);
      const existingProductIndex = selectedStock.products.findIndex(p => p.product.id === product.id);

      const updatedProducts = [...selectedStock.products];

      if (existingProductIndex !== -1) {
        // Update existing product quantity
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: updatedProducts[existingProductIndex].quantity + quantity
        };
      } else {
        // Add new product
        updatedProducts.push({ product, quantity });
      }

      const updatedStock = { ...selectedStock, products: updatedProducts };
      await api.put(`/api/subestoques/${selectedStock.id}`, updatedStock);

      setSelectedStock(updatedStock);
      refreshSubStocks();
      setAddExistingProductDialogOpen(false);
      setExistingProductForm({ productId: "", quantity: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditExistingProduct = async () => {
    if (!selectedStock || !editingProduct || !existingProductForm.quantity) return;

    try {
      const quantity = parseInt(existingProductForm.quantity, 10);
      const updatedProducts = selectedStock.products.map(p =>
        p.product.id === editingProduct.product.id ? { ...p, quantity } : p
      );

      const updatedStock = { ...selectedStock, products: updatedProducts };
      await api.put(`/api/subestoques/${selectedStock.id}`, updatedStock);

      setSelectedStock(updatedStock);
      refreshSubStocks();
      setEditExistingProductDialogOpen(false);
      setEditingProduct(null);
      setExistingProductForm({ productId: "", quantity: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveExistingProduct = async (productId: string) => {
    if (!selectedStock) return;

    try {
      const updatedProducts = selectedStock.products.filter(p => p.product.id !== productId);

      const updatedStock = { ...selectedStock, products: updatedProducts };
      await api.put(`/api/subestoques/${selectedStock.id}`, updatedStock);

      setSelectedStock(updatedStock);
      refreshSubStocks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStockProducts = useMemo(() => {
    if (!selectedStock) return [];
    if (!productSearch) return selectedStock.products;
    return selectedStock.products.filter((sp) =>
      sp.product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      sp.product.sku.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [selectedStock, productSearch]);

  if (selectedStock) {
    const stockItemCount = selectedStock.products.reduce((a, b) => a + b.quantity, 0);
    const pct = selectedStock.capacity > 0 ? Math.round((stockItemCount / selectedStock.capacity) * 100) : 0;

    return (
      <div className="space-y-6">
        <button onClick={() => { setSelectedStock(null); setProductSearch(""); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar aos subestoques
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">{selectedStock.name}</h1>
            <p className="text-muted-foreground text-sm">{selectedStock.location}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${selectedStock.status === "Ativo" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{selectedStock.status}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Produtos Únicos" value={selectedStock.products.length} icon={Package} delay={0} />
          <KpiCard label="Total de Peças" value={stockItemCount} icon={Warehouse} delay={0.05} />
          {selectedStock.capacity > 0 && (
            <>
              <KpiCard label="Capacidade" value={selectedStock.capacity} icon={MapPin} delay={0.1} />
              <KpiCard label="Ocupação" value={`${pct}%`} icon={ArrowRightLeft} delay={0.15} />
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar produto por nome ou SKU..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
          </div>

          <Dialog open={addExistingProductDialogOpen} onOpenChange={setAddExistingProductDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Adicionar Produto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Produto ao Subestoque</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Produto</Label>
                  <Select value={existingProductForm.productId} onValueChange={(v) => setExistingProductForm({ ...existingProductForm, productId: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione um produto" /></SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input type="number" value={existingProductForm.quantity} onChange={(e) => setExistingProductForm({ ...existingProductForm, quantity: e.target.value })} placeholder="Ex: 5" />
                </div>
                <Button onClick={handleAddProductToExistingStock} className="w-full bg-gradient-primary text-primary-foreground">Adicionar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={editExistingProductDialogOpen} onOpenChange={setEditExistingProductDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Quantidade: {editingProduct?.product.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input type="number" value={existingProductForm.quantity} onChange={(e) => setExistingProductForm({ ...existingProductForm, quantity: e.target.value })} placeholder="Ex: 5" />
              </div>
              <Button onClick={handleEditExistingProduct} className="w-full bg-gradient-primary text-primary-foreground">Salvar Alterações</Button>
            </div>
          </DialogContent>
        </Dialog>

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
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Qtd</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Preço Un.</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ações</th>
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
                      <td className="py-3 px-4 text-center font-bold text-foreground">{sp.quantity}</td>
                      <td className="py-3 px-4 text-right text-foreground">R$ {sp.product.price.toFixed(2)}</td>
                      <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sp.product.status)}`}>{sp.product.status}</span></td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => { setEditingProduct(sp); setExistingProductForm({ productId: sp.product.id, quantity: sp.quantity.toString() }); setEditExistingProductDialogOpen(true); }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleRemoveExistingProduct(sp.product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Novo Subestoque</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Arara A1" /></div>
                  <div><Label>Localização</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: Loja - Térreo" /></div>
                </div>

                <div className="pt-4 border-t border-border mt-4">
                  <h3 className="font-semibold text-sm mb-3">Produtos do Subestoque</h3>
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-8">
                      <Label className="text-xs">Produto</Label>
                      <Select value={newProductForm.productId} onValueChange={(v) => setNewProductForm({ ...newProductForm, productId: v })}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Selecione um produto" /></SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Quantidade</Label>
                      <Input className="h-9" type="number" value={newProductForm.quantity} onChange={(e) => setNewProductForm({ ...newProductForm, quantity: e.target.value })} placeholder="Qtd" />
                    </div>
                    <div className="col-span-1">
                      <Button size="icon" variant="secondary" className="h-9 w-full" onClick={handleAddPendingProduct}><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  {pendingProducts.length > 0 && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-secondary/50 border-b border-border">
                          <tr>
                            <th className="py-2 px-3 font-medium">Produto</th>
                            <th className="py-2 px-3 font-medium">Qtd</th>
                            <th className="py-2 px-3 font-medium w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingProducts.map((pp, idx) => (
                            <tr key={idx} className="border-b border-border/50 last:border-0">
                              <td className="py-2 px-3">{pp.product.name}</td>
                              <td className="py-2 px-3">{pp.quantity}</td>
                              <td className="py-2 px-3 text-right">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => handleRemovePendingProduct(idx)}><Trash2 className="h-3 w-3" /></Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <Button onClick={handleAdd} className="w-full mt-6 bg-gradient-primary text-primary-foreground">Criar Subestoque</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
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
                {sub.capacity > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{itemCount} / {sub.capacity} itens</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary">
                      <div className={`h-full rounded-full transition-all ${pct > 85 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{sub.products.length} produtos únicos</span>
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
      )}
    </div>
  );
};

export default SubestoquesContent;
