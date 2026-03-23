import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Palette, LayoutTemplate, Check, Eye, Save, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { templateThemes, type TemplateTheme } from "@/lib/template-themes";

import templateMinimalImg from "@/assets/templates/template-minimal.jpg";
import templateBoldImg from "@/assets/templates/template-bold.jpg";
import templateClassicImg from "@/assets/templates/template-classic.jpg";
import templateModernImg from "@/assets/templates/template-modern.jpg";
import templateColorfulImg from "@/assets/templates/template-colorful.jpg";
import templateEcoImg from "@/assets/templates/template-eco.jpg";
import templateLuxuryImg from "@/assets/templates/template-luxury.jpg";
import templateTechImg from "@/assets/templates/template-tech.jpg";

const templateImages: Record<string, string> = {
  minimal: templateMinimalImg,
  bold: templateBoldImg,
  classic: templateClassicImg,
  modern: templateModernImg,
  colorful: templateColorfulImg,
  eco: templateEcoImg,
  luxury: templateLuxuryImg,
  tech: templateTechImg,
};

const templateDescriptions: Record<string, string> = {
  minimal: "Design limpo com foco no produto e tipografia elegante.",
  bold: "Cores intensas e layout ousado para marcas que se destacam.",
  classic: "Serifas sofisticadas e paleta neutra premium.",
  modern: "Dark mode nativo com visual high-tech.",
  colorful: "Paleta multicolorida para marcas jovens e criativas.",
  eco: "Tons terrosos e selos de sustentabilidade.",
  luxury: "Preto e dourado para boutiques premium.",
  tech: "Azul neon e layout futurista para tecnologia.",
};

interface StoreConfig {
  name: string;
  slug: string;
  template: string;
  customColors?: {
    accent: string;
    background: string;
    text: string;
  };
  customLogo?: string;
  bannerText?: string;
}

