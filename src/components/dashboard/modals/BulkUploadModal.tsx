import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Upload } from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";
import type { Product } from "@/types";

interface BulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BulkUploadModal({ open, onOpenChange, onSuccess }: BulkUploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Partial<Product>[]>([]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        name: "",
        sku: "",
        price: 0,
        stock: 1,
        category: "Roupas",
        size: "Único",
        condition: "Novo",
      },
    ]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: keyof Product, value: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      if (lines.length < 2) return; // Need at least header + 1 row

      const parsedRows: Partial<Product>[] = [];
      // Start at 1 to skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV split (doesn't handle commas inside quotes)
        const cols = line.split(',');

        parsedRows.push({
          name: cols[0] || "",
          sku: cols[1] || "",
          price: Number(cols[2]) || 0,
          stock: Number(cols[3]) || 1,
          category: cols[4] || "Roupas",
          size: cols[5] || "Único",
          condition: cols[6] as Product['condition'] || "Novo",
          supplier: cols[7] || "",
          brand: cols[8] || "",
        });
      }
      setRows(parsedRows);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (rows.length === 0) {
      toast.error("Adicione pelo menos um produto.");
      return;
    }

    // Basic validation
    const isValid = rows.every((r) => r.name && r.sku && r.price !== undefined);
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios (Nome, SKU, Preço).");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/products/bulk", rows);
      toast.success(`${rows.length} produtos cadastrados com sucesso!`);
      onSuccess();
      onOpenChange(false);
      setRows([]);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar produtos em massa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background border-border text-foreground overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Cadastro em Massa (CSV)</DialogTitle>
          <DialogDescription>
            Adicione produtos manualmente nas linhas abaixo ou faça upload de um arquivo CSV.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button onClick={addRow} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Linha
          </Button>
          <div className="relative">
            <Input
              type="file"
              accept=".csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <Button variant="outline" size="sm" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Importar CSV
            </Button>
          </div>
        </div>

        <div className="overflow-auto border border-border rounded-md flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary text-muted-foreground sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2">Nome</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Preço</th>
                <th className="px-3 py-2">Estoque</th>
                <th className="px-3 py-2">Categoria</th>
                <th className="px-3 py-2">Tamanho</th>
                <th className="px-3 py-2 w-10">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b border-border hover:bg-secondary/20">
                  <td className="px-2 py-2">
                    <Input
                      value={row.name || ""}
                      onChange={(e) => handleRowChange(index, "name", e.target.value)}
                      className="h-8 min-w-[150px]"
                      placeholder="Nome"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      value={row.sku || ""}
                      onChange={(e) => handleRowChange(index, "sku", e.target.value)}
                      className="h-8 w-24"
                      placeholder="SKU"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      type="number"
                      value={row.price || ""}
                      onChange={(e) => handleRowChange(index, "price", Number(e.target.value))}
                      className="h-8 w-24"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      type="number"
                      value={row.stock || ""}
                      onChange={(e) => handleRowChange(index, "stock", Number(e.target.value))}
                      className="h-8 w-20"
                      placeholder="1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      value={row.category || ""}
                      onChange={(e) => handleRowChange(index, "category", e.target.value)}
                      className="h-8 min-w-[100px]"
                      placeholder="Categoria"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      value={row.size || ""}
                      onChange={(e) => handleRowChange(index, "size", e.target.value)}
                      className="h-8 w-16"
                      placeholder="Tamanho"
                    />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                      onClick={() => removeRow(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma linha adicionada. Clique em "Adicionar Linha" ou importe um CSV.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 gap-2 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || rows.length === 0}>
            {loading ? "Salvando..." : "Salvar Produtos"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
