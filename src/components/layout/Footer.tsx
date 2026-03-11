import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold font-display text-xs">
              C
            </div>
            <span className="font-display font-semibold text-foreground">
              Circular <span className="text-accent text-xs">u-Shar</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/planos" className="hover:text-foreground transition-colors">Planos</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/consignante" className="hover:text-foreground transition-colors">Consignante</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Circular u-Shar. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
