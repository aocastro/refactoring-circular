import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/axios';

interface BulkUploadContentProps {
  onBack: () => void;
  onSuccess: () => void;
}

const columns = [
  { key: 'nome', label: 'Nome do Produto *', width: 200, required: true },
  { key: 'codigoInterno', label: 'Código Interno', width: 120 },
  { key: 'codigoDeBarras', label: 'Cód. Barras (EAN)', width: 150 },
  { key: 'sku', label: 'SKU', width: 120 },
  { key: 'ncm', label: 'NCM', width: 100 },
  { key: 'descricao', label: 'Descrição', width: 250 },
  { key: 'categoriaId', label: 'Categoria ID', width: 100, type: 'number' },
  { key: 'marcaId', label: 'Marca ID', width: 100, type: 'number' },
  { key: 'estado', label: 'Condição / Estado', width: 150 },
  { key: 'tamanho', label: 'Tamanho', width: 100 },
  { key: 'cor', label: 'Cor', width: 100 },
  { key: 'genero', label: 'Gênero', width: 100 },
  { key: 'precoCusto', label: 'Preço de Custo', width: 120, type: 'number' },
  { key: 'margemDesejada', label: 'Margem Desejada (%)', width: 150, type: 'number' },
  { key: 'precoVenda', label: 'Preço de Venda *', width: 120, type: 'number', required: true },
  { key: 'precoPromocional', label: 'Preço Promocional', width: 150, type: 'number' },
  { key: 'estoqueAtual', label: 'Estoque Atual *', width: 120, type: 'number', required: true },
  { key: 'fornecedorId', label: 'Fornecedor ID', width: 120, type: 'number' },
  { key: 'pesoLiquido', label: 'Peso Líquido (kg)', width: 150, type: 'number' },
  { key: 'larguraLiquido', label: 'Largura Líq. (cm)', width: 150, type: 'number' },
  { key: 'alturaLiquido', label: 'Altura Líq. (cm)', width: 150, type: 'number' },
  { key: 'comprimentoLiquido', label: 'Comprimento Líq. (cm)', width: 180, type: 'number' },
  { key: 'pesoEmbalado', label: 'Peso Emb. (kg)', width: 150, type: 'number' },
  { key: 'larguraEmbalado', label: 'Largura Emb. (cm)', width: 150, type: 'number' },
  { key: 'alturaEmbalado', label: 'Altura Emb. (cm)', width: 150, type: 'number' },
  { key: 'comprimentoEmbalado', label: 'Comprimento Emb. (cm)', width: 180, type: 'number' },
  { key: 'isConsignado', label: 'Consignado (1/0)', width: 150, type: 'number' },
  { key: 'usuConsignadoId', label: 'ID do Consignante', width: 150, type: 'number' },
  { key: 'comissaoLojaConsignadoDinheiro', label: 'Comissão Dinh. (%)', width: 150, type: 'number' },
  { key: 'comissaoLojaConsignadoCreditos', label: 'Comissão Créd. (%)', width: 150, type: 'number' },
  { key: 'status', label: 'Status (1/0)', width: 100, type: 'number' },
  { key: 'venderOnline', label: 'Vender Online (1/0)', width: 150, type: 'number' },
  { key: 'venderPdv', label: 'Vender PDV (1/0)', width: 150, type: 'number' },
];

