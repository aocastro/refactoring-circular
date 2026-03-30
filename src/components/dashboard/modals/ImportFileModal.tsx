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
import { Trash2, Upload } from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";
import type { Product } from "@/types";
import Papa from "papaparse";
import * as xlsx from "xlsx";

interface ImportFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ImportFileModal({ open, onOpenChange, onSuccess }: ImportFileModalProps) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Partial<Product>[]>([]);

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: keyof Product, value: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const processData = (data: any[]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const parsedRows: Partial<Product>[] = [];
    for (const row of data) {
      // Use column names or fallback to indices if array
      const isArray = Array.isArray(row);
      const name = isArray ? row[0] : (row["Nome"] || row["name"]);
      if (!name) continue;

      const sku = isArray ? row[1] : (row["SKU"] || row["sku"]);
      const priceRaw = isArray ? row[2] : (row["Preço"] || row["Preco"] || row["price"]);
      let price = Number(priceRaw);
      if (isNaN(price)) {
        // try to parse comma
        if (typeof priceRaw === 'string') {
           price = Number(priceRaw.replace(',', '.'));
        }
      }

      const stockRaw = isArray ? row[3] : (row["Estoque"] || row["stock"]);
      const stock = Number(stockRaw) || 1;

      const category = isArray ? row[4] : (row["Categoria"] || row["category"]);
      const size = isArray ? row[5] : (row["Tamanho"] || row["size"]);
      const condition = isArray ? row[6] : (row["Condição"] || row["Condicao"] || row["condition"]);
      const supplier = isArray ? row[7] : (row["Fornecedor"] || row["supplier"]);
      const brand = isArray ? row[8] : (row["Marca"] || row["brand"]);

      parsedRows.push({
        name: name || "",
        sku: sku || "",
        price: price || 0,
        stock: stock || 1,
        category: category || "Roupas",
        size: size || "Único",
        condition: (condition as Product["condition"]) || "Novo",
        supplier: supplier || "",
        brand: brand || "",
      });
    }
    setRows(parsedRows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text) return;

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            processData(results.data);
          },
          error: (error) => {
             console.error(error);
             toast.error("Erro ao ler arquivo CSV.");
          }
        });
      };
      reader.readAsText(file, 'UTF-8');
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        if (!data) return;

        const workbook = xlsx.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        processData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
       toast.error("Formato de arquivo não suportado. Envie CSV ou Excel.");
    }
  };

  const handleSubmit = async () => {
    if (rows.length === 0) {
      toast.error("Nenhum produto para importar.");
      return;
    }

    // Basic validation
    const isValid = rows.every((r) => r.name && r.sku && r.price !== undefined);
    if (!isValid) {
      toast.error("Verifique os dados importados. Preencha todos os campos obrigatórios (Nome, SKU, Preço).");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/products/bulk", rows);
      toast.success(`${rows.length} produtos importados com sucesso!`);
      onSuccess();
      onOpenChange(false);
      setRows([]);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao importar produtos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background border-border text-foreground overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Importar Arquivo (CSV / Excel)</DialogTitle>
          <DialogDescription>
            Faça upload de uma planilha para importar os produtos. A planilha deve conter as colunas: Nome, SKU, Preço, Estoque, Categoria, Tamanho, Condição.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <div className="relative w-full max-w-sm">
            <Input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <Button variant="outline" size="sm" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Arquivo (CSV ou Excel)
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
                    Nenhum arquivo importado. Selecione um arquivo acima.
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
            {loading ? "Importando..." : "Importar Produtos"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
