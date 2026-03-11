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
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Minha Conta</h1>
        <p className="text-muted-foreground text-sm">Gerencie suas informações pessoais</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-border bg-card space-y-5"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground font-display">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">Plano Growth • Ativo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Nome
            </label>
            <Input defaultValue="Maria Silva" className="bg-secondary border-border" readOnly />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" /> E-mail
            </label>
            <Input defaultValue={user.email} className="bg-secondary border-border" readOnly />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Telefone
            </label>
            <Input defaultValue="(11) 98765-4321" className="bg-secondary border-border" readOnly />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Cidade
            </label>
            <Input defaultValue="São Paulo, SP" className="bg-secondary border-border" readOnly />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Store className="h-3.5 w-3.5 text-muted-foreground" /> Nome da Loja
            </label>
            <Input defaultValue="Brechó da Maria" className="bg-secondary border-border" readOnly />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button className="bg-gradient-primary text-primary-foreground rounded-lg" disabled>
            Salvar Alterações
          </Button>
          <Button variant="outline" className="border-border rounded-lg" disabled>
            Alterar Senha
          </Button>
        </div>
      </motion.div>

      {/* Subscription info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <h3 className="font-semibold text-foreground mb-4">Plano Atual</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
          <div>
            <p className="font-display font-bold text-foreground">Growth</p>
            <p className="text-sm text-muted-foreground">R$ 149,90/mês • Próximo pagamento: 15/01/2026</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">Ativo</span>
        </div>
      </motion.div>
    </div>
  );
};

export default MyAccountContent;
