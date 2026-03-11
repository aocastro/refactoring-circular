import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Package,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockProducts = [
  { id: 1, name: "Vestido Floral Vintage", sku: "VFV-001", category: "Roupas", size: "M", condition: "Excelente", price: 89.9, status: "Disponível", image: "👗" },
  { id: 2, name: "Jaqueta Jeans Upcycled", sku: "JJU-002", category: "Roupas", size: "G", condition: "Bom", price: 159.0, status: "Disponível", image: "🧥" },
  { id: 3, name: "Bolsa de Couro Retrô", sku: "BCR-003", category: "Bolsas", size: "Único", condition: "Excelente", price: 210.0, status: "Reservado", image: "👜" },
  { id: 4, name: "Tênis Vintage Adidas", sku: "TVA-004", category: "Calçados", size: "40", condition: "Bom", price: 120.0, status: "Vendido", image: "👟" },
  { id: 5, name: "Colar Artesanal Boho", sku: "CAB-005", category: "Acessórios", size: "Único", condition: "Novo", price: 45.0, status: "Disponível", image: "📿" },
  { id: 6, name: "Camisa Hawaiana 90s", sku: "CH9-006", category: "Roupas", size: "GG", condition: "Bom", price: 65.0, status: "Disponível", image: "👔" },
  { id: 7, name: "Saia Midi Plissada", sku: "SMP-007", category: "Roupas", size: "P", condition: "Excelente", price: 78.0, status: "Disponível", image: "👗" },
  { id: 8, name: "Óculos Retrô Ray-Ban", sku: "ORR-008", category: "Acessórios", size: "Único", condition: "Excelente", price: 195.0, status: "Reservado", image: "🕶️" },
];

const mockPDVSales = [
  { id: 1, time: "14:30", items: 2, total: "R$ 248,90", payment: "PIX", customer: "Cliente avulso" },
  { id: 2, time: "13:15", items: 1, total: "R$ 159,00", payment: "Cartão Crédito", customer: "Ana Paula" },
  { id: 3, time: "11:45", items: 3, total: "R$ 312,00", payment: "Dinheiro", customer: "Cliente avulso" },
  { id: 4, time: "10:20", items: 1, total: "R$ 89,90", payment: "Cartão Débito", customer: "Fernanda S." },
  { id: 5, time: "09:05", items: 2, total: "R$ 185,00", payment: "PIX", customer: "Juliana M." },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Disponível": return "bg-success/10 text-success";
    case "Reservado": return "bg-accent/10 text-accent";
    case "Vendido": return "bg-muted text-muted-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const VendaContent = () => {
  const [search, setSearch] = useState("");
  const filtered = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Venda</h1>
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
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: mockProducts.length, icon: Package },
              { label: "Disponíveis", value: mockProducts.filter(p => p.status === "Disponível").length, icon: Tag },
              { label: "Reservados", value: mockProducts.filter(p => p.status === "Reservado").length, icon: Eye },
              { label: "Vendidos", value: mockProducts.filter(p => p.status === "Vendido").length, icon: ShoppingCart },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl border border-border bg-card"
              >
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className="text-xl font-bold font-display text-foreground">{s.value}</p>
              </motion.div>
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
                  {filtered.map((product) => (
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
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(product.status)}`}>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pdv" className="mt-6 space-y-4">
          {/* PDV Status */}
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

          {/* Today's summary */}
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

          {/* Recent PDV sales */}
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
    </div>
  );
};

export default VendaContent;
