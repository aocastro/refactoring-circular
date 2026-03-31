import { useState } from "react";
import { Copy, PlusCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/api/axios";

interface ExpressProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ExpressProductModal({ open, onOpenChange, onSuccess }: ExpressProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
  });
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.preco) {
      toast.error("Preencha o nome e o preço do produto");
      return;
    }

    setLoading(true);
    try {
      // Create express product
      const newProduct = {
        name: formData.nome,
        price: parseFloat(formData.preco.replace(",", ".")),
        category: "Express",
        status: "Ativo",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", // Generic image
        stock: 1
      };

      const response = await api.post('/products', newProduct);

      toast.success("Produto cadastrado com sucesso!");

      // Generate random link with product ID or a mock link
      const link = `https://ushar.com.br/produto/${response.data.id || Math.random().toString(36).substr(2, 9)}`;
      setGeneratedLink(link);

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Erro ao cadastrar produto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Link copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setFormData({ nome: "", preco: "" });
    setGeneratedLink("");
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) resetForm();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastro Express</DialogTitle>
          <DialogDescription>
            Cadastre um produto rapidamente e gere um link de venda.
          </DialogDescription>
        </DialogHeader>

        {!generatedLink ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                placeholder="Ex: Tênis Nike"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                placeholder="Ex: 150,00"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Gerando..." : "Gerar Link"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center space-y-2">
              <div className="flex justify-center mb-2">
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <h3 className="font-medium">Link Gerado com Sucesso!</h3>
              <p className="text-sm text-muted-foreground">
                Envie este link para seu cliente finalizar a compra.
              </p>
            </div>

            <div className="flex gap-2">
              <Input value={generatedLink} readOnly />
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resetForm}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cadastro Express
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
