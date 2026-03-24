import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const ADMIN_CREDENTIALS = {
  email: "admin@ushar.com",
  password: "Admin@2025",
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (attempts >= 5) {
      toast.error("Muitas tentativas. Tente novamente em alguns minutos.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem("adminAuth", JSON.stringify({ email, role: "admin", ts: Date.now() }));
        toast.success("Bem-vindo ao painel administrativo!");
        navigate("/admin/painel");
      } else {
        setAttempts((a) => a + 1);
        toast.error("Credenciais inválidas. Verifique e-mail e senha.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="border-border shadow-lg">
          <CardHeader className="items-center space-y-4 pb-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Circular u-Shar" className="h-10 w-10 object-contain" />
              <div>
                <CardTitle className="text-xl text-foreground">Admin Panel</CardTitle>
                <p className="text-xs text-muted-foreground">Circular u-Shar</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
              <Shield className="h-4 w-4" />
              Acesso restrito a administradores
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium text-foreground">E-mail</label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@ushar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium text-foreground">Senha</label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || attempts >= 5}>
                {loading ? "Verificando..." : "Entrar"}
              </Button>

              {attempts > 0 && attempts < 5 && (
                <p className="text-center text-xs text-destructive">
                  {5 - attempts} tentativa(s) restante(s)
                </p>
              )}
            </form>

            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Credenciais de demonstração:</p>
              <p className="mt-1 font-mono text-xs text-foreground">admin@ushar.com</p>
              <p className="font-mono text-xs text-foreground">Admin@2025</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
