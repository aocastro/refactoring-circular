import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const campaignSchema = z.object({
  titulo: z.string().trim().min(3, "Título deve ter pelo menos 3 caracteres").max(100, "Máximo 100 caracteres"),
  assunto: z.string().trim().min(3, "Assunto deve ter pelo menos 3 caracteres").max(200, "Máximo 200 caracteres"),
  conteudo: z.string().trim().min(10, "Conteúdo deve ter pelo menos 10 caracteres").max(5000, "Máximo 5000 caracteres"),
  status: z.enum(["rascunho", "enviada"]),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export interface Campaign {
  id: number;
  titulo: string;
  assunto: string;
  conteudo: string;
  enviados: number;
  abertos: number;
  cliques: number;
  data: string;
  status: string;
}

interface CampaignFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: Campaign | null;
  onSave: (campaign: Campaign) => void;
}

const CampaignFormDialog = ({ open, onOpenChange, campaign, onSave }: CampaignFormDialogProps) => {
  const isEditing = !!campaign;

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      titulo: "",
      assunto: "",
      conteudo: "",
      status: "rascunho",
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        titulo: campaign.titulo,
        assunto: campaign.assunto || "",
        conteudo: campaign.conteudo || "",
        status: campaign.status as "rascunho" | "enviada",
      });
    } else {
      form.reset({ titulo: "", assunto: "", conteudo: "", status: "rascunho" });
    }
  }, [campaign, open, form]);

  const onSubmit = (values: CampaignFormValues) => {
    const today = new Date();
    const dataStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    
    const saved: Campaign = {
      id: campaign?.id || Date.now(),
      titulo: values.titulo,
      assunto: values.assunto,
      conteudo: values.conteudo,
      enviados: campaign?.enviados || 0,
      abertos: campaign?.abertos || 0,
      cliques: campaign?.cliques || 0,
      data: campaign?.data || dataStr,
      status: values.status,
    };

    onSave(saved);
    onOpenChange(false);
    toast.success(isEditing ? "Campanha atualizada!" : "Campanha criada!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="titulo" render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl><Input placeholder="Ex: Promoção de Verão" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="assunto" render={({ field }) => (
              <FormItem>
                <FormLabel>Assunto do E-mail</FormLabel>
                <FormControl><Input placeholder="Linha de assunto do e-mail" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="conteudo" render={({ field }) => (
              <FormItem>
                <FormLabel>Conteúdo</FormLabel>
                <FormControl><Textarea placeholder="Corpo do e-mail..." rows={5} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="enviada">Enviada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">{isEditing ? "Salvar" : "Criar Campanha"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignFormDialog;
