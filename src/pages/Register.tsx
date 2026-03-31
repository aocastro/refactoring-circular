import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/layout/AuthLayout";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos de uso para criar uma conta.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Create user and log them in
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const newUser = { name, email, password };
      localStorage.setItem("registeredUsers", JSON.stringify([...registeredUsers, newUser]));
      localStorage.setItem("user", JSON.stringify({ name: newUser.name, email: newUser.email }));

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo(a) ao Circular u-Shar.",
      });
      navigate("/dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <AuthLayout>
      <header className="mb-8 text-center sm:text-left">
        <h1 id="register-heading" className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
          Crie sua conta
        </h1>
        <p id="register-subtitle" className="text-sm text-gray-500 dark:text-gray-400">
          Comece a gerenciar o seu brechó de forma fácil.
        </p>
      </header>

      <div className="bg-white dark:bg-slate-950">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome Completo
            </label>
            <div className="relative">
              <Input
                id="register-name"
                type="text"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-0 border-b-2 border-gray-200 dark:border-gray-800 bg-transparent px-0 py-2 rounded-none focus-visible:ring-0 focus-visible:border-[#4C1D95] dark:focus-visible:border-purple-400 transition-colors shadow-none text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <div className="relative">
              <Input
                id="register-email"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 border-b-2 border-gray-200 dark:border-gray-800 bg-transparent px-0 py-2 rounded-none focus-visible:ring-0 focus-visible:border-[#4C1D95] dark:focus-visible:border-purple-400 transition-colors shadow-none text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha
            </label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 border-b-2 border-gray-200 dark:border-gray-800 bg-transparent px-0 py-2 rounded-none focus-visible:ring-0 focus-visible:border-[#4C1D95] dark:focus-visible:border-purple-400 transition-colors shadow-none pr-10 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                aria-controls="register-password"
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="flex items-start pt-2">
            <div className="flex h-5 items-center">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#4C1D95] focus:ring-[#4C1D95] dark:border-gray-700 dark:bg-slate-900"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-500 dark:text-gray-400">
                Eu concordo com os{" "}
                <a href="#" className="font-medium text-[#4C1D95] dark:text-purple-400 hover:underline">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="#" className="font-medium text-[#4C1D95] dark:text-purple-400 hover:underline">
                  Política de Privacidade
                </a>.
              </label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-full bg-[#4C1D95] dark:bg-purple-600 py-6 text-white hover:bg-[#3b1575] dark:hover:bg-purple-700 transition-colors text-base font-semibold" aria-busy={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Já possui uma conta? </span>
          <Link to="/login" className="font-semibold text-[#4C1D95] dark:text-purple-400 hover:underline">
            Entrar
          </Link>
        </div>

        <div className="my-8 flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-950 px-2">Ou registre-se com</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="space-y-4" aria-label="Outras opções de registro">
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
    </AuthLayout>
  );
};

export default Register;
