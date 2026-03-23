import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Eye, EyeOff, Settings2, Plus, Save, Undo2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BlockRenderer from "./BlockRenderer";
import BlockSettingsPanel from "./BlockSettingsPanel";
import type { EditorBlock } from "./types";
import { DEFAULT_BLOCKS } from "./types";

const BLOCK_LABELS: Record<string, string> = {
  "hero-banner": "Banner Principal",
  text: "Texto",
  "image-gallery": "Galeria",
  products: "Produtos",
  testimonials: "Depoimentos",
  cta: "Chamada para Ação",
  about: "Sobre Nós",
  contact: "Contato",
};

const ADDABLE_BLOCKS: { type: EditorBlock["type"]; label: string }[] = [
  { type: "text", label: "Texto" },
  { type: "about", label: "Sobre Nós" },
  { type: "image-gallery", label: "Galeria de Imagens" },
  { type: "video", label: "Vídeo" },
  { type: "products", label: "Produtos" },
  { type: "testimonials", label: "Depoimentos" },
  { type: "newsletter", label: "Newsletter" },
  { type: "cta", label: "Chamada para Ação" },
  { type: "contact", label: "Contato" },
];

const StorePageEditor = () => {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => {
    try {
      const saved = localStorage.getItem("storeLayout");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BLOCKS;
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

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
    const newBlock: EditorBlock = {
      id: `${type}-${Date.now()}`,
      type,
      visible: true,
      content: type === "text"
        ? { title: "Novo Título", description: "Digite seu texto aqui..." }
        : DEFAULT_BLOCKS.find((b) => b.type === type)?.content || { title: "Nova Seção" },
      styles: {
        backgroundColor: "#ffffff",
        textColor: "#1a1a1a",
        accentColor: "#8b5cf6",
        fontFamily: "'Inter', sans-serif",
        padding: "2rem 1.5rem",
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setShowAddMenu(false);
    setSelectedBlockId(newBlock.id);
    toast.success(`Seção "${BLOCK_LABELS[type]}" adicionada!`);
  };

  const handleSave = () => {
    localStorage.setItem("storeLayout", JSON.stringify(blocks));
    toast.success("Layout da loja salvo com sucesso!");
  };

  const handleReset = () => {
    setBlocks(DEFAULT_BLOCKS);
    setSelectedBlockId(null);
    localStorage.removeItem("storeLayout");
    toast.info("Layout restaurado para o padrão.");
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
        <div className="flex-1 overflow-y-auto bg-muted/30 p-4">
          <div className="mx-auto max-w-2xl space-y-0 overflow-hidden rounded-lg border border-border bg-white shadow-sm dark:bg-gray-900">
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
                />
              </div>
            ))}
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
