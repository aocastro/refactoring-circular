import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MyAccountContentProps {
  user: { name: string; email: string };
}

const MyAccountContent = ({ user }: MyAccountContentProps) => {
  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h2 className="font-display text-2xl font-bold text-foreground">Minha Conta</h2>
        <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais com estrutura semântica e campos somente leitura.</p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 rounded-xl border border-border bg-card p-6"
        aria-labelledby="account-profile-heading"
        aria-describedby="account-profile-description"
      >
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary font-display text-2xl font-bold text-primary-foreground">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 id="account-profile-heading" className="font-semibold text-foreground">{user.name}</h3>
            <p id="account-profile-description" className="text-sm text-muted-foreground">Plano Growth • Ativo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <section aria-labelledby="account-name-label">
            <label id="account-name-label" className="mb-1.5 flex text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted-foreground" /> Nome</span>
            </label>
            <Input defaultValue="Maria Silva" className="border-border bg-secondary" readOnly aria-labelledby="account-name-label" />
          </section>
          <section aria-labelledby="account-email-label">
            <label id="account-email-label" className="mb-1.5 flex text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> E-mail</span>
            </label>
            <Input defaultValue={user.email} className="border-border bg-secondary" readOnly aria-labelledby="account-email-label" />
          </section>
          <section aria-labelledby="account-phone-label">
            <label id="account-phone-label" className="mb-1.5 flex text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> Telefone</span>
            </label>
            <Input defaultValue="(11) 98765-4321" className="border-border bg-secondary" readOnly aria-labelledby="account-phone-label" />
          </section>
          <section aria-labelledby="account-city-label">
            <label id="account-city-label" className="mb-1.5 flex text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Cidade</span>
            </label>
            <Input defaultValue="São Paulo, SP" className="border-border bg-secondary" readOnly aria-labelledby="account-city-label" />
          </section>
          <section className="sm:col-span-2" aria-labelledby="account-store-label">
            <label id="account-store-label" className="mb-1.5 flex text-sm font-medium text-foreground">
              <span className="flex items-center gap-2"><Store className="h-3.5 w-3.5 text-muted-foreground" /> Nome da Loja</span>
            </label>
            <Input defaultValue="Brechó da Maria" className="border-border bg-secondary" readOnly aria-labelledby="account-store-label" />
          </section>
        </div>

        <div className="flex gap-3 pt-2">
          <Button className="rounded-lg bg-gradient-primary text-primary-foreground" disabled>
            Salvar Alterações
          </Button>
          <Button variant="outline" className="rounded-lg border-border" disabled>
            Alterar Senha
          </Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-card p-6"
        aria-labelledby="account-plan-heading"
      >
        <h3 id="account-plan-heading" className="mb-4 font-semibold text-foreground">Plano Atual</h3>
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
          <div>
            <p className="font-display font-bold text-foreground">Growth</p>
            <p className="text-sm text-muted-foreground">R$ 149,90/mês • Próximo pagamento: 15/01/2026</p>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">Ativo</span>
        </div>
      </motion.section>
    </div>
  );
};

export default MyAccountContent;