export default function BulkUploadContent({ onBack, onSuccess }: BulkUploadContentProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any[]>([
    {
      nome: "", sku: "", precoVenda: 0, estoqueAtual: 1, categoriaId: "", tamanho: "Único", estado: "Novo", status: 1, venderOnline: 1, venderPdv: 1,
    }
  ]);
  const [loading, setLoading] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);

  const addRow = () => {
    setRows([
      ...rows,
      {
        nome: "", sku: "", precoVenda: 0, estoqueAtual: 1, categoriaId: "", tamanho: "Único", estado: "Novo", status: 1, venderOnline: 1, venderPdv: 1,
      },
    ]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: string, value: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleSubmit = async () => {
    if (rows.length === 0) {
      toast.error("Adicione pelo menos um produto.");
      return;
    }

    const isValid = rows.every((r) => r.nome && r.precoVenda !== undefined && r.estoqueAtual !== undefined);
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios (Nome, Preço de Venda, Estoque Atual).");
      return;
    }

    setLoading(true);
    try {
      // Map to the format backend expects (e.g. name, price, stock, category, size, condition)
      // but keep other fields as well
      const payload = rows.map(r => ({
        ...r,
        name: r.nome,
        price: r.precoVenda,
        stock: r.estoqueAtual,
        category: r.categoriaId ? r.categoriaId.toString() : "Roupas",
        size: r.tamanho,
        condition: r.estado,
        createdAt: new Date().toISOString()
      }));

      await api.post("/api/products/bulk", payload);
      toast.success(`${rows.length} produtos cadastrados com sucesso!`);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar produtos em massa.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const key = e.key;
    const target = e.target as HTMLInputElement;

    // If we are at the beginning of the text and press Left, navigate left.
    // If we are at the end of the text and press Right, navigate right.
    // For type="number" selectionStart/selectionEnd are null, so we always navigate.
    const isNumberType = target.type === 'number';
    const isAtStart = isNumberType || target.selectionStart === 0 || target.selectionStart === null;
    const isAtEnd = isNumberType || target.selectionEnd === target.value.length || target.selectionEnd === null;

    let shouldNavigate = false;
    let nextRow = rowIndex;
    let nextCol = colIndex;

    if (key === 'ArrowUp') {
      shouldNavigate = true;
      nextRow = Math.max(0, rowIndex - 1);
    } else if (key === 'ArrowDown' || key === 'Enter') {
      shouldNavigate = true;
      nextRow = Math.min(rows.length - 1, rowIndex + 1);
    } else if (key === 'ArrowLeft' && isAtStart) {
      shouldNavigate = true;
      nextCol = Math.max(0, colIndex - 1);
    } else if (key === 'ArrowRight' && isAtEnd) {
      shouldNavigate = true;
      nextCol = Math.min(columns.length - 1, colIndex + 1);
    }

    if (shouldNavigate) {
      e.preventDefault();
      const input = tableRef.current?.querySelector(
        `input[data-row="${nextRow}"][data-col="${nextCol}"]`
      ) as HTMLInputElement;

      if (input) {
        input.focus();
        // Select the content if moving vertically, or moving horizontally to a new cell
        // so it behaves like Excel's cell selection.
        input.select();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in space-y-4">
      <div className="flex items-center justify-between sticky top-0 bg-background z-20 py-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cadastro em Massa</h2>
            <p className="text-sm text-muted-foreground">Preencha como uma planilha para cadastrar múltiplos produtos de uma vez.</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
          <Button type="button" onClick={handleSubmit} disabled={loading || rows.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Produtos'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={addRow} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Linha
        </Button>
      </div>

      <div className="overflow-auto border border-border rounded-md flex-1">
        <table ref={tableRef} className="w-max text-sm text-left border-collapse">
          <thead className="text-xs uppercase bg-secondary text-muted-foreground sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 border-b border-border bg-secondary min-w-[50px] sticky left-0 z-20"></th>
              {columns.map((col, index) => (
                <th key={col.key} className="px-2 py-2 border-b border-r border-border bg-secondary" style={{ minWidth: col.width }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border hover:bg-secondary/20 group">
                <td className="px-2 py-1 border-r border-border bg-background group-hover:bg-secondary/20 sticky left-0 z-10 text-center align-middle">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive/90"
                    onClick={() => removeRow(rowIndex)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </td>
                {columns.map((col, colIndex) => (
                  <td key={col.key} className="p-0 border-r border-border">
                    <Input
                      data-row={rowIndex}
                      data-col={colIndex}
                      type={col.type === 'number' ? 'number' : 'text'}
                      value={row[col.key] !== undefined ? row[col.key] : ""}
                      onChange={(e) => {
                        const val = col.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
                        handleRowChange(rowIndex, col.key, val);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      className="h-8 w-full border-0 rounded-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset bg-transparent px-2"
                      placeholder={col.required ? 'Obrigatório' : ''}
                    />
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  Nenhuma linha adicionada. Clique em "Adicionar Linha" para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
