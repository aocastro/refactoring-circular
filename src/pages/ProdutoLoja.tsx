import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, Recycle, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockStore, storeProducts } from "@/data/store";
import { useCart } from "@/hooks/use-cart";
import CartDrawer from "@/components/store/CartDrawer";
import { useToast } from "@/hooks/use-toast";

const ProdutoLoja = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const product = storeProducts.find((p) => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addItem, totalItems, setIsOpen } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">Produto não encontrado</p>
          <Button asChild variant="outline">
            <Link to={`/loja/${slug}`}>Voltar à loja</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Mock gallery with same emoji repeated as different "angles"
  const gallery = [product.image, product.image, product.image];

  // Available sizes based on category
  const availableSizes = product.category === "Calçados"
    ? ["36", "37", "38", "39", "40", "41", "42", "43"]
    : product.category === "Acessórios"
    ? ["Único"]
    : ["PP", "P", "M", "G", "GG"];

  const related = storeProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace(".", ",")}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to={`/loja/${slug}`} className="flex items-center gap-3">
            <span className="text-2xl">{mockStore.logo}</span>
            <span className="font-display font-bold text-foreground text-lg">{mockStore.name}</span>
          </Link>
          <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-2xl bg-card border border-border flex items-center justify-center text-[120px] overflow-hidden"
            >
              {gallery[activeImageIndex]}
            </motion.div>
            <div className="flex gap-2">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-20 h-20 rounded-lg border flex items-center justify-center text-3xl transition-all ${
                    i === activeImageIndex
                      ? "border-primary ring-2 ring-primary/30 bg-card"
                      : "border-border bg-secondary/30 hover:border-primary/50"
                  }`}
                >
                  {img}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {/* Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent">Peça Única</span>
              {product.discount && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-bold">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div>
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  De: {formatPrice(product.originalPrice)}
                </p>
              )}
              <p className="text-3xl font-bold font-display text-foreground">
                {formatPrice(product.price)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ou 3x de {formatPrice(product.price / 3)} sem juros
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              Peça selecionada e curada com carinho. Condição: <strong className="text-foreground">{product.condition}</strong>.
              Categoria: {product.category}. SKU: {product.sku}.
            </p>

            {/* Size selector */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Tamanho</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-10 px-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : size === product.size
                        ? "border-accent text-accent hover:bg-accent/10"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {product.size && (
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Tamanho disponível: <span className="text-accent font-medium">{product.size}</span>
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Quantidade</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-foreground font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-gradient-primary text-primary-foreground py-6 rounded-xl text-base"
                onClick={() => {
                  addItem({ id: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize || product.size }, quantity);
                  toast({ title: "Adicionado ao carrinho!", description: `${product.name} × ${quantity}` });
                }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 border-border rounded-xl">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 border-border rounded-xl">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              {[
                { icon: Truck, label: "Envio para todo Brasil" },
                { icon: Shield, label: "Garantia de qualidade" },
                { icon: Recycle, label: "Moda circular" },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <badge.icon className="h-5 w-5 text-accent mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground leading-tight">{badge.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-lg font-bold font-display text-foreground mb-4">
              Produtos Semelhantes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/loja/${slug}/p/${p.id}`}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-elevated transition-all"
                >
                  <div className="aspect-square bg-secondary/30 flex items-center justify-center text-4xl relative group-hover:scale-[1.02] transition-transform">
                    {p.image}
                    {p.discount && (
                      <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {p.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {p.name}
                    </p>
                    <p className="text-sm font-bold text-foreground mt-1">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border py-6 mt-8">
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

export default ProdutoLoja;
