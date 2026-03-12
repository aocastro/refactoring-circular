import { useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Calendar, Plus, Clock, DollarSign, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  defaultTab?: string;
}

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  data: string;
  hora: string;
  status: string;
}

interface Servico {
  id: number;
  nome: string;
  duracao: string;
  preco: string;
  ativo: boolean;
}

const agendamentoSchema = z.object({
  cliente: z.string().trim().min(1, "Nome do cliente é obrigatório").max(100),
  servico: z.string().trim().min(1, "Selecione um serviço"),
  data: z.string().trim().min(1, "Data é obrigatória"),
  hora: z.string().trim().min(1, "Hora é obrigatória"),
});

const servicoSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  duracao: z.string().trim().min(1, "Duração é obrigatória"),
  preco: z.string().trim().min(1, "Preço é obrigatório"),
});

const statusColors: Record<string, string> = {
  confirmado: "bg-success/10 text-success",
  pendente: "bg-warning/10 text-warning",
  cancelado: "bg-destructive/10 text-destructive",
};

const ServicosContent = ({ defaultTab = "agendamentos" }: Props) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    { id: 1, cliente: "Maria Silva", servico: "Ajuste de Vestido", data: "15/03/2026", hora: "10:00", status: "confirmado" },
    { id: 2, cliente: "João Santos", servico: "Customização Jaqueta", data: "15/03/2026", hora: "14:00", status: "pendente" },
    { id: 3, cliente: "Ana Costa", servico: "Reparo de Bolsa", data: "16/03/2026", hora: "09:30", status: "confirmado" },
    { id: 4, cliente: "Pedro Oliveira", servico: "Tingimento", data: "16/03/2026", hora: "11:00", status: "cancelado" },
  ]);

  const [servicosList, setServicosList] = useState<Servico[]>([
    { id: 1, nome: "Ajuste de Roupa", duracao: "30min", preco: "R$ 35,00", ativo: true },
    { id: 2, nome: "Customização", duracao: "1h", preco: "R$ 80,00", ativo: true },
    { id: 3, nome: "Tingimento", duracao: "2h", preco: "R$ 60,00", ativo: true },
    { id: 4, nome: "Reparo de Bolsa", duracao: "45min", preco: "R$ 50,00", ativo: false },
    { id: 5, nome: "Upcycling Completo", duracao: "3h", preco: "R$ 150,00", ativo: true },
  ]);

  const [agendDialog, setAgendDialog] = useState(false);
  const [servicoDialog, setServicoDialog] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Agendamento form
  const [agCliente, setAgCliente] = useState("");
  const [agServico, setAgServico] = useState("");
  const [agData, setAgData] = useState("");
  const [agHora, setAgHora] = useState("");

  // Servico form
  const [svNome, setSvNome] = useState("");
  const [svDuracao, setSvDuracao] = useState("");
  const [svPreco, setSvPreco] = useState("");

  const resetAgendForm = () => { setAgCliente(""); setAgServico(""); setAgData(""); setAgHora(""); setErrors({}); };
  const resetServicoForm = () => { setSvNome(""); setSvDuracao(""); setSvPreco(""); setEditingServico(null); setErrors({}); };

  const handleSaveAgendamento = () => {
    const result = agendamentoSchema.safeParse({ cliente: agCliente, servico: agServico, data: agData, hora: agHora });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
      setErrors(fieldErrors);
      return;
    }
    const formatted = agData.split("-").reverse().join("/");
    setAgendamentos((prev) => [...prev, { id: Date.now(), cliente: agCliente, servico: agServico, data: formatted, hora: agHora, status: "pendente" }]);
    toast.success("Agendamento criado!");
    setAgendDialog(false);
    resetAgendForm();
  };

  const handleSaveServico = () => {
    const result = servicoSchema.safeParse({ nome: svNome, duracao: svDuracao, preco: svPreco });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
      setErrors(fieldErrors);
      return;
    }
    if (editingServico) {
      setServicosList((prev) => prev.map((s) => s.id === editingServico.id ? { ...s, nome: svNome, duracao: svDuracao, preco: svPreco } : s));
      toast.success("Serviço atualizado!");
    } else {
      setServicosList((prev) => [...prev, { id: Date.now(), nome: svNome, duracao: svDuracao, preco: svPreco, ativo: true }]);
      toast.success("Serviço criado!");
    }
    setServicoDialog(false);
    resetServicoForm();
  };

  const openEditServico = (s: Servico) => {
    setEditingServico(s);
    setSvNome(s.nome);
    setSvDuracao(s.duracao);
    setSvPreco(s.preco);
    setErrors({});
    setServicoDialog(true);
  };

  const deleteServico = (id: number) => {
    setServicosList((prev) => prev.filter((s) => s.id !== id));
    toast.success("Serviço removido!");
  };

  const deleteAgendamento = (id: number) => {
    setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    toast.success("Agendamento removido!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Serviços</h1>
        <p className="text-muted-foreground text-sm">Agendamentos e lista de serviços</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="agendamentos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="h-4 w-4 mr-2" />Agendamentos
          </TabsTrigger>
          <TabsTrigger value="lista" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Scissors className="h-4 w-4 mr-2" />Lista de Serviços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agendamentos" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { resetAgendForm(); setAgendDialog(true); }}><Plus className="h-4 w-4 mr-2" />Novo Agendamento</Button>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Serviço</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Data</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Hora</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{a.cliente}</td>
                    <td className="py-3 px-4 text-foreground">{a.servico}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{a.data}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{a.hora}</td>
                    <td className="py-3 px-4"><Badge variant="outline" className={statusColors[a.status]}>{a.status}</Badge></td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteAgendamento(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="lista" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { resetServicoForm(); setServicoDialog(true); }}><Plus className="h-4 w-4 mr-2" />Novo Serviço</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicosList.map((s) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{s.nome}</h3>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditServico(s)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteServico(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{s.duracao}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{s.preco}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={s.ativo} onCheckedChange={(v) => setServicosList((prev) => prev.map((x) => x.id === s.id ? { ...x, ativo: v } : x))} />
                  <span className="text-xs text-muted-foreground">{s.ativo ? "Ativo" : "Inativo"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Agendamento */}
      <Dialog open={agendDialog} onOpenChange={setAgendDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Novo Agendamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input value={agCliente} onChange={(e) => setAgCliente(e.target.value)} placeholder="Nome do cliente" className="bg-secondary border-border" />
              {errors.cliente && <p className="text-xs text-destructive">{errors.cliente}</p>}
            </div>
            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select value={agServico} onValueChange={setAgServico}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {servicosList.filter((s) => s.ativo).map((s) => (
                    <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.servico && <p className="text-xs text-destructive">{errors.servico}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" value={agData} onChange={(e) => setAgData(e.target.value)} className="bg-secondary border-border" />
                {errors.data && <p className="text-xs text-destructive">{errors.data}</p>}
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input type="time" value={agHora} onChange={(e) => setAgHora(e.target.value)} className="bg-secondary border-border" />
                {errors.hora && <p className="text-xs text-destructive">{errors.hora}</p>}
              </div>
            </div>
            <Button onClick={handleSaveAgendamento} className="w-full">Criar Agendamento</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Serviço */}
      <Dialog open={servicoDialog} onOpenChange={setServicoDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">{editingServico ? "Editar Serviço" : "Novo Serviço"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={svNome} onChange={(e) => setSvNome(e.target.value)} placeholder="Ex: Ajuste de Roupa" className="bg-secondary border-border" />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Duração</Label>
                <Input value={svDuracao} onChange={(e) => setSvDuracao(e.target.value)} placeholder="Ex: 30min" className="bg-secondary border-border" />
                {errors.duracao && <p className="text-xs text-destructive">{errors.duracao}</p>}
              </div>
              <div className="space-y-2">
                <Label>Preço</Label>
                <Input value={svPreco} onChange={(e) => setSvPreco(e.target.value)} placeholder="Ex: R$ 35,00" className="bg-secondary border-border" />
                {errors.preco && <p className="text-xs text-destructive">{errors.preco}</p>}
              </div>
            </div>
            <Button onClick={handleSaveServico} className="w-full">{editingServico ? "Salvar Alterações" : "Criar Serviço"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicosContent;
