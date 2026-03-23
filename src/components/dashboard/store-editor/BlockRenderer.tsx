import { Star, Mail, Phone, ArrowRight, Image, Play, Send } from "lucide-react";
import type { EditorBlock } from "./types";

interface Props {
  block: EditorBlock;
  isSelected: boolean;
  onContentChange: (key: string, value: string) => void;
}

const BlockRenderer = ({ block, isSelected, onContentChange }: Props) => {
  const { styles, content } = block;

  const editableProps = (key: string) => ({
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => onContentChange(key, e.currentTarget.textContent || ""),
    className: `outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded px-1 ${isSelected ? "hover:bg-black/5 dark:hover:bg-white/10" : ""}`,
  });

  switch (block.type) {
    case "hero-banner":
      return (
        <div
          style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}
          className="relative flex min-h-[220px] flex-col items-center justify-center gap-3 text-center"
        >
          <h2 {...editableProps("title")} className={`${editableProps("title").className} text-2xl font-bold md:text-3xl`}>
            {content.title}
          </h2>
          <p {...editableProps("subtitle")} className={`${editableProps("subtitle").className} max-w-lg text-sm opacity-90 md:text-base`}>
            {content.subtitle}
          </p>
          <button
            className="mt-2 rounded-lg px-5 py-2 text-sm font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: styles.accentColor, color: styles.backgroundColor }}
          >
            <span {...editableProps("buttonText")}>{content.buttonText}</span>
            <ArrowRight className="ml-2 inline h-4 w-4" />
          </button>
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

    case "products":
      return (
        <div style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <h3 {...editableProps("title")} className={`${editableProps("title").className} mb-1 text-xl font-bold`}>
            {content.title}
          </h3>
          <p {...editableProps("subtitle")} className={`${editableProps("subtitle").className} mb-4 text-sm opacity-70`}>
            {content.subtitle}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border" style={{ borderColor: styles.accentColor + "33" }}>
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                <div className="p-2">
                  <p className="text-xs font-medium">Produto {i}</p>
                  <p className="text-xs font-bold" style={{ color: styles.accentColor }}>R$ {(49.9 * i).toFixed(2)}</p>
                </div>
              </div>
            ))}
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
