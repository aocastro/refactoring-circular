export interface Cupom {
  id: number;
  code: string;
  description: string;
  type: "percentual" | "fixo" | "frete";
  value: number;
  minPurchase: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  status: "Ativo" | "Expirado" | "Esgotado";
}

export const mockCupons: Cupom[] = [
  { id: 1, code: "BEMVINDO10", description: "Desconto de boas-vindas", type: "percentual", value: 10, minPurchase: 100, usageLimit: 100, usageCount: 45, startDate: "01/01/2026", endDate: "31/12/2026", status: "Ativo" },
  { id: 2, code: "FRETEGRATIS", description: "Frete grátis em compras acima de R$200", type: "frete", value: 0, minPurchase: 200, usageLimit: 50, usageCount: 50, startDate: "01/02/2026", endDate: "28/02/2026", status: "Esgotado" },
  { id: 3, code: "VERAO20", description: "Promoção de verão", type: "percentual", value: 20, minPurchase: 150, usageLimit: 200, usageCount: 87, startDate: "01/01/2026", endDate: "31/03/2026", status: "Ativo" },
  { id: 4, code: "NATAL50", description: "Cupom de Natal R$50 OFF", type: "fixo", value: 50, minPurchase: 300, usageLimit: 100, usageCount: 100, startDate: "01/12/2025", endDate: "31/12/2025", status: "Expirado" },
  { id: 5, code: "CIRCULAR15", description: "Moda circular com desconto", type: "percentual", value: 15, minPurchase: 80, usageLimit: 150, usageCount: 32, startDate: "01/03/2026", endDate: "30/06/2026", status: "Ativo" },
  { id: 6, code: "PRIMEIRACOMPRA", description: "Desconto na primeira compra", type: "fixo", value: 30, minPurchase: 120, usageLimit: 500, usageCount: 198, startDate: "01/01/2026", endDate: "31/12/2026", status: "Ativo" },
];
