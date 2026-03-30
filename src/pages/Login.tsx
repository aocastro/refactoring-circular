import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Package, Calendar, Users, LineChart } from "lucide-react";
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
      // Check demo user first
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        localStorage.setItem("user", JSON.stringify({ name: MOCK_USER.name, email: MOCK_USER.email }));
        navigate("/dashboard");
        setLoading(false);
        return;
      }

      // Check registered users (from store creation wizard)
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const matchedUser = registeredUsers.find(
        (u: { email: string; password: string }) => u.email === email && u.password === password
      );

      if (matchedUser) {
        localStorage.setItem("user", JSON.stringify({ name: matchedUser.name, email: matchedUser.email }));
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
      <aside className="relative hidden items-center justify-center p-12 lg:flex lg:w-1/2 bg-[#4C1D95]" aria-label="Apresentação da plataforma">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 w-full max-w-2xl text-left text-white flex flex-col h-full justify-center space-y-16">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Circular u-Shar Logo" className="h-32 object-contain" />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              A plataforma completa<br />para o seu brechó
            </h1>
            <p className="text-lg text-white/80">
              Gerencie vendas, estoque, agendamentos e afiliados em um só lugar.
            </p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <div className="flex items-center gap-4 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg"><Package className="h-5 w-5" /></div>
              <span>Controle de estoque e PDV integrado</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg"><Calendar className="h-5 w-5" /></div>
              <span>Agendamentos e reservas online</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg"><Users className="h-5 w-5" /></div>
              <span>Programa de afiliados e consignados</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg"><LineChart className="h-5 w-5" /></div>
              <span>Relatórios e indicadores em tempo real</span>
            </div>
          </div>

          <div className="flex justify-between max-w-md mx-auto w-full pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Lojas ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">250+ toneladas</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">CO2 evitado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Satisfação</div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10">
            <p className="italic text-white/80 mb-6">
              "Com a Circular organizei todo meu estoque e tripliquei as vendas online em menos de 6 meses."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-400 flex items-center justify-center font-bold text-white">
                M
              </div>
              <div>
                <div className="font-semibold text-sm">Maria Oliveira</div>
                <div className="text-xs text-white/60">Brechó Vintage SP</div>
              </div>
            </div>
          </div>
        </motion.div>
      </aside>

      <main id="main-content" tabIndex={-1} className="relative flex flex-1 items-center justify-center p-4 lg:p-12 bg-white dark:bg-slate-950">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
          aria-labelledby="login-heading"
          aria-describedby="login-subtitle"
        >
          <header className="mb-8 text-center sm:text-left">
            <h1 id="login-heading" className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              Bem vindo(a) ao Circular u-Shar
            </h1>
            <p id="login-subtitle" className="text-sm text-gray-500 dark:text-gray-400">
              Acesse a sua conta ou cadastre-se.
            </p>
          </header>

          <div className="bg-white dark:bg-slate-950">
            <form onSubmit={handleLogin} className="space-y-6" aria-describedby="demo-credentials">
              <div className="space-y-1">
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail ou Usuário
                </label>
                <div className="relative">
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="E-mail ou Usuário"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 border-b-2 border-gray-200 dark:border-gray-800 bg-transparent px-0 py-2 rounded-none focus-visible:ring-0 focus-visible:border-[#4C1D95] dark:focus-visible:border-purple-400 transition-colors shadow-none text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 border-b-2 border-gray-200 dark:border-gray-800 bg-transparent px-0 py-2 rounded-none focus-visible:ring-0 focus-visible:border-[#4C1D95] dark:focus-visible:border-purple-400 transition-colors shadow-none pr-10 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                    aria-controls="login-password"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-sm font-medium text-[#4C1D95] dark:text-purple-400 hover:underline" aria-label="Recuperar senha">
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-full bg-[#4C1D95] dark:bg-purple-600 py-6 text-white hover:bg-[#3b1575] dark:hover:bg-purple-700 transition-colors text-base font-semibold" aria-busy={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Ainda não possui uma conta? </span>
              <Link to="/planos" className="font-semibold text-[#4C1D95] dark:text-purple-400 hover:underline">
                Cadastre-se
              </Link>
            </div>

            <div className="my-8 flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-950 px-2">Ou continue com</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="space-y-4" aria-label="Outras opções de entrada">
              <Button variant="outline" className="w-full bg-white dark:bg-slate-950 gap-3 rounded-full border border-gray-300 dark:border-gray-800 py-6 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-gray-100" type="button" aria-label="Entrar com Google">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full bg-white dark:bg-slate-950 gap-3 rounded-full border border-gray-300 dark:border-gray-800 py-6 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-gray-100" type="button" aria-label="Entrar com LinkedIn">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </Button>
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
