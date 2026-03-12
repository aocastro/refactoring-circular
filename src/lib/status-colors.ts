import type { ProductStatus } from "@/types";

/** Returns semantic color classes for product/consignante status badges */
export function getStatusColor(status: string): string {
  switch (status) {
    case "Disponível":
    case "Ativo":
    case "Vigente":
    case "Pago":
      return status === "Pago" || status === "Vigente"
        ? "bg-success/10 text-success"
        : status === "Ativo"
        ? "bg-success/10 text-success"
        : "bg-success/10 text-success";
    case "Reservado":
      return "bg-accent/10 text-accent";
    case "Vendido":
    case "Encerrado":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}