const MinhaLojaContent = () => {
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [bannerText, setBannerText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("storeConfig");
      if (raw) {
        const config = JSON.parse(raw) as StoreConfig;
        setStoreConfig(config);
        setSelectedTemplate(config.template || "minimal");
        setAccentColor(config.customColors?.accent || "");
        setBgColor(config.customColors?.background || "");
        setTextColor(config.customColors?.text || "");
        setBannerText(config.bannerText || "");
      }
    } catch { /* ignore */ }
  }, []);

  const handleChangeTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleSaveTemplate = () => {
    if (!storeConfig) return;
    const updated = { ...storeConfig, template: selectedTemplate };
    localStorage.setItem("storeConfig", JSON.stringify(updated));
    setStoreConfig(updated);
    toast.success(`Template alterado para "${templateThemes[selectedTemplate]?.name || selectedTemplate}"!`);
  };

  const handleSaveCustomization = () => {
    if (!storeConfig) return;
    const updated: StoreConfig = {
      ...storeConfig,
      customColors: {
        accent: accentColor,
        background: bgColor,
        text: textColor,
      },
      bannerText,
    };
    localStorage.setItem("storeConfig", JSON.stringify(updated));
    setStoreConfig(updated);
    toast.success("Personalizações salvas com sucesso!");
  };

  const storeUrl = storeConfig ? `/loja/${storeConfig.slug}` : "#";
  const currentTheme = templateThemes[selectedTemplate];

  if (!storeConfig) {
    return (
      <div className="space-y-6">
        <header>
          <h2 className="font-display text-2xl font-bold text-foreground">Minha Loja</h2>
          <p className="text-sm text-muted-foreground">Nenhuma loja configurada. Crie sua loja primeiro.</p>
        </header>
        <Button onClick={() => window.location.href = "/criar-loja"}>Criar Loja</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Minha Loja</h2>
          <p className="text-sm text-muted-foreground">Visualize, troque o template ou personalize o visual da sua loja.</p>
        </div>
        <Button variant="outline" className="border-border" onClick={() => window.open(storeUrl, "_blank")}>
          <ExternalLink className="mr-2 h-4 w-4" />Visitar Loja
        </Button>
      </header>

      {/* Store info summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="h-16 w-16 overflow-hidden rounded-lg border border-border">
          <img src={templateImages[storeConfig.template] || templateImages.minimal} alt="Template atual" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{storeConfig.name}</p>
          <p className="text-xs text-muted-foreground">/{storeConfig.slug}</p>
        </div>
        <Badge variant="secondary">{templateThemes[storeConfig.template]?.name || storeConfig.template}</Badge>
      </motion.div>

      <Tabs defaultValue="template" className="w-full" aria-label="Opções da loja">
        <TabsList className="border border-border bg-secondary">
          <TabsTrigger value="template" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LayoutTemplate className="mr-2 h-4 w-4" />Trocar Template
          </TabsTrigger>
          <TabsTrigger value="personalizar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Palette className="mr-2 h-4 w-4" />Personalizar
          </TabsTrigger>
          <TabsTrigger value="editor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <PenTool className="mr-2 h-4 w-4" />Editor Visual
          </TabsTrigger>
        </TabsList>

        {/* ── Template switcher ── */}
        <TabsContent value="template" className="mt-6">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <p className="text-sm text-muted-foreground">Selecione um novo template para aplicar à sua loja. As cores e fontes serão atualizadas automaticamente.</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Object.entries(templateThemes).map(([id, theme]) => {
                const isActive = id === selectedTemplate;
                const isCurrent = id === storeConfig.template;
                return (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChangeTemplate(id)}
                    className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${
                      isActive ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={templateImages[id]} alt={theme.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="space-y-1 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{theme.name}</p>
                        {isCurrent && <Badge variant="outline" className="text-[10px]">Atual</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{templateDescriptions[id]}</p>
                    </div>
                    {isActive && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Preview strip */}
            {currentTheme && (
              <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Pré-visualização — {currentTheme.name}</p>
                <div
                  className="flex items-center gap-3 rounded-lg p-4"
                  style={{
                    backgroundColor: currentTheme.cssVars["--store-bg"],
                    color: currentTheme.cssVars["--store-text"],
                    fontFamily: currentTheme.cssVars["--store-font-body"],
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-md text-lg"
                    style={{ backgroundColor: currentTheme.cssVars["--store-accent"], color: currentTheme.cssVars["--store-accent-fg"] }}
                  >
                    {currentTheme.logo || "🛍"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ fontFamily: currentTheme.cssVars["--store-font-display"] }}>
                      {storeConfig.name}
                    </p>
                    <p className="text-xs" style={{ color: currentTheme.cssVars["--store-muted"] }}>
                      Prévia do estilo visual
                    </p>
                  </div>
                  <div
                    className="rounded-md px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: currentTheme.cssVars["--store-accent"], color: currentTheme.cssVars["--store-accent-fg"] }}
                  >
                    Comprar
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSaveTemplate} disabled={selectedTemplate === storeConfig.template}>
                <Save className="mr-2 h-4 w-4" />Aplicar Template
              </Button>
              <Button variant="outline" className="border-border" onClick={() => window.open(storeUrl, "_blank")}>
                <Eye className="mr-2 h-4 w-4" />Ver Loja
              </Button>
            </div>
          </motion.section>
        </TabsContent>

        {/* ── Customization ── */}
        <TabsContent value="personalizar" className="mt-6">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div>
              <h3 className="font-semibold text-foreground">Personalização visual</h3>
              <p className="text-sm text-muted-foreground">Ajuste cores e textos personalizados que serão aplicados sobre o template escolhido.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="custom-accent">Cor de destaque</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="custom-accent"
                    value={accentColor || currentTheme?.cssVars["--store-accent"] || "#8b5cf6"}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-md border border-border"
                  />
                  <Input
                    value={accentColor || currentTheme?.cssVars["--store-accent"] || ""}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#8b5cf6"
                    className="border-border bg-secondary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-bg">Cor de fundo</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="custom-bg"
                    value={bgColor || currentTheme?.cssVars["--store-bg"] || "#ffffff"}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-md border border-border"
                  />
                  <Input
                    value={bgColor || currentTheme?.cssVars["--store-bg"] || ""}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#ffffff"
                    className="border-border bg-secondary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-text">Cor do texto</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="custom-text"
                    value={textColor || currentTheme?.cssVars["--store-text"] || "#1a1a1a"}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-md border border-border"
                  />
                  <Input
                    value={textColor || currentTheme?.cssVars["--store-text"] || ""}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#1a1a1a"
                    className="border-border bg-secondary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-text">Texto do banner promocional</Label>
              <Input
                id="banner-text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Ex: Frete grátis para todo o Brasil!"
                className="border-border bg-secondary"
              />
            </div>

            <Button onClick={handleSaveCustomization}>
              <Save className="mr-2 h-4 w-4" />Salvar Personalizações
            </Button>
          </motion.section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MinhaLojaContent;
