import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Eye, EyeOff, Settings2, Plus, Save, Undo2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BlockRenderer from "./BlockRenderer";
import BlockSettingsPanel from "./BlockSettingsPanel";
import type { EditorBlock } from "./types";
import { DEFAULT_BLOCKS } from "./types";
import { getTemplateTheme, type TemplateTheme } from "@/lib/template-themes";

const BLOCK_LABELS: Record<string, string> = {
  "banner-carousel": "Banners Principais",
  text: "Texto",
  "image-gallery": "Galeria de Imagens",
  video: "Vídeo",
  newsletter: "Newsletter",
  "product-grid": "Grade de Produtos",
  testimonials: "Depoimentos",
  cta: "Chamada para Ação",
  about: "Sobre Nós",
  contact: "Contato",
  "esg-impact": "Impacto Circular",
};

const ADDABLE_BLOCKS: { type: EditorBlock["type"]; label: string }[] = [
  { type: "banner-carousel", label: "Banners" },
  { type: "product-grid", label: "Grade de Produtos" },
  { type: "esg-impact", label: "Nosso Impacto" },
  { type: "text", label: "Texto" },
  { type: "about", label: "Sobre Nós" },
  { type: "image-gallery", label: "Galeria de Imagens" },
  { type: "video", label: "Vídeo" },
  { type: "testimonials", label: "Depoimentos" },
  { type: "newsletter", label: "Newsletter" },
  { type: "cta", label: "Chamada para Ação" },
  { type: "contact", label: "Contato" },
];

/** Gera os blocos padrão com as cores/fontes do tema escolhido */
export function buildDefaultBlocksFromTheme(theme: TemplateTheme | null): EditorBlock[] {
  if (!theme) return DEFAULT_BLOCKS;

  const bg = theme.cssVars["--store-bg"] ?? "#ffffff";
  const text = theme.cssVars["--store-text"] ?? "#1a1a1a";
  const accent = theme.cssVars["--store-accent"] ?? "#8b5cf6";
  const accentFg = theme.cssVars["--store-accent-fg"] ?? "#ffffff";
  const fontBody = theme.cssVars["--store-font-body"] ?? "'Inter', sans-serif";
  const fontDisplay = theme.cssVars["--store-font-display"] ?? fontBody;
  const cardBg = theme.cssVars["--store-card"] ?? bg;
  const mutedBg = theme.cssVars["--store-bg"] ?? "#f9fafb";

  return DEFAULT_BLOCKS.map((block) => {
    let blockBg = bg;
    let blockText = text;
    let blockAccent = accent;
    let blockFont = fontBody;

    switch (block.type) {
      case "banner-carousel":
        blockBg = theme.cssVars["--store-card"] ?? bg;
        blockText = text;
        blockAccent = accent;
        blockFont = fontDisplay;
        break;
      case "newsletter":
      case "cta":
        blockBg = accent;
        blockText = accentFg;
        blockAccent = bg;
        blockFont = fontDisplay;
        break;
      case "video":
      case "esg-impact":
        blockBg = theme.cssVars["--store-card"] ?? "#1a1a1a";
        blockText = theme.cssVars["--store-text"] ?? "#ffffff";
        blockAccent = accent;
        blockFont = fontDisplay;
        break;
      case "image-gallery":
      case "product-grid":
        blockBg = mutedBg;
        blockText = text;
        blockAccent = accent;
        blockFont = fontBody;
        break;
      case "contact":
        blockBg = cardBg;
        blockText = text;
        blockAccent = accent;
        blockFont = fontBody;
        break;
      default:
        blockBg = cardBg;
        blockText = text;
        blockAccent = accent;
        blockFont = fontBody;
    }

    return {
      ...block,
      styles: {
        ...block.styles,
        backgroundColor: blockBg,
        textColor: blockText,
        accentColor: blockAccent,
        fontFamily: blockFont,
      },
    };
  });
}

/** Chave do localStorage separada por template */
function getStorageKey(templateId?: string) {
  return templateId ? `storeLayout_${templateId}` : "storeLayout";
}

interface StorePageEditorProps {
  templateId?: string;
}

