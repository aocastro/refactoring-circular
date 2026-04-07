export interface Cliente {
  id: number;
  name: string; // Nome *
  sobrenome?: string;
  email: string;
  phone: string; // Celular
  origem?: string;
  cpf?: string;
  aniversarioDiaMes?: string;
  aniversarioAno?: string;
  pais?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;

  totalPurchases: number;
  totalSpent: number;
  lastPurchase: string;
  since: string;
  status: "Ativo" | "Inativo";
  birthDate?: string; // Legacy
}

export interface PurchaseHistory {
  id: number;
  clienteId: number;
  date: string;
  items: string[];
  total: number;
  payment: string;
}

export const mockClientes: Cliente[] = [
  { id: 1, name: "Ana Oliveira LF", email: "ana@email.com", phone: "(11) 99123-4567", totalPurchases: 8, totalSpent: 2450, lastPurchase: "10/03/2026", since: "Jan/2025", status: "Ativo", birthDate: "15/05/1990" },
  { id: 2, name: "Carlos Silva PTA", email: "carlos@email.com", phone: "(11) 98765-4321", totalPurchases: 3, totalSpent: 890, lastPurchase: "05/03/2026", since: "Mar/2025", status: "Ativo", birthDate: "20/03/1985" },
  { id: 3, name: "Beatriz Santos LF", email: "bia@email.com", phone: "(21) 99876-5432", totalPurchases: 12, totalSpent: 4200, lastPurchase: "11/03/2026", since: "Out/2024", status: "Ativo", birthDate: "10/08/1992" },
  { id: 4, name: "Daniel Costa FEIRA", email: "daniel@email.com", phone: "(11) 97654-3210", totalPurchases: 1, totalSpent: 320, lastPurchase: "15/01/2026", since: "Jan/2026", status: "Inativo", birthDate: "05/03/1988" },
  { id: 5, name: "Fernanda Lima LF", email: "fer@email.com", phone: "(31) 99234-5678", totalPurchases: 6, totalSpent: 1800, lastPurchase: "08/03/2026", since: "Jun/2025", status: "Ativo", birthDate: "12/12/1995" },
  { id: 6, name: "Gustavo Mendes PTA", email: "gustavo@email.com", phone: "(21) 98345-6789", totalPurchases: 4, totalSpent: 1100, lastPurchase: "01/03/2026", since: "Ago/2025", status: "Ativo", birthDate: "25/07/1982" },
  { id: 7, name: "Helena Rocha FEIRA", email: "helena@email.com", phone: "(11) 99456-7890", totalPurchases: 2, totalSpent: 560, lastPurchase: "20/12/2025", since: "Nov/2025", status: "Inativo", birthDate: "30/01/1991" },
  { id: 8, name: "Igor Pereira LF", email: "igor@email.com", phone: "(41) 98567-8901", totalPurchases: 15, totalSpent: 5600, lastPurchase: "12/03/2026", since: "Jul/2024", status: "Ativo", birthDate: "14/03/1987" },
];

export const mockPurchaseHistory: PurchaseHistory[] = [
  { id: 1, clienteId: 1, date: "10/03/2026", items: ["Vestido Floral Vintage", "Colar Artesanal Boho"], total: 430, payment: "Pix" },
  { id: 2, clienteId: 1, date: "25/02/2026", items: ["Jaqueta Jeans Upcycled"], total: 280, payment: "Cartão" },
  { id: 3, clienteId: 3, date: "11/03/2026", items: ["Bolsa de Couro Retrô"], total: 350, payment: "Cartão" },
  { id: 4, clienteId: 3, date: "01/03/2026", items: ["Saia Midi Plissada", "Óculos Retrô Ray-Ban"], total: 520, payment: "Pix" },
  { id: 5, clienteId: 8, date: "12/03/2026", items: ["Camisa Hawaiana 90s", "Boné Vintage Nike"], total: 290, payment: "Dinheiro" },
];
