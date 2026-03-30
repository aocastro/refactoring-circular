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
import { Label } from "@/components/ui/label";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";
import type { Product } from "@/types";

interface PhotoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PhotoUploadModal({ open, onOpenChange, onSuccess }: PhotoUploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    price: 0,
    category: "Roupas",
    stock: 1,
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, faça upload apenas de imagens.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Simulate smart extraction: if photo is dropped, pre-fill some dummy text to simulate AI extraction
    setFormData((prev) => ({
      ...prev,
      name: "Produto detectado por IA",
      sku: `SKU-${Math.floor(Math.random() * 1000)}`,
    }));
  };

  const clearPreview = () => {
    setPreview(null);
    setFormData({
      name: "",
      sku: "",
      price: 0,
      category: "Roupas",
      stock: 1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) {
      toast.error("Por favor, adicione uma foto primeiro.");
      return;
    }

    setLoading(true);
    try {
      // Em um cenário real, enviaríamos o formData como Multipart form data
      // Aqui, enviamos o mock json
      await api.post("/api/products", {
        ...formData,
        image: "📸", // Using emoji as placeholder since mock UI uses emojis mostly
        status: "Disponível",
        size: "Único",
        condition: "Novo",
      });
      toast.success("Produto cadastrado com sucesso!");
      onSuccess();
      onOpenChange(false);
      clearPreview();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-background border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Cadastro por Foto</DialogTitle>
          <DialogDescription>
            Faça upload da foto da peça e preencha os detalhes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column: Drag and Drop */}
          <div className="flex flex-col gap-2">
            <Label>Foto do Produto</Label>
            {!preview ? (
              <div
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/10" : "border-border bg-secondary/30"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChangeFile}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Clique para fazer upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ou arraste e solte a imagem aqui
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative flex-1 rounded-xl overflow-hidden border border-border group bg-black/5 flex items-center justify-center">
                <img src={preview} alt="Preview" className="max-h-[300px] object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={clearPreview}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Remover
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Simplified Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo-name">Nome do Produto</Label>
              <Input
                id="photo-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Vestido Estampado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo-sku">SKU</Label>
              <Input
                id="photo-sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo-price">Preço (R$)</Label>
              <Input
                id="photo-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo-category">Categoria</Label>
              <Input
                id="photo-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end pt-4 gap-2 border-t border-border mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !preview}>
              {loading ? "Salvando..." : "Salvar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
