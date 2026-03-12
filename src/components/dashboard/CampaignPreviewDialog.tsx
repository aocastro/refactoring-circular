import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Send, Eye, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { Campaign } from "./CampaignFormDialog";

interface CampaignPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSend: (campaign: Campaign) => void;
}

const CampaignPreviewDialog = ({ open, onOpenChange, campaign, onSend }: CampaignPreviewDialogProps) => {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!campaign) return;
    setSending(true);
    setProgress(0);
    setSent(false);

    const totalSteps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(Math.round((step / totalSteps) * 100));
      if (step >= totalSteps) {
        clearInterval(interval);
        setSending(false);
        setSent(true);
        onSend(campaign);
        toast.success(`Campanha "${campaign.titulo}" enviada com sucesso para 342 assinantes!`);
      }
    }, 120);
  };

  const handleClose = () => {
    setSending(false);
    setProgress(0);
    setSent(false);
    onOpenChange(false);
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={sending ? undefined : handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview da Campanha
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Preview */}
          <div className="rounded-lg border border-border bg-secondary/20 overflow-hidden">
            {/* Email Header */}
            <div className="bg-secondary/40 px-4 py-3 space-y-1 border-b border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>De: newsletter@suaempresa.com</span>
              </div>
              <div className="text-xs text-muted-foreground">Para: 342 assinantes ativos</div>
              <div className="text-sm font-semibold text-foreground">{campaign.assunto}</div>
            </div>
            {/* Email Body */}
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-bold text-foreground">{campaign.titulo}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{campaign.conteudo}</p>
              <div className="pt-3 border-t border-border/50">
                <p className="text-[11px] text-muted-foreground/60">
                  Você recebeu este e-mail porque está inscrito em nossa newsletter. Para cancelar a inscrição, clique aqui.
                </p>
              </div>
            </div>
          </div>

          {/* Campaign Info */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <Mail className="h-3 w-3 mr-1" />
              342 destinatários
            </Badge>
            <Badge variant={campaign.status === "enviada" ? "default" : "secondary"}>
              {campaign.status}
            </Badge>
          </div>

          {/* Sending Progress */}
          {sending && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Enviando...</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Sent Confirmation */}
          {sent && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Campanha enviada com sucesso!</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={sending}>
            {sent ? "Fechar" : "Cancelar"}
          </Button>
          {!sent && (
            <Button onClick={handleSend} disabled={sending}>
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Enviando..." : "Enviar Campanha"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignPreviewDialog;
