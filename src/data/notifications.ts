import type { AppNotification } from "@/types";

export const mockNotifications: AppNotification[] = [
  { id: 1, type: "sale", title: "Nova venda realizada", desc: "Vestido Floral Vintage — R$ 89,90", time: "Há 5 min", read: false },
  { id: 2, type: "payment", title: "Pagamento pendente", desc: "Ana Paula Ferreira — R$ 340,00", time: "Há 30 min", read: false },
  { id: 3, type: "goal", title: "Meta atingida! 🎉", desc: "Você atingiu 87 vendas este mês", time: "Há 2h", read: false },
  { id: 4, type: "sale", title: "Nova venda realizada", desc: "Jaqueta Jeans Upcycled — R$ 159,00", time: "Há 3h", read: true },
  { id: 5, type: "payment", title: "Pagamento confirmado", desc: "Juliana Mendonça — R$ 450,00", time: "Há 5h", read: true },
];
