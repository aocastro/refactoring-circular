import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Star, Mail, Phone, ArrowRight, Send, Play, Image } from "lucide-react";
import { Link } from "react-router-dom";
import type { EditorBlock } from "@/components/dashboard/store-editor/types";

interface Props {
  block: EditorBlock;
  slug: string;
}

const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace(".", ",")}`;

const StorefrontBlockRenderer = ({ block, slug }: Props) => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [storeProducts, setstoreProducts] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_storeProducts = await api.get('/api/store/products');
        setStoreProducts(res_storeProducts.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);



  const { styles, content } = block;

  switch (block.type) {

    case "about":
      if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
        <section style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-2xl font-bold">{content.title}</h2>
            <p className="text-base leading-relaxed opacity-80">{content.description}</p>
          </div>
        </section>
      );

    case "image-gallery":
      return (
        <section style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-2xl font-bold">{content.title}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {["image1", "image2", "image3", "image4"].map((key) => (
                <div key={key} className="aspect-[4/3] overflow-hidden rounded-xl">
                  {content[key] ? (
                    <img src={content[key]} alt="" className="h-full w-full object-cover transition-transform hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <Image className="h-8 w-8 opacity-30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "video":
      return (
        <section style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-2 text-2xl font-bold">{content.title}</h2>
            <p className="mb-4 text-sm opacity-80">{content.description}</p>
            <div className="aspect-video overflow-hidden rounded-xl">
              {content.videoUrl ? (
                <iframe
                  src={content.videoUrl}
                  title="Video"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-900">
                  <Play className="h-12 w-12 text-white opacity-40" />
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "newsletter":
      return (
        <section
          style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}
          className="text-center"
        >
          <div className="mx-auto max-w-md">
            <Send className="mx-auto mb-3 h-8 w-8" style={{ color: styles.accentColor }} />
            <h2 className="mb-2 text-2xl font-bold">{content.title}</h2>
            <p className="mb-4 text-sm opacity-90">{content.subtitle}</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={content.placeholder || "Seu e-mail"}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm"
                style={{ borderColor: styles.accentColor + "66", backgroundColor: "transparent", color: styles.textColor }}
              />
              <button
                className="rounded-lg px-5 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: styles.accentColor, color: styles.backgroundColor }}
              >
                {content.buttonText || "Inscrever"}
              </button>
            </div>
          </div>
        </section>
      );



    case "testimonials":
      return (
        <section style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-2xl font-bold">{content.title}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {["Ana Silva", "Carlos Santos", "Maria Oliveira"].map((name) => (
                <div key={name} className="rounded-xl border p-4" style={{ borderColor: styles.accentColor + "33" }}>
                  <div className="mb-2 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic opacity-70">"Excelente experiência de compra! Recomendo muito."</p>
                  <p className="mt-3 text-sm font-semibold">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <section
          style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}
          className="text-center"
        >
          <h2 className="mb-2 text-2xl font-bold">{content.title}</h2>
          <p className="mb-4 text-base opacity-90">{content.subtitle}</p>
          <button
            className="rounded-lg px-6 py-3 text-sm font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: styles.accentColor, color: styles.backgroundColor }}
          >
            {content.buttonText}
          </button>
        </section>
      );

    case "contact":
      return (
        <section style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-2 text-2xl font-bold">{content.title}</h2>
            <p className="mb-4 text-sm opacity-80">{content.description}</p>
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:gap-6">
              <span className="flex items-center gap-2">
                <Mail className="h-5 w-5" style={{ color: styles.accentColor }} />
                {content.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-5 w-5" style={{ color: styles.accentColor }} />
                {content.phone}
              </span>
            </div>
          </div>
        </section>
      );

    case "text":


      return (
        <section style={{ backgroundColor: styles.backgroundColor, color: styles.textColor, padding: styles.padding, fontFamily: styles.fontFamily }}>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-2 text-2xl font-bold">{content.title}</h2>
            <p className="text-base leading-relaxed opacity-80">{content.description}</p>
          </div>
        </section>
      );

    default:
      return null;
  }
};

export default StorefrontBlockRenderer;
