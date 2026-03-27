import { useState } from "react";
import { Bell, Store, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AdminNotification {
  id: number;
  type: "store" | "payment" | "alert" | "success";
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const initialNotifications: AdminNotification[] = [
  { id: 1, type: "store", title: "Nova loja cadastrada", desc: "Circular Shop solicitou aprovação", time: "Agora", read: false },
  { id: 2, type: "payment", title: "Pagamento recebido", desc: "Reuse & Style — Plano Scale (R$ 399)", time: "5 min", read: false },
  { id: 3, type: "alert", title: "Churn detectado", desc: "Second Hand SP cancelou assinatura Growth", time: "1h", read: false },
  { id: 4, type: "success", title: "Meta atingida", desc: "MRR ultrapassou R$ 48.000 este mês", time: "2h", read: false },
  { id: 5, type: "payment", title: "Comissão processada", desc: "R$ 2.400 em comissões distribuídas", time: "3h", read: true },
  { id: 6, type: "store", title: "Loja suspensa", desc: "Ação automática: Second Hand SP (inadimplência)", time: "5h", read: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case "store": return <Store className="h-4 w-4 text-blue-500" />;
    case "payment": return <DollarSign className="h-4 w-4 text-green-600" />;
    case "alert": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "success": return <CheckCircle className="h-4 w-4 text-primary" />;
    default: return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary relative border-none outline-none focus:ring-2 focus:ring-ring">
          <Bell className="h-5 w-5 text-foreground" />
          {unread > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
              {unread}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-semibold text-foreground">Notificações</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                Marcar todas como lidas
              </button>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={`flex items-start gap-3 px-3 py-3 ${!n.read ? "bg-primary/5" : ""}`}
                onSelect={(e) => {
                  e.preventDefault();
                  setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
                }}
              >
                <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${!n.read ? "font-semibold text-foreground" : "text-foreground"}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
                </div>
                {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
