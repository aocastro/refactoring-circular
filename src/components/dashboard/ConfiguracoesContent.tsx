import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, CreditCard, Truck, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Props {
  defaultTab?: string;
}

const ConfiguracoesContent = ({ defaultTab = "geral" }: Props) => {
  const [storeName, setStoreName] = useState("Fashion Store");
  const [storeEmail, setStoreEmail] = useState("contato@fashionstore.com");
  const [storePhone, setStorePhone] = useState("(11) 99999-9999");
  const [currency, setCurrency] = useState("BRL");
  const [pixEnabled, setPixEnabled] = useState(true);
  const [creditEnabled, setCreditEnabled] = useState(true);
  const [debitEnabled, setDebitEnabled] = useState(true);
  const [boletoEnabled, setBoletoEnabled] = useState(false);
  const [freeShippingMin, setFreeShippingMin] = useState("199");
  const [sedexEnabled, setSedexEnabled] = useState(true);
  const [pacEnabled, setPacEnabled] = useState(true);
  const [localPickup, setLocalPickup] = useState(true);

  const handleSave = () => toast.success("Configurações salvas com sucesso!");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm">Gerencie as configurações da sua loja</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="geral" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4 mr-2" />Geral
          </TabsTrigger>
          <TabsTrigger value="pagamento" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="h-4 w-4 mr-2" />Pagamento
          </TabsTrigger>
          <TabsTrigger value="entrega" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Truck className="h-4 w-4 mr-2" />Entrega
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Loja</Label>
                <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-secondary border-border" />
              </div>
            </div>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="pagamento" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h3 className="font-semibold text-foreground">Métodos de Pagamento</h3>
            {[
              { label: "PIX", enabled: pixEnabled, toggle: setPixEnabled },
              { label: "Cartão de Crédito", enabled: creditEnabled, toggle: setCreditEnabled },
              { label: "Cartão de Débito", enabled: debitEnabled, toggle: setDebitEnabled },
              { label: "Boleto Bancário", enabled: boletoEnabled, toggle: setBoletoEnabled },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.enabled ? "Ativado" : "Desativado"}</p>
                </div>
                <Switch checked={m.enabled} onCheckedChange={m.toggle} />
              </div>
            ))}
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="entrega" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-2">
              <Label>Frete grátis a partir de (R$)</Label>
              <Input value={freeShippingMin} onChange={(e) => setFreeShippingMin(e.target.value)} className="bg-secondary border-border w-40" />
            </div>
            <h3 className="font-semibold text-foreground">Métodos de Entrega</h3>
            {[
              { label: "SEDEX", enabled: sedexEnabled, toggle: setSedexEnabled },
              { label: "PAC", enabled: pacEnabled, toggle: setPacEnabled },
              { label: "Retirada na Loja", enabled: localPickup, toggle: setLocalPickup },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <p className="text-sm font-medium text-foreground">{m.label}</p>
                <Switch checked={m.enabled} onCheckedChange={m.toggle} />
              </div>
            ))}
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesContent;
