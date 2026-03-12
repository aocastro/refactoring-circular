import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Tag, Ruler, Star, ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockProducts } from "@/data/products";
import { getStatusColor } from "@/lib/status-colors";

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg mt-20">Produto não encontrado.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/catalogo">Voltar ao catálogo</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const related = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === "Disponível")
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-square rounded-2xl bg-card border border-border flex items-center justify-center text-8xl"
            >
              {product.image}
            </motion.div>

            {/* Info */}
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
                Peça selecionada e curada com carinho. Cada item do nosso catálogo passa por
                avaliação de qualidade para garantir a melhor experiência de moda circular.
              </p>

              <div className="flex gap-3 mt-2">
                {product.status === "Disponível" ? (
                  <>
                    <Button className="flex-1 bg-gradient-primary text-primary-foreground">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Reservar
                    </Button>
                    <Button variant="outline" className="border-border">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Perguntar
                    </Button>
                  </>
                ) : (
                  <Button disabled className="flex-1">
                    {product.status === "Reservado" ? "Reservado" : "Vendido"}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-lg font-semibold font-display text-foreground mb-4">
                Peças semelhantes
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/catalogo/${p.id}`}
                    className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-elevated transition-all"
                  >
                    <div className="aspect-square bg-secondary/50 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                      {p.image}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {p.name}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        R$ {p.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProdutoDetalhe;
