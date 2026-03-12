import { useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Calendar, Plus, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  defaultTab?: string;
}

const agendamentos = [
  { id: 1, cliente: "Maria Silva", servico: "Ajuste de Vestido", data: "15/03/2026", hora: "10:00", status: "confirmado" },
  { id: 2, cliente: "João Santos", servico: "Customização Jaqueta", data: "15/03/2026", hora: "14:00", status: "pendente" },
  { id: 3, cliente: "Ana Costa", servico: "Reparo de Bolsa", data: "16/03/2026", hora: "09:30", status: "confirmado" },
  { id: 4, cliente: "Pedro Oliveira", servico: "Tingimento", data: "16/03/2026", hora: "11:00", status: "cancelado" },
];

const servicos = [
  { id: 1, nome: "Ajuste de Roupa", duracao: "30min", preco: "R$ 35,00", ativo: true },
  { id: 2, nome: "Customização", duracao: "1h", preco: "R$ 80,00", ativo: true },
  { id: 3, nome: "Tingimento", duracao: "2h", preco: "R$ 60,00", ativo: true },
  { id: 4, nome: "Reparo de Bolsa", duracao: "45min", preco: "R$ 50,00", ativo: false },
  { id: 5, nome: "Upcycling Completo", duracao: "3h", preco: "R$ 150,00", ativo: true },
];

const statusColors: Record<string, string> = {
  confirmado: "bg-success/10 text-success",
  pendente: "bg-warning/10 text-warning",
  cancelado: "bg-destructive/10 text-destructive",
};

const ServicosContent = ({ defaultTab = "agendamentos" }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Serviços</h1>
          <p className="text-muted-foreground text-sm">Agendamentos e lista de serviços</p>
        </div>
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
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Novo Agendamento</Button>
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
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{a.cliente}</td>
                    <td className="py-3 px-4 text-foreground">{a.servico}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{a.data}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{a.hora}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={statusColors[a.status]}>{a.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="lista" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Novo Serviço</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicos.map((s) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{s.nome}</h3>
                  <Badge variant={s.ativo ? "default" : "secondary"}>{s.ativo ? "Ativo" : "Inativo"}</Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{s.duracao}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{s.preco}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicosContent;
