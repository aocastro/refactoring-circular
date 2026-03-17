import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Search, AlertTriangle, CheckCircle, XCircle, Plus, ArrowDownUp, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import KpiCard from "@/components/shared/KpiCard";
import { exportToCSV } from "@/lib/export";
import type { KpiItem } from "@/types";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  location: string;
  lastCount: string;
  status: "ok" | "low" | "out";
}

const mockInventory: InventoryItem[] = [
  { id: 1, name: "Vestido Floral Vintage", sku: "VFV-001", category: "Roupas", stock: 1, minStock: 1, location: "Arara A1", lastCount: "10/03/2026", status: "ok" },
  { id: 2, name: "Jaqueta Jeans Upcycled", sku: "JJU-002", category: "Roupas", stock: 1, minStock: 1, location: "Arara A2", lastCount: "10/03/2026", status: "ok" },
  { id: 3, name: "Bolsa de Couro Retrô", sku: "BCR-003", category: "Bolsas", stock: 1, minStock: 1, location: "Prateleira B1", lastCount: "09/03/2026", status: "ok" },
  { id: 4, name: "Tênis Vintage Adidas", sku: "TVA-004", category: "Calçados", stock: 0, minStock: 1, location: "Prateleira C1", lastCount: "09/03/2026", status: "out" },
  { id: 5, name: "Colar Artesanal Boho", sku: "CAB-005", category: "Acessórios", stock: 3, minStock: 2, location: "Vitrine D1", lastCount: "10/03/2026", status: "ok" },
  { id: 6, name: "Camisa Hawaiana 90s", sku: "CH9-006", category: "Roupas", stock: 1, minStock: 1, location: "Arara A3", lastCount: "08/03/2026", status: "ok" },
  { id: 7, name: "Saia Midi Plissada", sku: "SMP-007", category: "Roupas", stock: 1, minStock: 1, location: "Arara A4", lastCount: "08/03/2026", status: "ok" },
  { id: 8, name: "Óculos Retrô Ray-Ban", sku: "ORR-008", category: "Acessórios", stock: 1, minStock: 1, location: "Vitrine D2", lastCount: "10/03/2026", status: "ok" },
  { id: 9, name: "Casaco de Pele Sintética", sku: "CPS-009", category: "Roupas", stock: 0, minStock: 1, location: "Arara B1", lastCount: "07/03/2026", status: "out" },
  { id: 10, name: "Boné Vintage Nike", sku: "BVN-010", category: "Acessórios", stock: 1, minStock: 2, location: "Prateleira D3", lastCount: "06/03/2026", status: "low" },
  { id: 11, name: "Calça Cargo Militar", sku: "CCM-011", category: "Roupas", stock: 1, minStock: 2, location: "Arara A5", lastCount: "05/03/2026", status: "low" },
  { id: 12, name: "Sandália Plataforma", sku: "SP-012", category: "Calçados", stock: 0, minStock: 1, location: "Prateleira C2", lastCount: "04/03/2026", status: "out" },
];

const categories = ["Todos", "Roupas", "Acessórios", "Calçados", "Bolsas"];
const statusOptions = ["Todos", "Em estoque", "Estoque baixo", "Sem estoque"];

const statusMap: Record<string, InventoryItem["status"]> = {
  "Em estoque": "ok",
  "Estoque baixo": "low",
  "Sem estoque": "out",
};

const InventarioContent = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filtered = useMemo(() => {
    return mockInventory.filter((item) => {
      const matchSearch =
        search === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "Todos" || item.category === categoryFilter;
      const matchStatus = statusFilter === "Todos" || item.status === statusMap[statusFilter];
      return matchSearch && matchCategory && matchStatus;
    });
  }, [search, categoryFilter, statusFilter]);

  const totalItems = mockInventory.reduce((a, i) => a + i.stock, 0);
  const lowStock = mockInventory.filter((i) => i.status === "low").length;
  const outOfStock = mockInventory.filter((i) => i.status === "out").length;

  const kpis: KpiItem[] = [
    { label: "Total de Peças", value: totalItems, icon: Package },
    { label: "SKUs Cadastrados", value: mockInventory.length, icon: ArrowDownUp },
    { label: "Estoque Baixo", value: lowStock, icon: AlertTriangle, positive: false, change: `${lowStock} itens` },
    { label: "Sem Estoque", value: outOfStock, icon: XCircle, positive: false, change: `${outOfStock} itens` },
  ];

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "ok":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-success/10 text-success">
            <CheckCircle className="h-3 w-3" /> Em estoque
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
            <AlertTriangle className="h-3 w-3" /> Baixo
          </span>
        );
      case "out":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">
            <XCircle className="h-3 w-3" /> Esgotado
          </span>
        );
    }
  };

  return (
    <section className="space-y-6" aria-labelledby="inventario-section-title" aria-describedby="inventario-section-description">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 id="inventario-section-title" className="text-2xl font-bold font-display text-foreground">Inventário</h2>
          <p id="inventario-section-description" className="text-muted-foreground text-sm">Controle de estoque, filtros de busca e alertas de contagem com estrutura semântica e navegação por teclado.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border"
            onClick={() => {
              exportToCSV(
                mockInventory.map((i) => ({
                  Nome: i.name,
                  SKU: i.sku,
                  Categoria: i.category,
                  Estoque: i.stock,
                  "Mín.": i.minStock,
                  Local: i.location,
                  "Última Contagem": i.lastCount,
                  Status: i.status === "ok" ? "Em estoque" : i.status === "low" ? "Estoque baixo" : "Sem estoque",
                })),
                "inventario"
              );
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nova Contagem
          </Button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px] bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Produto</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">SKU</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Categoria</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Estoque</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Mín.</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Local</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Contagem</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Nenhum item encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs hidden md:table-cell">{item.sku}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{item.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${item.stock === 0 ? "text-destructive" : item.stock <= item.minStock ? "text-accent" : "text-foreground"}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-muted-foreground hidden lg:table-cell">{item.minStock}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{item.location}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">{item.lastCount}</td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      {(lowStock > 0 || outOfStock > 0) && (
        <div className="p-4 rounded-xl border border-accent/30 bg-accent/5">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            Alertas de Estoque
          </h3>
          <div className="space-y-1.5">
            {mockInventory
              .filter((i) => i.status !== "ok")
              .map((item) => (
                <p key={item.id} className="text-xs text-muted-foreground">
                  <span className={item.status === "out" ? "text-destructive" : "text-accent"}>●</span>{" "}
                  <strong className="text-foreground">{item.name}</strong> ({item.sku}) —{" "}
                  {item.status === "out" ? "Sem estoque" : `Estoque baixo (${item.stock}/${item.minStock})`}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioContent;
