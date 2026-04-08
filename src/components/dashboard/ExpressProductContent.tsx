import { useState } from "react";
import { Copy, PlusCircle, Check, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface ExpressProductContentProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export default function ExpressProductContent({ onBack, onSuccess }: ExpressProductContentProps) {
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Cadastro de Produto Express</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Ideal para quando você chegou com muitas peças e quer registrar tudo rápido.
            Você informa o básico agora e pode completar os detalhes depois, com calma.
          </p>
        </div>
      </div>

      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-sm flex items-start gap-3">
        <span className="text-lg">💡</span>
        <p>Isso evita esquecer peças, perder controle de estoque ou adiar o cadastro.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Informações mínimas do produto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loja">Loja: <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="nome">Nome do Produto: <span className="text-destructive">*</span></Label>
                <Input
                  id="nome"
                  placeholder="Ex: Vestido Floral"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>O produto é consignado? <span className="text-destructive">*</span></Label>
                <Select value={formData.consignado} onValueChange={(val) => setFormData({ ...formData, consignado: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="flex items-center">
                  Tipo do produto: <span className="text-destructive mx-1">*</span> <Info className="h-4 w-4 text-muted-foreground" />
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
                <Label htmlFor="categoria">Categoria: <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="subcategoria">Subcategoria: <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="preco">Preço de venda (R$): <span className="text-destructive">*</span></Label>
                <Input
                  id="preco"
                  placeholder="Ex: 150,00"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Se quiser, você pode ajustar esse valor depois.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade total de peças: <span className="text-destructive">*</span></Label>
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

            <div className="flex justify-between pt-4 border-t border-border mt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Voltar
              </Button>
              <Button type="submit" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white">
                Cadastrar
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Como você quer organizar essas peças no sistema?</h3>
            <p className="text-sm text-muted-foreground">
              Essa escolha define como o estoque vai funcionar depois. Leia com calma — o sistema te ajuda a decidir.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-6 cursor-pointer transition-all ${stockType === 'identical' ? 'border-[#8b5cf6] ring-1 ring-[#8b5cf6] bg-secondary/30' : 'hover:border-[#8b5cf6]/50'}`}
                onClick={() => setStockType('identical')}
              >
                <div className="flex items-start mb-4">
                  <div className="text-xl mr-2">📦</div>
                  <h4 className="font-semibold text-base leading-tight">Tratar todas as peças como iguais<br/>(código de barras único)</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Todas as peças ficam em um único cadastro, com as mesmas informações e o mesmo código de barras.
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5 mb-4 text-foreground">
                  <li>Peças realmente iguais</li>
                  <li>Não precisam de diferenciação</li>
                  <li>Mesmo preço e etiqueta</li>
                </ul>
                <p className="text-sm text-muted-foreground mb-4">
                  Exemplo: "Camiseta básica preta" — estoque com {formData.quantidade} unidades
                </p>
                <p className="text-sm text-destructive flex items-center">
                  <span className="mr-1">⚠️</span> Depois de salvar, não será possível diferenciar essas peças.
                </p>
              </div>

              <div
                className={`border rounded-lg p-6 cursor-pointer transition-all ${stockType === 'unique' ? 'border-[#8b5cf6] ring-1 ring-[#8b5cf6] bg-secondary/30' : 'hover:border-[#8b5cf6]/50'}`}
                onClick={() => setStockType('unique')}
              >
                <div className="flex items-start mb-4">
                  <div className="text-xl mr-2">🧩</div>
                  <h4 className="font-semibold text-base leading-tight">Tratar cada peça como única (códigos de barra individuais)</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Cada peça vira um cadastro separado, com informações próprias e código de barras diferente.
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5 mb-4 text-foreground">
                  <li>Brechó, desapego ou moda autoral</li>
                  <li>Peças parecidas, mas não iguais</li>
                  <li>Editar depois com calma</li>
                </ul>
                <p className="text-sm text-muted-foreground mb-4">
                  Exemplo: {formData.quantidade} cadastros, cada um com 1 peça
                </p>
                <p className="text-sm text-emerald-600 flex items-center">
                  Você pode completar os detalhes depois, uma peça por vez.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-sm mt-6">
              <p className="font-medium flex items-center mb-1"><span className="mr-2">💡</span> Em dúvida?</p>
              <p>Se você trabalha com brechó, desapego ou peça única, na maioria dos casos a melhor escolha é criar um cadastro para cada peça. Isso evita erro estrutural no futuro.</p>
            </div>

            <div className="flex justify-between pt-4 border-t border-border mt-6">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button type="submit" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white" disabled={loading}>
                {loading ? "Salvando..." : "Avançar"}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-6 pt-4 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold">Pronto! Produto cadastrado.</h3>
            <p className="text-muted-foreground">
              O produto já está no seu catálogo. Você pode enriquecer o cadastro dele depois.
            </p>

            <div className="flex flex-col gap-2 mt-6 text-left">
              <Label>Link de venda gerado:</Label>
              <div className="flex gap-2">
                <Input value={generatedLink} readOnly className="bg-secondary/50" />
                <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
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
                className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
                onClick={onBack}
              >
                Ir para Catálogo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
