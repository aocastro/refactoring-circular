import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface TemplateSelectionStepProps {
  templates: Template[];
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
}

const TemplateSelectionStep = ({ templates, selectedTemplate, onSelectTemplate }: TemplateSelectionStepProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  return (
    <motion.div key="template" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold text-foreground">Escolha o template da sua loja</h2>
        <p className="text-sm text-muted-foreground">Clique em um template para ver a visualização completa. Você pode alterar depois.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((t) => (
            <div key={t.id} className={`group rounded-xl border-2 p-3 text-left transition-all ${selectedTemplate === t.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-muted-foreground/30"}`}>
              <div
                className="aspect-[4/3] rounded-lg mb-3 relative overflow-hidden cursor-pointer"
                onClick={() => setPreviewTemplate(t)}
              >
                <img src={t.image} alt={`Preview do template ${t.name}`} className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/40">
                  <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    <Eye className="h-3.5 w-3.5" /> Visualizar
                  </span>
                </div>
                {selectedTemplate === t.id && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{t.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={selectedTemplate === t.id ? "default" : "outline"}
                  className="shrink-0 text-[11px] h-7 px-2.5"
                  onClick={() => onSelectTemplate(t.id)}
                >
                  {selectedTemplate === t.id ? "Selecionado" : "Selecionar"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full preview modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-5 py-3">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">{previewTemplate.name}</h3>
                  <p className="text-xs text-muted-foreground">{previewTemplate.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      onSelectTemplate(previewTemplate.id);
                      setPreviewTemplate(null);
                    }}
                  >
                    {selectedTemplate === previewTemplate.id ? "✓ Selecionado" : "Usar este template"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(null)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Fechar preview"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {/* Image */}
              <div className="overflow-y-auto max-h-[calc(90vh-64px)]">
                <img
                  src={previewTemplate.image}
                  alt={`Visualização completa do template ${previewTemplate.name}`}
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TemplateSelectionStep;
