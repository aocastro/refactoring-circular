import { useState } from "react";
import { Copy, PlusCircle, Check, Info } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/api/axios";

interface ExpressProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ExpressProductModal({ open, onOpenChange, onSuccess }: ExpressProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [stockType, setStockType] = useState<"identical" | "unique">("identical");
  const [formData, setFormData] = useState({
    loja: "",
    nome: "",
    consignado: "não",
    tipo: "novo",
    canais: {
      online: true,
      pdv: true,
    },
    categoria: "",
    subcategoria: "",
    preco: "",
    quantidade: "1",
  });
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.loja || !formData.nome || !formData.categoria || !formData.subcategoria || !formData.preco || !formData.quantidade) {
      toast.error("Preencha todos os campos obrigatórios (*)");
      return;
    }

    if (parseInt(formData.quantidade) > 1) {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    try {
      const quantity = parseInt(formData.quantidade);
      const isBulkUnique = quantity > 1 && stockType === "unique";

      const endpoint = isBulkUnique ? '/api/products/bulk' : '/api/products';

      const payload = isBulkUnique
        ? Array.from({ length: quantity }).map((_, i) => ({
              name: `${formData.nome} #${i + 1}`,
              price: parseFloat(formData.preco.replace(",", ".")),
              category: formData.categoria,
              subcategory: formData.subcategoria,
              store: formData.loja,
              consigned: formData.consignado === "sim",
              condition: formData.tipo,
              channels: formData.canais,
              status: "Ativo",
              image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
              stock: 1
          }))
        : {
            name: formData.nome,
            price: parseFloat(formData.preco.replace(",", ".")),
            category: formData.categoria,
            subcategory: formData.subcategoria,
            store: formData.loja,
            consigned: formData.consignado === "sim",
            condition: formData.tipo,
            channels: formData.canais,
            status: "Ativo",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            stock: quantity
          };

      const response = await api.post(endpoint, payload);

      toast.success("Produto cadastrado com sucesso!");

      const productId = isBulkUnique ? response.data[0]?.id : response.data.id;
      const link = `https://ushar.com.br/produto/${productId || Math.random().toString(36).substr(2, 9)}`;
      setGeneratedLink(link);
      setStep(3);

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
    setFormData({
      loja: "",
      nome: "",
      consignado: "não",
      tipo: "novo",
      canais: { online: true, pdv: true },
      categoria: "",
      subcategoria: "",
      preco: "",
      quantidade: "1",
    });
    setStep(1);
    setStockType("identical");
    setGeneratedLink("");
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) resetForm();
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de Produto Express</DialogTitle>
          <DialogDescription>
            Ideal para quando você chegou com muitas peças e quer registrar tudo rápido.
            Você informa o básico agora e pode completar os detalhes depois, com calma.
            <br/><br/>
            💡 Isso evita esquecer peças, perder controle de estoque ou adiar o cadastro.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold border-b pb-2">Informações mínimas do produto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loja">Loja: *</Label>
                <Select value={formData.loja} onValueChange={(val) => setFormData({ ...formData, loja: val })}>
                  <SelectTrigger id="loja">
                    <SelectValue placeholder="Selecione uma loja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Loja 1">Loja 1</SelectItem>
                    <SelectItem value="Loja 2">Loja 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto: *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Vestido Floral"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>O produto é consignado? *</Label>
                <RadioGroup
                  value={formData.consignado}
                  onValueChange={(val) => setFormData({ ...formData, consignado: val })}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="consig-sim" />
                    <Label htmlFor="consig-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="não" id="consig-nao" />
                    <Label htmlFor="consig-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="flex items-center">
                  Tipo do produto: * <Info className="ml-1 h-4 w-4 text-muted-foreground" />
                </Label>
                <Select value={formData.tipo} onValueChange={(val) => setFormData({ ...formData, tipo: val })}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Onde você pretende vender esse produto?</Label>
                <div className="flex flex-col space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canal-online"
                      checked={formData.canais.online}
                      onCheckedChange={(checked) => setFormData({ ...formData, canais: { ...formData.canais, online: checked as boolean }})}
                    />
                    <Label htmlFor="canal-online">Vender online</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canal-pdv"
                      checked={formData.canais.pdv}
                      onCheckedChange={(checked) => setFormData({ ...formData, canais: { ...formData.canais, pdv: checked as boolean }})}
                    />
                    <Label htmlFor="canal-pdv">Vender no PDV (loja física/feira)</Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Você pode mudar isso depois, se precisar.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria: *</Label>
                <Select value={formData.categoria} onValueChange={(val) => setFormData({ ...formData, categoria: val })}>
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Roupas">Roupas</SelectItem>
                    <SelectItem value="Acessórios">Acessórios</SelectItem>
                    <SelectItem value="Calçados">Calçados</SelectItem>
                    <SelectItem value="Bolsas">Bolsas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategoria">Subcategoria: *</Label>
                <Select value={formData.subcategoria} onValueChange={(val) => setFormData({ ...formData, subcategoria: val })}>
                  <SelectTrigger id="subcategoria">
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Infantil">Infantil</SelectItem>
                    <SelectItem value="Unissex">Unissex</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Escolha a opção mais próxima. Não precisa ser perfeita agora.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preco">Preço de venda (R$): *</Label>
                <Input
                  id="preco"
                  placeholder="Ex: 150,00"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Se quiser, você pode ajustar esse valor depois.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade total de peças: *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Quantas peças desse mesmo tipo você está cadastrando agora?</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary text-primary-foreground"
            >
              Continuar
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold border-b pb-2">Como você quer organizar esse estoque?</h3>
            <p className="text-sm text-muted-foreground">
              Você informou que tem {formData.quantidade} peças de "{formData.nome}".
            </p>

            <RadioGroup value={stockType} onValueChange={(val: "identical" | "unique") => setStockType(val)}>
              <div className="flex flex-col space-y-4">
                <div className={`border p-4 rounded-lg cursor-pointer ${stockType === 'identical' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setStockType('identical')}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="identical" id="stock-identical" className="mt-1" />
                    <div>
                      <Label htmlFor="stock-identical" className="font-semibold text-base cursor-pointer">Tudo o mesmo produto</Label>
                      <p className="text-sm text-muted-foreground mt-1">Cria 1 único produto no catálogo com estoque de {formData.quantidade}. Use isso para peças exatamente iguais (mesmo tamanho, cor, etc).</p>
                    </div>
                  </div>
                </div>

                <div className={`border p-4 rounded-lg cursor-pointer ${stockType === 'unique' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setStockType('unique')}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="unique" id="stock-unique" className="mt-1" />
                    <div>
                      <Label htmlFor="stock-unique" className="font-semibold text-base cursor-pointer">Peças únicas / Diferentes</Label>
                      <p className="text-sm text-muted-foreground mt-1">Cria {formData.quantidade} produtos separados no catálogo. Use isso se cada peça for única e precisar de fotos/detalhes diferentes depois.</p>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-primary text-primary-foreground" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Produto"}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center space-y-2">
              <div className="flex justify-center mb-2">
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <h3 className="font-medium">Pronto! Produto cadastrado.</h3>
              <p className="text-sm text-muted-foreground">
                O produto já está no seu catálogo. Você pode enriquecer o cadastro dele depois.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Link de venda gerado:</Label>
              <div className="flex gap-2">
                <Input value={generatedLink} readOnly />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={resetForm}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Cadastrar mais peças
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Ir para Catálogo
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