const StorePageEditor = ({ templateId }: StorePageEditorProps) => {
  const storageKey = getStorageKey(templateId);
  const prevTemplateIdRef = useRef<string | undefined>(templateId);

  const [blocks, setBlocks] = useState<EditorBlock[]>(() => {
    const theme = getTemplateTheme(templateId);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return buildDefaultBlocksFromTheme(theme);
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Quando o templateId mudar (cliente trocou template), recarrega os blocos do novo tema
  useEffect(() => {
    if (prevTemplateIdRef.current === templateId) return;
    prevTemplateIdRef.current = templateId;

    const key = getStorageKey(templateId);
    const theme = getTemplateTheme(templateId);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setBlocks(JSON.parse(saved));
        setSelectedBlockId(null);
        return;
      }
    } catch {}
    setBlocks(buildDefaultBlocksFromTheme(theme));
    setSelectedBlockId(null);
  }, [templateId]);

  const currentTheme = getTemplateTheme(templateId);
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  const updateBlock = useCallback((updated: EditorBlock) => {
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  const handleContentChange = useCallback((blockId: string, key: string, value: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content: { ...b.content, [key]: value } } : b))
    );
  }, []);

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDraggedIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const toggleVisibility = (id: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const addBlock = (type: EditorBlock["type"]) => {
    const theme = getTemplateTheme(templateId);
    const accent = theme?.cssVars["--store-accent"] ?? "#8b5cf6";
    const bg = theme?.cssVars["--store-card"] ?? "#ffffff";
    const text = theme?.cssVars["--store-text"] ?? "#1a1a1a";
    const font = theme?.cssVars["--store-font-body"] ?? "'Inter', sans-serif";
    const newBlock: EditorBlock = {
      id: `${type}-${Date.now()}`,
      type,
      visible: true,
      content: type === "text"
        ? { title: "Novo Título", description: "Digite seu texto aqui..." }
        : DEFAULT_BLOCKS.find((b) => b.type === type)?.content || { title: "Nova Seção" },
      styles: {
        backgroundColor: bg,
        textColor: text,
        accentColor: accent,
        fontFamily: font,
        padding: "2rem 1.5rem",
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setShowAddMenu(false);
    setSelectedBlockId(newBlock.id);
    toast.success(`Seção "${BLOCK_LABELS[type]}" adicionada!`);
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(blocks));
    toast.success("Layout da loja salvo com sucesso!");
  };

  const handleReset = () => {
    const theme = getTemplateTheme(templateId);
    const resetBlocks = buildDefaultBlocksFromTheme(theme);
    setBlocks(resetBlocks);
    setSelectedBlockId(null);
    localStorage.removeItem(storageKey);
    toast.info("Layout restaurado para o padrão do template.");
  };

  return (
    <div className="flex h-[70vh] min-h-[500px] overflow-hidden rounded-xl border border-border">
      {/* Left: block list + canvas */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2">
          <p className="text-sm font-semibold text-foreground">Editor Visual</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <Undo2 className="mr-1 h-3.5 w-3.5" />Resetar
            </Button>
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setShowAddMenu(!showAddMenu)}>
                <Plus className="mr-1 h-3.5 w-3.5" />Adicionar Seção
              </Button>
              <AnimatePresence>
                {showAddMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-card p-1 shadow-lg"
                  >
                    {ADDABLE_BLOCKS.map((ab) => (
                      <button
                        key={ab.type}
                        onClick={() => addBlock(ab.type)}
                        className="w-full rounded px-3 py-2 text-left text-sm text-foreground hover:bg-secondary"
                      >
                        {ab.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-1 h-3.5 w-3.5" />Salvar
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{ backgroundColor: currentTheme ? currentTheme.cssVars["--store-bg"] + "33" : undefined }}
        >
          <div
            className="mx-auto max-w-2xl overflow-hidden rounded-lg shadow-md"
            style={currentTheme ? { backgroundColor: currentTheme.cssVars["--store-bg"] } : undefined}
          >
            {/* Header preview do template */}
            {currentTheme && (
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  backgroundColor: currentTheme.cssVars["--store-bg"],
                  borderBottom: `1px solid ${currentTheme.cssVars["--store-border"]}`,
                  fontFamily: currentTheme.cssVars["--store-font-body"],
                }}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded text-base"
                  style={{ backgroundColor: currentTheme.cssVars["--store-accent"], color: currentTheme.cssVars["--store-accent-fg"] }}
                >
                  {currentTheme.logo ?? "🛍"}
                </span>
                <span
                  className="flex-1 text-sm font-semibold"
                  style={{ color: currentTheme.cssVars["--store-text"], fontFamily: currentTheme.cssVars["--store-font-display"] }}
                >
                  Prévia — {currentTheme.name}
                </span>
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: currentTheme.cssVars["--store-accent"], color: currentTheme.cssVars["--store-accent-fg"] }}
                >
                  Ao Vivo
                </span>
              </div>
            )}
            <div className="space-y-0">
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedBlockId(block.id)}
                className={`group relative transition-all ${
                  dragOverIdx === idx ? "ring-2 ring-primary ring-offset-1" : ""
                } ${selectedBlockId === block.id ? "ring-2 ring-primary" : ""} ${
                  !block.visible ? "opacity-40" : ""
                } cursor-pointer`}
              >
                {/* Drag handle overlay */}
                <div className="absolute left-0 top-0 z-10 flex h-full w-8 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-8 w-6 cursor-grab items-center justify-center rounded bg-black/60 text-white active:cursor-grabbing">
                    <GripVertical className="h-4 w-4" />
                  </div>
                </div>

                {/* Action buttons overlay */}
                <div className="absolute right-1 top-1 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleVisibility(block.id); }}
                    className="rounded bg-black/60 p-1 text-white hover:bg-black/80"
                    title={block.visible ? "Ocultar" : "Mostrar"}
                  >
                    {block.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
                    className="rounded bg-black/60 p-1 text-white hover:bg-black/80"
                    title="Configurações"
                  >
                    <Settings2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                    className="rounded bg-red-600/80 p-1 text-white hover:bg-red-700"
                    title="Remover"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                {/* Block label */}
                <div className="absolute left-10 top-1 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                    {BLOCK_LABELS[block.type] || block.type}
                  </span>
                </div>

                <BlockRenderer
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onContentChange={(key, value) => handleContentChange(block.id, key, value)}
                  theme={currentTheme}
                />
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: settings panel */}
      <AnimatePresence>
        {selectedBlock && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <BlockSettingsPanel
              block={selectedBlock}
              onUpdate={updateBlock}
              onClose={() => setSelectedBlockId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorePageEditor;
