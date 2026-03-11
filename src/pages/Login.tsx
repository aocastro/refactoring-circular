import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const MOCK_USER = {
  email: "maria_demo@uorak.com",
  password: "Senha@123",
  name: "Maria",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        localStorage.setItem("user", JSON.stringify({ name: MOCK_USER.name, email: MOCK_USER.email }));
        navigate("/dashboard");
      } else {
        toast({
          title: "Erro no login",
          description: "E-mail ou senha incorretos.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(270_80%_60%/0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(180_100%_50%/0.05)_0%,transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold font-display">
              C
            </div>
          </Link>
          <h1 className="text-2xl font-bold font-display text-foreground mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-sm">Faça login para acessar seu painel</p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-card shadow-card">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-primary-foreground py-5 rounded-xl"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Não tem conta?{" "}
              <Link to="/planos" className="text-accent hover:underline">Registre-se</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
