import api from "@/api/axios";
import { useState, useEffect } from "react";
import { Bell, ShoppingBag, DollarSign, Target, CheckCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AppNotification, NotificationType } from "@/types";

const iconMap: Record<NotificationType, typeof ShoppingBag> = {
  sale: ShoppingBag,
  payment: DollarSign,
  goal: Target,
};

const typeStyles: Record<NotificationType, string> = {
  sale: "bg-success/10 text-success",
  payment: "bg-accent/10 text-accent",
  goal: "bg-primary/10 text-primary",
};

const NotificationsDropdown = () => {
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mockNotifications, setMockNotifications] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_mockNotifications = await api.get('/api/notifications');
        setMockNotifications(res_mockNotifications.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);


  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  useEffect(() => {
    if (mockNotifications) {
      setNotifications(mockNotifications);
    }
  }, [mockNotifications]);
  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 0;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center min-w-[18px] h-[18px]">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-card border-border" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">Notificações</h4>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Marcar todas como lidas
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || ShoppingBag;
  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;


            return (
              <div
                key={n.id}
                className={`flex gap-3 p-3 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeStyles[n.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;
