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
      <header>
        <h2 className="font-display text-2xl font-bold text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground">Gerencie as configurações da sua loja com navegação por abas, formulários semânticos e descrições acessíveis.</p>
      </header>

      <Tabs defaultValue={defaultTab} className="w-full" aria-label="Seções de configurações da loja">
        <TabsList className="border border-border bg-secondary">
          <TabsTrigger value="geral" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="mr-2 h-4 w-4" />Geral
          </TabsTrigger>
          <TabsTrigger value="pagamento" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="mr-2 h-4 w-4" />Pagamento
          </TabsTrigger>
          <TabsTrigger value="entrega" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Truck className="mr-2 h-4 w-4" />Entrega
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-6">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 rounded-xl border border-border bg-card p-6" aria-labelledby="config-general-heading" aria-describedby="config-general-description">
            <div>
              <h3 id="config-general-heading" className="font-semibold text-foreground">Dados gerais da loja</h3>
              <p id="config-general-description" className="text-sm text-muted-foreground">Atualize nome, e-mail, telefone e moeda principal da operação.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="config-store-name">Nome da Loja</Label>
                <Input id="config-store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="border-border bg-secondary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config-store-email">E-mail</Label>
                <Input id="config-store-email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="border-border bg-secondary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config-store-phone">Telefone</Label>
                <Input id="config-store-phone" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="border-border bg-secondary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config-store-currency">Moeda</Label>
                <Input id="config-store-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="border-border bg-secondary" />
              </div>
            </div>
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Salvar</Button>
          </motion.section>
        </TabsContent>

        <TabsContent value="pagamento" className="mt-6">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 rounded-xl border border-border bg-card p-6" aria-labelledby="config-payment-heading" aria-describedby="config-payment-description">
            <div>
              <h3 id="config-payment-heading" className="font-semibold text-foreground">Métodos de pagamento</h3>
              <p id="config-payment-description" className="text-sm text-muted-foreground">Ative ou desative as formas de pagamento disponíveis para seus clientes.</p>
            </div>
            {[
              { label: "PIX", enabled: pixEnabled, toggle: setPixEnabled },
              { label: "Cartão de Crédito", enabled: creditEnabled, toggle: setCreditEnabled },
              { label: "Cartão de Débito", enabled: debitEnabled, toggle: setDebitEnabled },
              { label: "Boleto Bancário", enabled: boletoEnabled, toggle: setBoletoEnabled },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between border-b border-border py-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.enabled ? "Ativado" : "Desativado"}</p>
                </div>
                <Switch checked={m.enabled} onCheckedChange={m.toggle} aria-label={`Alternar método ${m.label}`} />
              </div>
            ))}
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Salvar</Button>
          </motion.section>
        </TabsContent>

        <TabsContent value="entrega" className="mt-6">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 rounded-xl border border-border bg-card p-6" aria-labelledby="config-delivery-heading" aria-describedby="config-delivery-description">
            <div>
              <h3 id="config-delivery-heading" className="font-semibold text-foreground">Métodos de entrega</h3>
              <p id="config-delivery-description" className="text-sm text-muted-foreground">Defina regras de frete grátis e habilite modalidades de entrega.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="config-free-shipping">Frete grátis a partir de (R$)</Label>
              <Input id="config-free-shipping" value={freeShippingMin} onChange={(e) => setFreeShippingMin(e.target.value)} className="w-40 border-border bg-secondary" />
            </div>
            {[
              { label: "SEDEX", enabled: sedexEnabled, toggle: setSedexEnabled },
              { label: "PAC", enabled: pacEnabled, toggle: setPacEnabled },
              { label: "Retirada na Loja", enabled: localPickup, toggle: setLocalPickup },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between border-b border-border py-3 last:border-0">
                <p className="text-sm font-medium text-foreground">{m.label}</p>
                <Switch checked={m.enabled} onCheckedChange={m.toggle} aria-label={`Alternar entrega ${m.label}`} />
              </div>
            ))}
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Salvar</Button>
          </motion.section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesContent;
