import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const formatPrice = (p: number) => `R$ ${p.toFixed(2).replace(".", ",")}`;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Carrinho ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 p-3 rounded-lg border border-border bg-secondary/30">
                  <div className="w-16 h-16 rounded-lg bg-card border border-border flex items-center justify-center text-2xl shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                    {item.size && <p className="text-xs text-muted-foreground">Tam: {item.size}</p>}
                    <p className="text-sm font-bold text-foreground mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-medium text-foreground w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto text-destructive hover:text-destructive/80">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-success text-xs">A calcular</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-3">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <Button className="w-full bg-gradient-primary text-primary-foreground py-5 rounded-xl">
                Finalizar Compra
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={clearCart}>
                Limpar carrinho
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
