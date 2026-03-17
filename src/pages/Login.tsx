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
    <div className="relative flex min-h-screen bg-background">
      <aside className="relative hidden items-center justify-center p-12 lg:flex lg:w-1/2" aria-label="Apresentação da plataforma">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_80%_60%/0.08)_0%,transparent_60%)]" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 max-w-md text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-accent">Olá, que bom ter você aqui :)</h2>
          <p className="mb-10 text-muted-foreground">Faça login na sua conta e comece a comprar!</p>

          <div className="relative mx-auto w-48" aria-hidden="true">
            <div className="relative h-80 w-48 overflow-hidden rounded-3xl border-4 border-primary/30 bg-card shadow-card">
              <div className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-border" />
              <div className="mt-12 space-y-4 px-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                  <Smartphone className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex h-6 items-center rounded bg-primary/20 px-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-2 w-2 rounded-full bg-primary/60" />
                      ))}
                    </div>
                  </div>
                  <div className="flex h-6 items-center rounded bg-primary/20 px-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-2 w-2 rounded-full bg-primary/60" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-8 rounded-lg bg-gradient-primary" />
              </div>
            </div>
            <div className="absolute -right-6 top-16 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <KeyRound className="h-5 w-5 text-accent" />
            </div>
            <div className="absolute -left-6 bottom-20 flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
              <Mail className="h-5 w-5 text-success" />
            </div>
          </div>
        </motion.div>
      </aside>

      <main id="main-content" tabIndex={-1} className="relative flex flex-1 items-center justify-center p-4 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(270_80%_60%/0.06)_0%,transparent_50%)]" />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
          aria-labelledby="login-heading"
          aria-describedby="login-subtitle"
        >
          <header className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2" aria-label="Voltar para a página inicial">
              <img src={logo} alt="Circular u-Shar" className="h-10 w-10 object-contain" />
            </Link>
            <h1 id="login-heading" className="mb-2 font-display text-2xl font-bold text-primary">Login</h1>
            <p id="login-subtitle" className="text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link to="/planos" className="font-medium text-accent hover:underline">Registre-se</Link>
            </p>
          </header>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <form onSubmit={handleLogin} className="space-y-5" aria-describedby="demo-credentials">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border bg-secondary pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-border bg-secondary pl-10 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                    aria-controls="login-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-primary py-5 text-primary-foreground" aria-busy={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">ou</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-3" aria-label="Outras opções de entrada">
              <Button variant="outline" className="w-full gap-3 rounded-xl border-border py-5" type="button" aria-label="Entrar com Google">
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </Button>
              <Button variant="outline" className="w-full gap-3 rounded-xl border-border py-5" type="button" aria-label="Entrar com LinkedIn">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Entrar com LinkedIn
              </Button>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-xs text-accent hover:underline" aria-label="Recuperar senha">Esqueci minha senha</a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEmail(MOCK_USER.email);
              setPassword(MOCK_USER.password);
            }}
            className="mt-4 w-full cursor-pointer rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
            aria-describedby="demo-credentials"
          >
            <p id="demo-credentials" className="text-center text-xs text-muted-foreground">
              <strong className="text-foreground">Demo:</strong> maria_demo@uorak.com / Senha@123
            </p>
          </button>
        </motion.section>
      </main>
    </div>
  );
};

export default Login;
