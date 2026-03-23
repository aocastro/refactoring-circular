import { X, Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { EditorBlock } from "./types";
import { FONT_OPTIONS, PADDING_OPTIONS } from "./types";

interface Props {
  block: EditorBlock;
  onUpdate: (block: EditorBlock) => void;
  onClose: () => void;
}

const BLOCK_LABELS: Record<string, string> = {
  "hero-banner": "Banner Principal",
  text: "Texto",
  "image-gallery": "Galeria de Imagens",
  video: "Vídeo",
  newsletter: "Newsletter",
  products: "Produtos",
  testimonials: "Depoimentos",
  cta: "Chamada para Ação",
  about: "Sobre Nós",
  contact: "Contato",
};

const IMAGE_KEYS = ["imageUrl", "image1", "image2", "image3", "image4"];

const BlockSettingsPanel = ({ block, onUpdate, onClose }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeKeyRef = useRef<string>("");

  const updateContent = (key: string, value: string) => {
    onUpdate({ ...block, content: { ...block.content, [key]: value } });
  };

  const updateStyle = (key: string, value: string) => {
    onUpdate({ ...block, styles: { ...block.styles, [key]: value } });
  };

  const handleImageUpload = (key: string) => {
    activeKeyRef.current = key;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        updateContent(activeKeyRef.current, reader.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isImageKey = (key: string) => IMAGE_KEYS.includes(key);

  return (
    <div className="flex h-full flex-col border-l border-border bg-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-sm font-semibold text-foreground">
          {BLOCK_LABELS[block.type] || block.type}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Visibility */}
        <div className="flex items-center justify-between">
          <Label>Visível</Label>
          <Switch
            checked={block.visible}
            onCheckedChange={(v) => onUpdate({ ...block, visible: v })}
          />
        </div>

        {/* Content fields */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conteúdo</p>
          {Object.entries(block.content).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>

              {isImageKey(key) ? (
                <div className="space-y-2">
                  {value && (
                    <div className="relative aspect-video overflow-hidden rounded-md border border-border">
                      <img src={value} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => updateContent(key, "")}
                        className="absolute right-1 top-1 rounded bg-destructive/80 p-0.5 text-white hover:bg-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border text-xs"
                      onClick={() => handleImageUpload(key)}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Upload
                    </Button>
                  </div>
                  <Input
                    value={value}
                    onChange={(e) => updateContent(key, e.target.value)}
                    placeholder="Ou cole a URL da imagem"
                    className="border-border bg-secondary text-xs"
                  />
                </div>
              ) : value.length > 60 ? (
                <textarea
                  value={value}
                  onChange={(e) => updateContent(key, e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm"
                  rows={3}
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) => updateContent(key, e.target.value)}
                  className="border-border bg-secondary text-sm"
                />
              )}
            </div>
          ))}
        </div>

        {/* Style fields */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estilos</p>

          {[
            { key: "backgroundColor", label: "Cor de fundo" },
            { key: "textColor", label: "Cor do texto" },
            { key: "accentColor", label: "Cor de destaque" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(block.styles as any)[key]}
                  onChange={(e) => updateStyle(key, e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded border border-border"
                />
                <Input
                  value={(block.styles as any)[key]}
                  onChange={(e) => updateStyle(key, e.target.value)}
                  className="flex-1 border-border bg-secondary text-xs"
                />
              </div>
            </div>
          ))}

          <div className="space-y-1">
            <Label className="text-xs">Fonte</Label>
            <Select
              value={block.styles.fontFamily}
              onValueChange={(v) => updateStyle("fontFamily", v)}
            >
              <SelectTrigger className="border-border bg-secondary text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    <span style={{ fontFamily: f.value }}>{f.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Espaçamento</Label>
            <Select
              value={block.styles.padding}
              onValueChange={(v) => updateStyle("padding", v)}
            >
              <SelectTrigger className="border-border bg-secondary text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PADDING_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockSettingsPanel;
