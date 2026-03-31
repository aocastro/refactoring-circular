import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/layout/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSuccess(true);
      toast({
        title: "E-mail enviado",
        description: "As instruções para redefinir sua senha foram enviadas para o seu e-mail.",
      });
      setLoading(false);
    }, 800);
  };

  return (
    <AuthLayout>
      <header className="mb-8 text-center sm:text-left">
        <h1 id="forgot-password-heading" className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
          Recuperar senha
        </h1>
        <p id="forgot-password-subtitle" className="text-sm text-gray-500 dark:text-gray-400">
          Digite seu e-mail para receber as instruções de recuperação.
        </p>
      </header>

      <div className="bg-white dark:bg-slate-950">
        {!success ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                E-mail
              </label>
              <div className="relative">
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="E-mail cadastrado"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 border-b-2 border-gray-200 dark:border-gray-800 bg-transparent px-0 py-2 rounded-none focus-visible:ring-0 focus-visible:border-[#4C1D95] dark:focus-visible:border-purple-400 transition-colors shadow-none text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-full bg-[#4C1D95] dark:bg-purple-600 py-6 text-white hover:bg-[#3b1575] dark:hover:bg-purple-700 transition-colors text-base font-semibold" aria-busy={loading}>
              {loading ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>
        ) : (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-6 text-center border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">E-mail enviado com sucesso!</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#4C1D95] dark:text-purple-400 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
