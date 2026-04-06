import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Smartphone } from "lucide-react";
import { LinkItem, LinktreeConfig } from "@/data/linktree";
import { sanitizeUrl } from "@/lib/utils";

const LinktreePublic = () => {
  const { slug } = useParams();
  const [data, setData] = useState<LinktreeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinktree = async () => {
      try {
        const response = await axios.get(`/api/linktree/${slug}`);
        setData(response.data);
      } catch (error) {
        console.error("Erro ao carregar linktree", error);
        // Fallback para caso de erro ou não encontrado
        setData({
          id: 0,
          slug: slug || "",
          links: [],
          profileImage: "",
          backgroundImage: "",
          backgroundColor: "#f3f4f6",
          buttonColor: "#ffffff",
          buttonTextColor: "#000000"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinktree();
  }, [slug]);

  if (isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center py-16 px-4 sm:px-6 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundColor: data.backgroundColor,
        backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : 'none'
      }}
    >
      <div className="w-full max-w-md flex flex-col items-center gap-6 z-10">
        <div className="h-28 w-28 rounded-full overflow-hidden border-4 bg-background shadow-lg flex items-center justify-center shrink-0" style={{ borderColor: `${data.buttonTextColor}40` }}>
          {data.profileImage ? (
            <img src={data.profileImage} alt={`Perfil de ${slug}`} className="w-full h-full object-cover" />
          ) : (
            <Smartphone className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl tracking-tight drop-shadow-sm" style={{ color: data.buttonTextColor }}>@{slug}</h1>
          <p className="text-sm opacity-90 mt-1 font-medium" style={{ color: data.buttonTextColor }}>Confira nossos links abaixo</p>
        </div>

        <div className="w-full flex flex-col gap-4">
          {data.links && data.links.filter(l => l.ativo).map(link => (
            <a
              key={link.id}
              href={sanitizeUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl shadow-md text-center text-base font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              style={{
                backgroundColor: data.buttonColor,
                color: data.buttonTextColor,
                border: `1px solid ${data.buttonTextColor}20`
              }}
            >
              {link.titulo}
            </a>
          ))}
          {(!data.links || data.links.filter(l => l.ativo).length === 0) && (
            <p className="text-center font-medium mt-8" style={{ color: data.buttonTextColor }}>Nenhum link disponível no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinktreePublic;
