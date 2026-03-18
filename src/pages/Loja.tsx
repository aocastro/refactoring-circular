import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Leaf, Recycle, TreePine, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockStore, storeProducts } from "@/data/store";
import { useCart } from "@/hooks/use-cart";
import CartDrawer from "@/components/store/CartDrawer";

const Loja = () => {
  const { slug } = useParams();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [bannerIndex, setBannerIndex] = useState(0);
  const { totalItems, setIsOpen } = useCart();

  // Load store config from localStorage if slug matches the user's store
  const savedConfig = (() => {
    try {
      const config = JSON.parse(localStorage.getItem("storeConfig") || "{}");
      if (config.slug === slug) return config;
    } catch {}
    return null;
  })();

  const store = savedConfig
    ? { ...mockStore, slug: savedConfig.slug, name: savedConfig.nome, description: `Template: ${savedConfig.templateName || "Padrão"}` }
    : mockStore;

  const newArrivals = storeProducts.slice(0, 10);
  const featured = storeProducts.filter((p) => p.highlight);

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((p) => {
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "Todos" || p.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  const nextBanner = () => setBannerIndex((i) => (i + 1) % store.banners.length);
  const prevBanner = () => setBannerIndex((i) => (i - 1 + store.banners.length) % store.banners.length);

  const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace(".", ",")}`;

  const ProductCard = ({ product }: { product: typeof storeProducts[0] }) => (
    <Link
      to={`/loja/${slug}/p/${product.id}`}
      className="group block rounded-xl overflow-hidden border border-border bg-card hover:shadow-elevated transition-all duration-300"
    >
      <div className="aspect-square bg-secondary/30 flex items-center justify-center text-5xl relative group-hover:scale-[1.02] transition-transform">
        {product.image}
        {product.discount && (
          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.discount}% OFF
          </span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-xs text-muted-foreground line-clamp-1">Peça Única</p>
        <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {product.name}
        </h3>
        <div className="pt-1">
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              De: {formatPrice(product.originalPrice)}
            </p>
          )}
          <p className="text-base font-bold font-display text-foreground">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Store Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{store.logo}</span>
            <span className="font-display font-bold text-foreground text-lg">{store.name}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar na loja..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-secondary border-border text-sm"
              />
            </div>
            <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Categories bar */}
        <div className="container max-w-6xl mx-auto px-4 flex gap-1 pb-2 overflow-x-auto scrollbar-none">
          {["Todos", ...store.categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main>
        {/* Banner Carousel */}
        {activeCategory === "Todos" && search === "" && (
          <>
            <section className="relative w-full overflow-hidden bg-secondary/20">
              <div className="container max-w-6xl mx-auto px-4 py-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/1] bg-card border border-border">
                  {store.banners.map((banner, i) => (
                    <motion.img
                      key={i}
                      src={banner}
                      alt={`Banner ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={false}
                      animate={{ opacity: i === bannerIndex ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                  <button
                    onClick={prevBanner}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {store.banners.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setBannerIndex(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === bannerIndex ? "bg-primary" : "bg-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* New Arrivals */}
            <section className="container max-w-6xl mx-auto px-4 py-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-4">Lançamentos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {newArrivals.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            {/* Featured */}
            <section className="container max-w-6xl mx-auto px-4 py-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-4">Produtos em Destaque</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            {/* ESG Impact */}
            <section className="container max-w-6xl mx-auto px-4 py-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-4">Nosso Impacto</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Leaf, value: "76 kg", label: "CO₂ Evitado" },
                  { icon: Recycle, value: "120 kg", label: "Resíduos Evitados" },
                  { icon: TreePine, value: "45 kg", label: "Recursos Não Extraídos" },
                  { icon: Package, value: "102", label: "Produtos Disponibilizados" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-4 rounded-xl border border-border bg-card text-center"
                  >
                    <item.icon className="h-6 w-6 text-success mx-auto mb-2" />
                    <p className="text-lg font-bold font-display text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Filtered view (when category or search is active) */}
        {(activeCategory !== "Todos" || search !== "") && (
          <section className="container max-w-6xl mx-auto px-4 py-8">
            <p className="text-sm text-muted-foreground mb-4">
              {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Nenhum produto encontrado.</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Loja powered by <span className="text-accent font-medium">Circular u-Shar</span>
          </p>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
};

export default Loja;
