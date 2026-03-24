import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Store, CreditCard, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MyAccountContentProps {
  user: { name: string; email: string };
}

const MyAccountContent = ({ user }: MyAccountContentProps) => {
  const [storeConfig, setStoreConfig] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const config = JSON.parse(localStorage.getItem("storeConfig") || "{}");
    setStoreConfig(config);
  }, []);

  const isTrial = storeConfig?.trialEndsAt && storeConfig.trialEndsAt > Date.now();
  const trialDays = isTrial ? Math.ceil((storeConfig.trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

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
            <p id="account-profile-description" className="text-sm text-muted-foreground">
              Plano {storeConfig?.planName || "Growth"} • {isTrial ? "Trial de 7 dias" : "Ativo"}
            </p>
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
            <Input defaultValue={storeConfig?.nome || "Minha Loja"} className="border-border bg-secondary" readOnly aria-labelledby="account-store-label" />
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
        <div className={`flex items-center justify-between rounded-lg border p-4 ${isTrial ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/50"}`}>
          <div>
            <p className="font-display font-bold text-foreground">{storeConfig?.planName || "Growth"}</p>
            {isTrial ? (
              <p className="text-sm text-muted-foreground">Período de teste • {trialDays} dia(s) restantes</p>
            ) : (
              <p className="text-sm text-muted-foreground">R$ 149,90/mês • Próximo pagamento: 15/01/2026</p>
            )}
          </div>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${isTrial ? "bg-primary/20 text-primary" : "bg-success/10 text-success"}`}>
            {isTrial ? "Em Teste" : "Ativo"}
          </span>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-6"
        aria-labelledby="account-payment-heading"
      >
        <h3 id="account-payment-heading" className="mb-4 font-semibold text-foreground">Método de Pagamento</h3>
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-secondary/20">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Nenhum cartão cadastrado</p>
          <p className="text-xs text-muted-foreground mb-4 text-center">Adicione um método de pagamento para evitar interrupções após o trial.</p>
          <Button variant="outline" className="gap-2 rounded-lg border-primary text-primary hover:bg-primary/5">
            <Plus className="h-4 w-4" />
            Adicionar Cartão
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default MyAccountContent;
