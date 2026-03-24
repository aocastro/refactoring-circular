import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Users, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminPlans, type AdminPlan } from "@/data/admin";
import { toast } from "sonner";

const AdminPlanosContent = () => {
  const [plans, setPlans] = useState<AdminPlan[]>(adminPlans);

  const toggleStatus = (id: number) => {
    setPlans((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: p.status === "ativo" ? "inativo" : "ativo" } : p)
    );
    toast.success("Status do plano atualizado");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Planos</h2>
          <p className="text-sm text-muted-foreground">Gerencie os planos de assinatura da plataforma</p>
        </div>
        <Button size="sm"><CreditCard className="mr-2 h-4 w-4" />Novo Plano</Button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={plan.status === "inativo" ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <Badge variant={plan.status === "ativo" ? "default" : "secondary"}>{plan.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">R$ {plan.priceMonthly}</span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>
                <p className="text-xs text-muted-foreground">ou R$ {plan.priceYearly}/ano</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{plan.subscribers} assinantes</span>
                </div>

                <ul className="space-y-1 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="text-muted-foreground">• {f}</li>
                  ))}
                </ul>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus(plan.id)} aria-label={`Alternar status do plano ${plan.name}`}>
                    {plan.status === "ativo" ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPlanosContent;
