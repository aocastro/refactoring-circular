import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Leaf, Recycle, TreePine, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockStore, storeProducts } from "@/data/store";
import { useCart } from "@/hooks/use-cart";
import CartDrawer from "@/components/store/CartDrawer";
import { getTemplateTheme, type TemplateTheme } from "@/lib/template-themes";

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

  const theme: TemplateTheme | null = getTemplateTheme(savedConfig?.template);

  // Load Google Font for the active theme
  useEffect(() => {
    if (!theme?.fontUrl) return;
    const id = `store-font-${theme.id}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = theme.fontUrl;
    document.head.appendChild(link);
  }, [theme]);

  const store = savedConfig
    ? {
        ...mockStore,
        slug: savedConfig.slug,
        name: savedConfig.nome,
        description: `Template: ${savedConfig.templateName || "Padrão"}`,
        logo: theme?.logo || mockStore.logo,
      }
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

  // Theme-aware classes with fallbacks
  const t = theme ?? {
    cssVars: {},
    rootClass: "",
    headerClass: "bg-card/95 border-border",
    pillActiveClass: "bg-primary text-primary-foreground",
    pillClass: "bg-secondary text-muted-foreground hover:text-foreground",
    cardClass: "border-border bg-card rounded-xl hover:shadow-elevated",
    headingClass: "",
    bannerClass: "rounded-2xl",
    footerClass: "border-border",
    logo: undefined,
  };

  const ProductCard = ({ product }: { product: typeof storeProducts[0] }) => (
    <Link
      to={`/loja/${slug}/p/${product.id}`}
      className={`group block overflow-hidden border transition-all duration-300 ${t.cardClass}`}
    >
      <div className="aspect-square flex items-center justify-center text-5xl relative group-hover:scale-[1.02] transition-transform"
        style={{ backgroundColor: theme ? "var(--store-card)" : undefined }}
      >
        {product.image}
        {product.discount && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={theme ? { backgroundColor: "var(--store-accent)", color: "var(--store-accent-fg)" } : undefined}
          >
            {product.discount}% OFF
          </span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-xs opacity-60 line-clamp-1">Peça Única</p>
        <h3 className="text-sm font-medium line-clamp-2 transition-colors leading-tight"
          style={theme ? { fontFamily: "var(--store-font-body)" } : undefined}
        >
          {product.name}
        </h3>
        <div className="pt-1">
          {product.originalPrice && (
            <p className="text-xs opacity-50 line-through">
              De: {formatPrice(product.originalPrice)}
            </p>
          )}
          <p className="text-base font-bold"
            style={theme ? { fontFamily: "var(--store-font-display)" } : undefined}
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div
      className={`min-h-screen ${theme ? t.rootClass : "bg-background"}`}
      style={theme ? { ...t.cssVars as React.CSSProperties, backgroundColor: "var(--store-bg)", fontFamily: "var(--store-font-body)" } : undefined}
    >
      {/* Store Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-sm ${t.headerClass}`}>
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{store.logo}</span>
            <span className="font-bold text-lg"
              style={theme ? { fontFamily: "var(--store-font-display)" } : undefined}
            >
              {store.name}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
              <Input
                placeholder="Buscar na loja..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
                style={theme ? {
                  backgroundColor: "var(--store-card)",
                  borderColor: "var(--store-border)",
                  color: "var(--store-text)",
                  fontFamily: "var(--store-font-body)",
                } : undefined}
              />
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-lg transition-colors hover:opacity-80"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center"
                  style={theme ? { backgroundColor: "var(--store-accent)", color: "var(--store-accent-fg)" } : undefined}
                >
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
                activeCategory === cat ? t.pillActiveClass : t.pillClass
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Template indicator */}
      {savedConfig && (
        <div className="border-b py-2" style={theme ? { borderColor: "var(--store-border)", backgroundColor: theme ? "var(--store-card)" : undefined } : undefined}>
          <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
            <p className="text-xs opacity-60">
              🎨 Template: <span className="font-semibold opacity-100">{savedConfig.templateName || "Padrão"}</span>
              {" · "}Plano: <span className="font-semibold opacity-100">{savedConfig.planName}</span>
            </p>
          </div>
        </div>
      )}

      <main>
        {/* Banner Carousel */}
        {activeCategory === "Todos" && search === "" && (
          <>
            <section className="relative w-full overflow-hidden" style={theme ? { backgroundColor: "var(--store-bg)" } : undefined}>
              <div className="container max-w-6xl mx-auto px-4 py-4">
                <div className={`relative overflow-hidden aspect-[3/1] border ${t.bannerClass}`}
                  style={theme ? { borderColor: "var(--store-border)", backgroundColor: "var(--store-card)" } : undefined}
                >
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={theme ? { backgroundColor: "var(--store-bg)", color: "var(--store-text)" } : undefined}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={theme ? { backgroundColor: "var(--store-bg)", color: "var(--store-text)" } : undefined}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {store.banners.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setBannerIndex(i)}
                        className="w-2 h-2 rounded-full transition-colors"
                        style={theme ? {
                          backgroundColor: i === bannerIndex ? "var(--store-accent)" : "var(--store-muted)",
                        } : undefined}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* New Arrivals */}
            <section className="container max-w-6xl mx-auto px-4 py-8">
              <h2 className={`text-xl font-bold mb-4 ${t.headingClass}`}
                style={theme ? { fontFamily: "var(--store-font-display)" } : undefined}
              >
                Lançamentos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {newArrivals.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            {/* Featured */}
            <section className="container max-w-6xl mx-auto px-4 py-8">
              <h2 className={`text-xl font-bold mb-4 ${t.headingClass}`}
                style={theme ? { fontFamily: "var(--store-font-display)" } : undefined}
              >
                Produtos em Destaque
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            {/* ESG Impact */}
            <section className="container max-w-6xl mx-auto px-4 py-8">
              <h2 className={`text-xl font-bold mb-4 ${t.headingClass}`}
                style={theme ? { fontFamily: "var(--store-font-display)" } : undefined}
              >
                Nosso Impacto
              </h2>
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
                    className="p-4 rounded-xl border text-center"
                    style={theme ? {
                      borderColor: "var(--store-border)",
                      backgroundColor: "var(--store-card)",
                    } : undefined}
                  >
                    <item.icon className="h-6 w-6 mx-auto mb-2" style={theme ? { color: "var(--store-accent)" } : undefined} />
                    <p className="text-lg font-bold" style={theme ? { fontFamily: "var(--store-font-display)" } : undefined}>
                      {item.value}
                    </p>
                    <p className="text-xs opacity-60">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Filtered view */}
        {(activeCategory !== "Todos" || search !== "") && (
          <section className="container max-w-6xl mx-auto px-4 py-8">
            <p className="text-sm opacity-60 mb-4">
              {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="opacity-60">Nenhum produto encontrado.</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 ${t.footerClass}`}>
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs opacity-60">
            Loja powered by <span className="font-medium" style={theme ? { color: "var(--store-accent)" } : undefined}>Circular u-Shar</span>
          </p>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
};

export default Loja;
