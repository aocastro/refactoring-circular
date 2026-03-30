import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Upload, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
import axios from 'axios';

interface CadastrarProdutoProps {
  onBack: () => void;
  onSuccess: () => void;
}

const STORAGE_KEY = 'draft_cadastrar_produto';

export default function CadastrarProduto({ onBack, onSuccess }: CadastrarProdutoProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    status: 1, // Ativo by default
    hasVariacoes: 0,
    isVariacao: 0,
    venderOnline: 1,
    venderPdv: 1,
    lojaId: 1,
    mesmaLocalizacaoLoja: 1,
    entrega: 0,
    retirada: 1,
    isConsignado: 0,
    pendenteConsignado: 0,
    tipoEntrega: 1,
    moeda: 'BRL',
    pais: 'BR',
    diferenciarGenero: 0,
  });
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
        toast.info('Rascunho recuperado com sucesso.');
      } catch (e) {
        console.error('Erro ao recuperar rascunho', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.nome) {
      toast.error('O nome do produto é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        createdAt: new Date().toISOString()
      };

      await axios.post('/api/products', payload);

      toast.success('Produto salvo com sucesso!');
      localStorage.removeItem(STORAGE_KEY);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Novo Produto</h2>
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </div>
      </div>

      <form className="space-y-12" onSubmit={handleSubmit}>

        {/* Seção: Informações Principais */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-foreground">Informações Principais</h3>
            <p className="text-sm text-muted-foreground">Dados básicos do produto para listagem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label>Nome do Produto *</Label>
              <Input
                value={formData.nome || ''}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Camiseta Básica..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Código Interno</Label>
              <Input
                value={formData.codigoInterno || ''}
                onChange={e => setFormData({ ...formData, codigoInterno: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Código de Barras (EAN)</Label>
              <Input
                value={formData.codigoDeBarras || ''}
                onChange={e => setFormData({ ...formData, codigoDeBarras: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={formData.sku || ''}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>NCM</Label>
              <Input
                value={formData.ncm || ''}
                onChange={e => setFormData({ ...formData, ncm: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.descricao || ''}
                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          </div>
        </section>

        {/* Seção: Características */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-foreground">Características</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Categoria ID</Label>
              <Input type="number" value={formData.categoriaId ?? ''} onChange={e => setFormData({ ...formData, categoriaId: isNaN(parseInt(e.target.value)) ? undefined : parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Marca ID</Label>
              <Input type="number" value={formData.marcaId ?? ''} onChange={e => setFormData({ ...formData, marcaId: isNaN(parseInt(e.target.value)) ? undefined : parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Condição / Estado</Label>
              <Select value={formData.estado || ''} onValueChange={(v) => setFormData({ ...formData, estado: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Novo">Novo</SelectItem>
                  <SelectItem value="Excelente">Excelente</SelectItem>
                  <SelectItem value="Bom">Bom</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tamanho</Label>
              <Input value={formData.tamanho || ''} onChange={e => setFormData({ ...formData, tamanho: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <Input value={formData.cor || ''} onChange={e => setFormData({ ...formData, cor: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Gênero</Label>
              <Input value={formData.genero || ''} onChange={e => setFormData({ ...formData, genero: e.target.value })} />
            </div>
          </div>
        </section>

        {/* Seção: Preços e Estoque */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-foreground">Preços e Estoque</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Preço de Custo (R$)</Label>
              <Input type="number" step="0.01" value={formData.precoCusto ?? ''} onChange={e => setFormData({ ...formData, precoCusto: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Margem Desejada (%)</Label>
              <Input type="number" step="0.01" value={formData.margemDesejada ?? ''} onChange={e => setFormData({ ...formData, margemDesejada: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Preço de Venda (R$) *</Label>
              <Input type="number" step="0.01" value={formData.precoVenda ?? ''} onChange={e => setFormData({ ...formData, precoVenda: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label>Preço Promocional (R$)</Label>
              <Input type="number" step="0.01" value={formData.precoPromocional ?? ''} onChange={e => setFormData({ ...formData, precoPromocional: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Estoque Atual *</Label>
              <Input type="number" value={formData.estoqueAtual ?? ''} onChange={e => setFormData({ ...formData, estoqueAtual: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label>Fornecedor ID</Label>
              <Input type="number" value={formData.fornecedorId ?? ''} onChange={e => setFormData({ ...formData, fornecedorId: isNaN(parseInt(e.target.value)) ? undefined : parseInt(e.target.value) })} />
            </div>
          </div>
        </section>

        {/* Seção: Dimensões */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-foreground">Dimensões</h3>
          </div>

          <h4 className="text-md font-medium text-foreground mb-2">Dimensões Líquidas (Produto sem embalagem)</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <Label>Peso Líquido (kg)</Label>
              <Input type="number" step="0.01" value={formData.pesoLiquido ?? ''} onChange={e => setFormData({ ...formData, pesoLiquido: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Largura Líquido (cm)</Label>
              <Input type="number" step="0.01" value={formData.larguraLiquido ?? ''} onChange={e => setFormData({ ...formData, larguraLiquido: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Altura Líquido (cm)</Label>
              <Input type="number" step="0.01" value={formData.alturaLiquido ?? ''} onChange={e => setFormData({ ...formData, alturaLiquido: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Comprimento Líq. (cm)</Label>
              <Input type="number" step="0.01" value={formData.comprimentoLiquido ?? ''} onChange={e => setFormData({ ...formData, comprimentoLiquido: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
          </div>

          <h4 className="text-md font-medium text-foreground mb-2">Dimensões Embalado (Para frete)</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Peso Embalado (kg)</Label>
              <Input type="number" step="0.01" value={formData.pesoEmbalado ?? ''} onChange={e => setFormData({ ...formData, pesoEmbalado: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Largura Embalado (cm)</Label>
              <Input type="number" step="0.01" value={formData.larguraEmbalado ?? ''} onChange={e => setFormData({ ...formData, larguraEmbalado: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Altura Embalado (cm)</Label>
              <Input type="number" step="0.01" value={formData.alturaEmbalado ?? ''} onChange={e => setFormData({ ...formData, alturaEmbalado: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Comprimento Emb. (cm)</Label>
              <Input type="number" step="0.01" value={formData.comprimentoEmbalado ?? ''} onChange={e => setFormData({ ...formData, comprimentoEmbalado: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
            </div>
          </div>
        </section>

        {/* Seção: Consignação */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-foreground">Consignação</h3>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Switch
              checked={formData.isConsignado === 1}
              onCheckedChange={(c) => setFormData({ ...formData, isConsignado: c ? 1 : 0 })}
              id="consignado"
            />
            <Label htmlFor="consignado">Produto Consignado?</Label>
          </div>

          {formData.isConsignado === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-md bg-secondary/20">
              <div className="space-y-2">
                <Label>ID do Consignante</Label>
                <Input type="number" value={formData.usuConsignadoId ?? ''} onChange={e => setFormData({ ...formData, usuConsignadoId: isNaN(parseInt(e.target.value)) ? undefined : parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Comissão Dinheiro (%)</Label>
                <Input type="number" step="0.01" value={formData.comissaoLojaConsignadoDinheiro ?? ''} onChange={e => setFormData({ ...formData, comissaoLojaConsignadoDinheiro: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Comissão Crédito (%)</Label>
                <Input type="number" step="0.01" value={formData.comissaoLojaConsignadoCreditos ?? ''} onChange={e => setFormData({ ...formData, comissaoLojaConsignadoCreditos: isNaN(parseFloat(e.target.value)) ? undefined : parseFloat(e.target.value) })} />
              </div>
            </div>
          )}
        </section>

        {/* Seção: Configurações de Venda */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-foreground">Configurações de Venda e Status</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Status Geral</Label>
              <Select value={formData.status?.toString() || '1'} onValueChange={(v) => setFormData({ ...formData, status: parseInt(v) })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ativo (1)</SelectItem>
                  <SelectItem value="0">Inativo (0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  checked={formData.venderOnline === 1}
                  onCheckedChange={(c) => setFormData({ ...formData, venderOnline: c ? 1 : 0 })}
                  id="vender-online"
                />
                <Label htmlFor="vender-online">Vender Online</Label>
              </div>
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  checked={formData.venderPdv === 1}
                  onCheckedChange={(c) => setFormData({ ...formData, venderPdv: c ? 1 : 0 })}
                  id="vender-pdv"
                />
                <Label htmlFor="vender-pdv">Vender no PDV</Label>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Imagens */}
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-foreground">Imagens do Produto</h3>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="flex flex-col items-center">
              <Label htmlFor="file-upload" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Selecionar Imagens
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageUpload} />
              </Label>
              <p className="mt-2 text-sm text-gray-500">PNG, JPG, GIF até 10MB</p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((file, i) => (
                <div key={i} className="relative group rounded-md overflow-hidden aspect-square bg-secondary">
                  <img src={URL.createObjectURL(file)} alt={`Preview ${i}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer stick (bottom) could go here, but top is cleaner. Let's replicate save button at bottom for convenience */}
        <div className="flex justify-end space-x-2 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
          <Button type="button" onClick={handleSubmit} disabled={loading} className="min-w-[150px]">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </div>

      </form>
    </div>
  );
}
