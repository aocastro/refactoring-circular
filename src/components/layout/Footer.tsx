import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12" role="contentinfo">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <section aria-labelledby="footer-brand">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Circular u-Shar" className="w-7 h-7 object-contain" />
              <span id="footer-brand" className="font-display font-semibold text-foreground">
                Circular <span className="text-accent text-xs">u-Shar</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A plataforma Nº1 em gestão para negócios de moda circular e economia de segunda mão.
            </p>
          </section>

          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="text-sm font-semibold text-foreground mb-3">Navegação</h2>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/planos" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Planos de Loja</Link>
              <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Link to="/consignante" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Painel Consignante</Link>
            </div>
          </nav>

          <nav aria-labelledby="footer-about">
            <h2 id="footer-about" className="text-sm font-semibold text-foreground mb-3">A u-Shar</h2>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre Nós</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Políticas de Privacidade</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Seja um afiliado</a>
            </div>
          </nav>

          <section aria-labelledby="footer-support">
            <h2 id="footer-support" className="text-sm font-semibold text-foreground mb-3">Suporte</h2>
            <div className="space-y-2">
              <a
                href="https://wa.me/+5511982163883?text=Quero%20tirar%20d%C3%BAvidas%20sobre%20o%20Circular%20u-Shar"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Fale Conosco (WhatsApp)
              </a>
              <a href="mailto:contato@u-shar.com.br" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                contato@u-shar.com.br
              </a>
            </div>
          </section>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Todos os direitos reservados © {new Date().getFullYear()} u-Shar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
