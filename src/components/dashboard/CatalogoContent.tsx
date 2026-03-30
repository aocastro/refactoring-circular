import api from "@/api/axios";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ShoppingBag, Plus, Eye, Edit, Trash2, Tag, Ruler, Star, ShoppingCart, MessageCircle, ArrowLeft, PackagePlus, FileSpreadsheet, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCategories, priceRanges } from "@/data/products";
import { getStatusColor } from "@/lib/status-colors";
import type { Product } from "@/types";
import { ProductFormModal } from "./modals/ProductFormModal";
import { BulkUploadModal } from "./modals/BulkUploadModal";
import { PhotoUploadModal } from "./modals/PhotoUploadModal";

const conditions = ["Todos", "Novo", "Excelente", "Bom", "Regular"];

const ProductCard = ({ product, index, onSelect }: { product: Product; index: number; onSelect: (p: Product) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.04 }}
  >
    <button
      onClick={() => onSelect(product)}
      className="group block w-full text-left rounded-xl border border-border bg-card overflow-hidden hover:shadow-elevated transition-all duration-300"
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
    </button>
  </motion.div>
);

const ProductDetail = ({ product, onBack, mockProducts }: { product: Product; onBack: () => void; mockProducts: any[] }) => {
  const related = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === "Disponível")
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-2xl bg-card border border-border flex items-center justify-center text-8xl"
        >
          {product.image}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div>
            <span className={`inline-block text-xs px-2.5 py-1 rounded-full mb-3 ${getStatusColor(product.status)}`}>
              {product.status}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">SKU: {product.sku}</p>
          </div>

          <p className="text-3xl font-bold font-display text-foreground">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Tag, label: "Categoria", value: product.category },
              { icon: Star, label: "Condição", value: product.condition },
              { icon: Ruler, label: "Tamanho", value: product.size },
            ].map((attr) => (
              <div key={attr.label} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
                <attr.icon className="h-4 w-4 text-accent shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">{attr.label}</p>
                  <p className="text-sm font-medium text-foreground">{attr.value}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Peça selecionada e curada com carinho. Cada item do catálogo passa por
            avaliação de qualidade para garantir a melhor experiência de moda circular.
          </p>

          <div className="flex gap-3 mt-2">
            <Button size="sm" variant="outline" className="border-border">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button size="sm" variant="outline" className="border-border text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remover
            </Button>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-foreground mb-3">Peças da mesma categoria</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((p) => (
              <button
                key={p.id}
                onClick={() => onBack()}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-elevated transition-all text-left"
              >
                <div className="aspect-square bg-secondary/50 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                  {p.image}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-foreground line-clamp-1">{p.name}</p>
                  <p className="text-sm font-bold text-foreground">R$ {p.price.toFixed(2).replace(".", ",")}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CatalogoContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mockProducts, setMockProducts] = useState<any[]>([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);



  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [condition, setCondition] = useState("Todos");
  const [size, setSize] = useState("Todos");
  const [priceRange, setPriceRange] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const sizes: string[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ["Todos", ...Array.from(new Set(mockProducts.map((p: any) => String(p.size))))];
  }, [mockProducts]);

  const activeFilters = [category, condition, size, priceRange].filter((f) => f !== "Todos").length;

  const filtered = useMemo(() => {
    const range = priceRanges.find((p) => p.label === priceRange) || priceRanges[0];
    return mockProducts.filter((p) => {
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
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

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} mockProducts={mockProducts} />;
  }



  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Catálogo</h1>
          <p className="text-muted-foreground text-sm">Gerencie o catálogo da sua loja</p>
        </div>
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => setIsProductModalOpen(true)}>
              <PackagePlus className="mr-2 h-4 w-4" />
              <span>Cadastro de Produto Único</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setIsBulkModalOpen(true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <span>Cadastro em Massa</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
              <Camera className="mr-2 h-4 w-4" />
              <span>Cadastro por Foto</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, SKU ou categoria..."
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

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Filtros Avançados</h4>
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

      <p className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhum produto encontrado.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onSelect={setSelectedProduct} />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        onSuccess={fetchData}
      />
      <BulkUploadModal
        open={isBulkModalOpen}
        onOpenChange={setIsBulkModalOpen}
        onSuccess={fetchData}
      />
      <PhotoUploadModal
        open={isPhotoModalOpen}
        onOpenChange={setIsPhotoModalOpen}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default CatalogoContent;
