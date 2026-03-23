import { Star, Mail, Phone, ArrowRight, Image, Play, Send, ChevronLeft, ChevronRight, Leaf, Recycle, TreePine, Package } from "lucide-react";
import type { EditorBlock } from "./types";
import { type TemplateTheme } from "@/lib/template-themes";

interface Props {
  block: EditorBlock;
  isSelected: boolean;
  onContentChange: (key: string, value: string) => void;
  theme?: TemplateTheme | null;
}

const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace(".", ",")}`;

const BlockRenderer = ({ block, isSelected, onContentChange, theme }: Props) => {
  const { styles, content } = block;

  const t = theme ?? {
    cssVars: {},
    rootClass: "",
    headerClass: "bg-card/95 border-border",
    pillActiveClass: "bg-primary text-primary-foreground",
    pillClass: "bg-secondary text-muted-foreground hover:text-foreground",
    cardClass: "border-border bg-card rounded-xl hover:shadow-elevated",
    headingClass: "",
    bannerClass: "rounded-2xl",
    footerClass: "border-border",
  };

  const editableProps = (key: string) => ({
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => onContentChange(key, e.currentTarget.textContent || ""),
    className: `outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded px-1 ${isSelected ? "hover:bg-black/5 dark:hover:bg-white/10" : ""}`,
  });

  switch (block.type) {
    case "banner-carousel":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, padding: styles.padding }}>
          <div className="mx-auto max-w-6xl">
            <h3 {...editableProps("title")} className={`${editableProps("title").className} mb-4 text-xl font-bold opacity-50 text-center`}>
              {content.title}
            </h3>
            <div className={`relative overflow-hidden aspect-[3/1] border flex items-center justify-center ${t.bannerClass}`}
              style={theme ? { borderColor: "var(--store-border)", backgroundColor: "var(--store-card)" } : undefined}
            >
              <div className="text-center opacity-40">
                <Image className="h-12 w-12 mx-auto mb-2" />
                <p>Simulação de Banners</p>
              </div>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center pointer-events-none"
                style={theme ? { backgroundColor: "var(--store-bg)", color: "var(--store-text)" } : undefined}
              >
                <ChevronLeft className="h-4 w-4" opacity="0.5" />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center pointer-events-none"
                style={theme ? { backgroundColor: "var(--store-bg)", color: "var(--store-text)" } : undefined}
              >
                <ChevronRight className="h-4 w-4" opacity="0.5" />
              </button>
            </div>
          </div>
        </div>
      );

    case "about":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <h3 {...editableProps("title")} className={`${editableProps("title").className} mb-2 text-xl font-bold`}>
            {content.title}
          </h3>
          <p {...editableProps("description")} className={`${editableProps("description").className} text-sm leading-relaxed opacity-80`}>
            {content.description}
          </p>
        </div>
      );

    case "image-gallery":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <h3 {...editableProps("title")} className={`${editableProps("title").className} mb-4 text-xl font-bold`}>
            {content.title}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {["image1", "image2", "image3", "image4"].map((key) => (
              <div key={key} className="group/img relative aspect-[4/3] overflow-hidden rounded-lg border" style={{ borderColor: styles.accentColor + "33" }}>
                {content[key] ? (
                  <img src={content[key]} alt={key} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                    <Image className="h-8 w-8 opacity-40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "video":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <h3 {...editableProps("title")} className={`${editableProps("title").className} mb-2 text-xl font-bold`}>
            {content.title}
          </h3>
          <p {...editableProps("description")} className={`${editableProps("description").className} mb-4 text-sm opacity-80`}>
            {content.description}
          </p>
          <div className="aspect-video overflow-hidden rounded-lg border" style={{ borderColor: styles.accentColor + "33" }}>
            {content.videoUrl ? (
              <iframe
                src={content.videoUrl}
                title="Video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <Play className="h-12 w-12 opacity-40 text-white" />
              </div>
            )}
          </div>
        </div>
      );

    case "newsletter":
      return (
        <div
          style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <Send className="h-8 w-8" style={{ color: styles.accentColor }} />
          <h3 {...editableProps("title")} className={`${editableProps("title").className} text-xl font-bold`}>
            {content.title}
          </h3>
          <p {...editableProps("subtitle")} className={`${editableProps("subtitle").className} max-w-md text-sm opacity-90`}>
            {content.subtitle}
          </p>
          <div className="mt-1 flex w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder={content.placeholder || "Seu e-mail"}
              className="flex-1 rounded-lg border px-4 py-2 text-sm"
              style={{ borderColor: styles.accentColor + "66", backgroundColor: styles.backgroundColor, color: styles.textColor }}
              readOnly
            />
            <button
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: styles.accentColor, color: styles.backgroundColor }}
            >
              {content.buttonText || "Inscrever"}
            </button>
          </div>
        </div>
      );

    case "product-grid":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding }}>
          <div className="mx-auto max-w-6xl">
            <h2 {...editableProps("title")}
              className={`${editableProps("title").className} mb-4 text-xl font-bold ${t.headingClass}`}
              style={{ fontFamily: styles.fontFamily }}
            >
              {content.title}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 pointer-events-none">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`overflow-hidden border ${t.cardClass}`} style={{ borderColor: styles.accentColor + "33" }}>
                  <div className="aspect-square flex justify-center items-center bg-gray-100" style={theme ? { backgroundColor: "var(--store-card)" } : undefined}>
                    <p className="opacity-20 text-4xl">👟</p>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium opacity-60">Produto {i}</p>
                    <p className="text-sm font-bold mt-1" style={theme ? { fontFamily: "var(--store-font-display)", color: "var(--store-text)" } : undefined}>
                      {formatPrice(49.9 * i)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "esg-impact":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding }}>
          <div className="mx-auto max-w-6xl pointer-events-none">
            <h2 {...editableProps("title")}
              className={`${editableProps("title").className} mb-4 text-xl font-bold ${t.headingClass}`}
              style={{ fontFamily: styles.fontFamily }}
            >
              {content.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Leaf, value: "76 kg", label: "CO₂ Evitado" },
                { icon: Recycle, value: "120 kg", label: "Resíduos Evitados" },
                { icon: TreePine, value: "45 kg", label: "Recursos Não Extraídos" },
                { icon: Package, value: "102", label: "Produtos Disponibilizados" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl border text-center"
                  style={theme ? { borderColor: "var(--store-border)", backgroundColor: "var(--store-card)" } : undefined}
                >
                  <item.icon className="h-6 w-6 mx-auto mb-2" style={theme ? { color: "var(--store-accent)" } : undefined} />
                  <p className="text-lg font-bold" style={theme ? { fontFamily: "var(--store-font-display)", color: "var(--store-text)" } : undefined}>
                    {item.value}
                  </p>
                  <p className="text-xs opacity-60 text-[var(--store-text)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <h3 {...editableProps("title")} className={`${editableProps("title").className} mb-4 text-xl font-bold`}>
            {content.title}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Ana Silva", "Carlos Santos"].map((name) => (
              <div key={name} className="rounded-lg border p-3" style={{ borderColor: styles.accentColor + "33" }}>
                <div className="mb-2 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs italic opacity-70">"Excelente experiência de compra!"</p>
                <p className="mt-2 text-xs font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "cta":
      return (
        <div
          style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <h3 {...editableProps("title")} className={`${editableProps("title").className} text-xl font-bold`}>
            {content.title}
          </h3>
          <p {...editableProps("subtitle")} className={`${editableProps("subtitle").className} text-sm opacity-90`}>
            {content.subtitle}
          </p>
          <button
            className="rounded-lg px-5 py-2 text-sm font-semibold"
            style={{ backgroundColor: styles.accentColor, color: styles.backgroundColor }}
          >
            <span {...editableProps("buttonText")}>{content.buttonText}</span>
          </button>
        </div>
      );

    case "contact":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <h3 {...editableProps("title")} className={`${editableProps("title").className} mb-2 text-xl font-bold`}>
            {content.title}
          </h3>
          <p {...editableProps("description")} className={`${editableProps("description").className} mb-3 text-sm opacity-80`}>
            {content.description}
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" style={{ color: styles.accentColor }} />
              <span {...editableProps("email")}>{content.email}</span>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" style={{ color: styles.accentColor }} />
              <span {...editableProps("phone")}>{content.phone}</span>
            </span>
          </div>
        </div>
      );

    default:
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding }}>
          <p className="text-sm text-center opacity-50">Bloco: {block.type}</p>
        </div>
      );
  }
};

export default BlockRenderer;
