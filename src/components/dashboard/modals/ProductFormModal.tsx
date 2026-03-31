import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCategories } from "@/data/products";
import api from "@/api/axios";
import { toast } from "sonner";
import type { Product } from "@/types";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProductFormModal({ open, onOpenChange, onSuccess }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Partial<Product> & Record<string, any>>({
    name: "",
    sku: "",
    internalCode: "",
    price: 0,
    costPrice: 0,
    margin: 0,
    category: "Roupas",
    subcategory: "",
    size: "Único",
    color: "",
    condition: "Novo",
    gender: "Unissex",
    ageGroup: "Todas as Idades",
    stock: 1,
    supplier: "",
    brand: "",
    image: "📦",
    status: "Disponível",
    description: "",
    hasVariations: "0",
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
    deliveryMode: "0",
    pickup: "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numberFields = ["price", "stock", "costPrice", "margin", "weight", "width", "height", "length"];
    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/products", formData);
      toast.success("Produto cadastrado com sucesso!");
      onSuccess();
      onOpenChange(false);
      // Reset form
      setFormData({
        name: "",
        sku: "",
        internalCode: "",
        price: 0,
        costPrice: 0,
        margin: 0,
        category: "Roupas",
        subcategory: "",
        size: "Único",
        color: "",
        condition: "Novo",
        gender: "Unissex",
        ageGroup: "Todas as Idades",
        stock: 1,
        supplier: "",
        brand: "",
        image: "📦",
        status: "Disponível",
        description: "",
        hasVariations: "0",
        weight: 0,
        width: 0,
        height: 0,
        length: 0,
        deliveryMode: "0",
        pickup: "0",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-background border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Cadastro de Produto Único</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do novo produto de forma contínua.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8 py-4">

          {/* Section 1: Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">1. Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Condição *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(v) => handleSelectChange("condition", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Novo", "Excelente", "Bom", "Regular"].map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {cond}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">Código (SKU) *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internalCode">Código Interno</Label>
                <Input
                  id="internalCode"
                  name="internalCode"
                  value={formData.internalCode}
                  onChange={handleChange}
                  placeholder="Para controle interno"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Categorização */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">2. Categorização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria Principal *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleSelectChange("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.filter((c) => c !== "Todos").map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategoria</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Informações do Produto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">3. Detalhes e Variações</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Gênero *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => handleSelectChange("gender", v)}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Unissex">Unissex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Faixa Etária *</Label>
                <Select
                  value={formData.ageGroup}
                  onValueChange={(v) => handleSelectChange("ageGroup", v)}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas as Idades">Todas as Idades</SelectItem>
                    <SelectItem value="Infantil">Infantil</SelectItem>
                    <SelectItem value="Adulto">Adulto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Possui Variações?</Label>
                <Select
                  value={formData.hasVariations}
                  onValueChange={(v) => handleSelectChange("hasVariations", v)}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Não</SelectItem>
                    <SelectItem value="1">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.hasVariations === "0" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/20">
                <div className="space-y-2">
                  <Label>Cor</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(v) => handleSelectChange("color", v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione a cor" /></SelectTrigger>
                    <SelectContent>
                      {["Preto", "Branco", "Cinza", "Azul", "Vermelho", "Verde", "Amarelo"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tamanho</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(v) => handleSelectChange("size", v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {["Único", "PP", "P", "M", "G", "GG", "34", "36", "38", "40", "42", "44"].map((sz) => (
                        <SelectItem key={sz} value={sz}>{sz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Mídia e Descrição */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">4. Mídia e Descrição</h3>
            <div className="space-y-2">
              <Label htmlFor="image">Ícone/Emoji representativo</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="max-w-[100px]"
              />
              <p className="text-xs text-muted-foreground">Em um cenário real, aqui entraria um uploader de múltiplas imagens.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Produto</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detalhe o produto..."
                rows={4}
              />
            </div>
          </div>

          {/* Section 5: Preço e Estoque */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">5. Preços e Estoque</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin">Margem Desejada (%)</Label>
                <Input
                  id="margin"
                  name="margin"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.margin}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço de Venda (R$) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Estoque Disponível *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 6: Logística */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">6. Logística e Dimensões</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (g)</Label>
                <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Largura (cm)</Label>
                <Input id="width" name="width" type="number" value={formData.width} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Compr. (cm)</Label>
                <Input id="length" name="length" type="number" value={formData.length} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Disponível para Entrega?</Label>
                <Select value={formData.deliveryMode} onValueChange={(v) => handleSelectChange("deliveryMode", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sim (Melhor Envio)</SelectItem>
                    <SelectItem value="2">Sim (Entrega Própria)</SelectItem>
                    <SelectItem value="0">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Disponível para Retirada?</Label>
                <Select value={formData.pickup} onValueChange={(v) => handleSelectChange("pickup", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sim</SelectItem>
                    <SelectItem value="0">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-end pt-2 gap-2 sticky bottom-0 bg-background py-4 border-t mt-8 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
