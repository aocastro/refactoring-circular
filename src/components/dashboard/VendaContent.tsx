import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Package, Eye, Edit, Trash2, ShoppingCart, Tag, PackagePlus, FileSpreadsheet, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KpiCard from "@/components/shared/KpiCard";
import FilterToolbar from "@/components/shared/FilterToolbar";
import { mockProducts, mockPDVSales, productCategories, productStatuses, priceRanges } from "@/data/products";
import { getStatusColor } from "@/lib/status-colors";
import type { KpiItem } from "@/types";

const VendaContent = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [priceFilter, setPriceFilter] = useState("Todos");

  const filtered = useMemo(() => {
    const priceRange = priceRanges.find((p) => p.label === priceFilter) || priceRanges[0];
    return mockProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "Todos" || p.category === categoryFilter;
      const matchStatus = statusFilter === "Todos" || p.status === statusFilter;
      const matchPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      return matchSearch && matchCategory && matchStatus && matchPrice;
    });
  }, [search, categoryFilter, statusFilter, priceFilter]);

  const summaryKpis: KpiItem[] = [
    { label: "Total", value: mockProducts.length, icon: Package },
    { label: "Disponíveis", value: mockProducts.filter((p) => p.status === "Disponível").length, icon: Tag },
    { label: "Reservados", value: mockProducts.filter((p) => p.status === "Reservado").length, icon: Eye },
    { label: "Vendidos", value: mockProducts.filter((p) => p.status === "Vendido").length, icon: ShoppingCart },
  ];

  return (
    <section aria-label="Módulo de vendas" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-foreground">Venda</h2>
        <p className="text-muted-foreground text-sm">Gerencie seus produtos e ponto de venda</p>
      </div>

      <Tabs defaultValue="produtos" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="produtos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="h-4 w-4 mr-2" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="pdv" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingCart className="h-4 w-4 mr-2" />
            PDV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="produtos" className="mt-6 space-y-4">
          <FilterToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome ou SKU..."
            filters={[
              { key: "category", label: "Categoria", options: productCategories, value: categoryFilter, onChange: setCategoryFilter },
              { key: "status", label: "Status", options: productStatuses, value: statusFilter, onChange: setStatusFilter },
              { key: "price", label: "Faixa de Preço", options: priceRanges.map((p) => p.label), value: priceFilter, onChange: setPriceFilter },
            ]}
            actions={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Opções de Cadastro</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <PackagePlus className="mr-2 h-4 w-4" />
                    <span>Cadastro de Produto Único</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Cadastro em Massa</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Camera className="mr-2 h-4 w-4" />
                    <span>Cadastro por Foto</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {summaryKpis.map((kpi, i) => (
              <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />
            ))}
          </div>

          {/* Products table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Produto</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">SKU</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Categoria</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Tamanho</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Preço</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Nenhum produto encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{product.image}</span>
                            <span className="text-foreground font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell font-mono text-xs">{product.sku}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{product.category}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{product.size}</td>
                        <td className="py-3 px-4 text-foreground font-medium">R$ {product.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pdv" className="mt-6 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-sm font-medium text-foreground">PDV Ativo — Brechó da Maria</p>
              <p className="text-xs text-muted-foreground">Última atualização: hoje às 14:35</p>
            </div>
            <div className="ml-auto">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Nova Venda
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Vendas Hoje</p>
              <p className="text-xl font-bold font-display text-foreground">5</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Faturamento Hoje</p>
              <p className="text-xl font-bold font-display text-foreground">R$ 994,80</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground mb-1">Ticket Médio</p>
              <p className="text-xl font-bold font-display text-foreground">R$ 198,96</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Vendas do Dia</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Hora</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Itens</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Total</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Pagamento</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Cliente</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPDVSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-4 text-foreground">{sale.time}</td>
                      <td className="py-3 px-4 text-foreground">{sale.items}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{sale.total}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{sale.payment}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{sale.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default VendaContent;
