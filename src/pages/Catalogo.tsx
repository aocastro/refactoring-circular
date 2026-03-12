import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockProducts, productCategories, priceRanges } from "@/data/products";
import { getStatusColor } from "@/lib/status-colors";
import type { Product } from "@/types";

const conditions = ["Todos", "Novo", "Excelente", "Bom", "Regular"];
const sizes = ["Todos", ...Array.from(new Set(mockProducts.map((p) => p.size)))];

const ProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.04 }}
  >
    <Link
      to={`/catalogo/${product.id}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-elevated transition-all duration-300"
    >
      <div className="aspect-square bg-secondary/50 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
        {product.image}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(product.status)}`}>
            {product.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{product.category}</span>
          <span>•</span>
          <span>{product.condition}</span>
          <span>•</span>
          <span>Tam. {product.size}</span>
        </div>
        <p className="text-lg font-bold font-display text-foreground">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </Link>
  </motion.div>
);

const Catalogo = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [condition, setCondition] = useState("Todos");
  const [size, setSize] = useState("Todos");
  const [priceRange, setPriceRange] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = [category, condition, size, priceRange].filter((f) => f !== "Todos").length;

  const filtered = useMemo(() => {
    const range = priceRanges.find((p) => p.label === priceRange) || priceRanges[0];
    return mockProducts
      .filter((p) => p.status === "Disponível")
      .filter((p) => {
        const matchSearch =
          search === "" ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category === "Todos" || p.category === category;
        const matchCondition = condition === "Todos" || p.condition === condition;
        const matchSize = size === "Todos" || p.size === size;
        const matchPrice = p.price >= range.min && p.price <= range.max;
        return matchSearch && matchCategory && matchCondition && matchSize && matchPrice;
      });
  }, [search, category, condition, size, priceRange]);

  const clearFilters = () => {
    setCategory("Todos");
    setCondition("Todos");
    setSize("Todos");
    setPriceRange("Todos");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-2"
            >
              Catálogo
            </motion.h1>
            <p className="text-muted-foreground">
              Peças únicas com história — encontre a sua
            </p>
          </div>

          {/* Search + Filter toggle */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar peças..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button
              variant="outline"
              className="border-border shrink-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {activeFilters > 0 && (
                <span className="ml-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </Button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">Filtros</h4>
                {activeFilters > 0 && (
                  <button onClick={clearFilters} className="text-xs text-accent hover:underline flex items-center gap-1">
                    <X className="h-3 w-3" /> Limpar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Categoria", value: category, onChange: setCategory, options: productCategories },
                  { label: "Condição", value: condition, onChange: setCondition, options: conditions },
                  { label: "Tamanho", value: size, onChange: setSize, options: sizes },
                  { label: "Faixa de Preço", value: priceRange, onChange: setPriceRange, options: priceRanges.map((p) => p.label) },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {f.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "peça encontrada" : "peças encontradas"}
          </p>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma peça encontrada com esses filtros.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalogo;
