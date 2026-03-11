import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Smartphone, KeyRound } from "lucide-react";
import logo from "@/assets/logo.png";
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
    <div className="min-h-screen bg-background flex relative">
      {/* Left side - illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_80%_60%/0.08)_0%,transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-center max-w-md"
        >
          <h2 className="text-3xl font-bold font-display text-accent mb-3">
            Olá, que bom ter você aqui :)
          </h2>
          <p className="text-muted-foreground mb-10">
            Faça login na sua conta e comece a comprar!
          </p>

          {/* Phone illustration */}
          <div className="relative mx-auto w-48">
            <div className="w-48 h-80 rounded-3xl border-4 border-primary/30 bg-card relative overflow-hidden shadow-card">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-border" />
              <div className="mt-12 px-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 rounded bg-primary/20 flex items-center px-2">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(n => (
                        <div key={n} className="w-2 h-2 rounded-full bg-primary/60" />
                      ))}
                    </div>
                  </div>
                  <div className="h-6 rounded bg-primary/20 flex items-center px-2">
                    <div className="flex gap-1">
                      {[1,2,3,4,5,6].map(n => (
                        <div key={n} className="w-2 h-2 rounded-full bg-primary/60" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-8 rounded-lg bg-gradient-primary" />
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -right-6 top-16 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-accent" />
            </div>
            <div className="absolute -left-6 bottom-20 w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Mail className="h-5 w-5 text-success" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(270_80%_60%/0.06)_0%,transparent_50%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img src={logo} alt="Circular u-Shar" className="w-10 h-10 object-contain" />
            </Link>
            <h1 className="text-2xl font-bold font-display text-primary mb-2">Login</h1>
            <p className="text-muted-foreground text-sm">
              Não tem conta?{" "}
              <Link to="/planos" className="text-accent hover:underline font-medium">Registre-se</Link>
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-border bg-card shadow-card">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">E-mail:</label>
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

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Social login buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-border rounded-xl py-5 gap-3" type="button">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </Button>
              <Button variant="outline" className="w-full border-border rounded-xl py-5 gap-3" type="button">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Entrar com LinkedIn
              </Button>
            </div>

            {/* Forgot password */}
            <div className="mt-6 text-center">
              <a href="#" className="text-xs text-accent hover:underline">Esqueci minha senha</a>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Demo:</strong> maria_demo@uorak.com / Senha@123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
