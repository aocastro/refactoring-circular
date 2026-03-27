import api from "@/api/axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Users, ToggleLeft, ToggleRight, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { type AdminPlan } from "@/data/admin";
import { toast } from "sonner";

const AdminPlanosContent = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminPlans, setAdminPlans] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_adminPlans = await api.get('/api/admin/plans');
        setAdminPlans(res_adminPlans.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);



  const [plans, setPlans] = useState<AdminPlan[]>(adminPlans);

  useEffect(() => {
    setPlans(adminPlans);
  }, [adminPlans]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    priceMonthly: 0,
    priceYearly: 0,
    features: [""]
  });

  const handleOpenDialog = (plan?: AdminPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        features: [...plan.features]
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        priceMonthly: 0,
        priceYearly: 0,
        features: [""]
      });
    }
    setIsDialogOpen(true);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get('/api/admin/plans');
      setAdminPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  const toggleStatus = async (id: number) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    try {
      const newStatus = plan.status === "ativo" ? "inativo" : "ativo";
      await api.put(`/api/admin/plans/${id}`, { status: newStatus });
      setPlans((prev) =>
        prev.map((p) => p.id === id ? { ...p, status: newStatus } : p)
      );
      toast.success("Status do plano atualizado");
      fetchPlans();
    } catch (err) {
      console.error("Error toggling plan status", err);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, features: formData.features.filter(f => f.trim() !== "") };
      if (editingPlan) {
        await api.put(`/api/admin/plans/${editingPlan.id}`, payload);
        toast.success("Plano atualizado com sucesso");
      } else {
        await api.post('/api/admin/plans', payload);
        toast.success("Plano criado com sucesso");
      }
      setIsDialogOpen(false);
      fetchPlans();
    } catch (err) {
      console.error("Error saving plan:", err);
      toast.error("Erro ao salvar plano");
    }
  };


  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Planos</h2>
          <p className="text-sm text-muted-foreground">Gerencie os planos de assinatura da plataforma</p>
        </div>
        <Button size="sm" onClick={() => handleOpenDialog()}><CreditCard className="mr-2 h-4 w-4" />Novo Plano</Button>
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
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(plan)}>Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus(plan.id)} aria-label={`Alternar status do plano ${plan.name}`}>
                    {plan.status === "ativo" ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Profissional"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceMonthly">Preço Mensal (R$)</Label>
                <Input
                  id="priceMonthly"
                  type="number"
                  value={formData.priceMonthly}
                  onChange={(e) => setFormData({ ...formData, priceMonthly: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceYearly">Preço Anual (R$)</Label>
                <Input
                  id="priceYearly"
                  type="number"
                  value={formData.priceYearly}
                  onChange={(e) => setFormData({ ...formData, priceYearly: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Funcionalidades</Label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Funcionalidade ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    disabled={formData.features.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeature} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Funcionalidade
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlanosContent;
