const fs = require('fs');
let content = fs.readFileSync('src/data/admin.ts', 'utf8');

content = content.replace(
  'features: string[];',
  'features: string[];\n  permissions: string[];'
);

const plansReplacement = `export const adminPlans: AdminPlan[] = [
  { id: 1, name: "Starter", priceMonthly: 49, priceYearly: 470, subscribers: 82, features: ["1 loja", "100 produtos", "Suporte email"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios"] },
  { id: 2, name: "Essential", priceMonthly: 99, priceYearly: 950, subscribers: 94, features: ["3 lojas", "500 produtos", "Suporte chat", "PDV"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios", "pdv", "relatorios", "cupons"] },
  { id: 3, name: "Growth", priceMonthly: 199, priceYearly: 1910, subscribers: 48, features: ["10 lojas", "Ilimitado", "Suporte prioritário", "PDV", "Blog"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios", "pdv", "relatorios", "cupons", "blog", "inventario", "financeiro", "servicos"] },
  { id: 4, name: "Scale", priceMonthly: 399, priceYearly: 3830, subscribers: 18, features: ["Ilimitado", "API", "Suporte 24/7", "White-label"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios", "pdv", "relatorios", "cupons", "blog", "inventario", "financeiro", "servicos", "consignantes", "fornecedores", "newsletter", "meu-linktree", "lojas"] },
  { id: 5, name: "Executive", priceMonthly: 799, priceYearly: 7670, subscribers: 5, features: ["Tudo do Scale", "Gerente dedicado", "SLA 99.9%"], status: "ativo", permissions: ["dashboard", "minha-loja", "minha-conta", "configuracoes", "venda", "clientes", "suporte", "funcionarios", "pdv", "relatorios", "cupons", "blog", "inventario", "financeiro", "servicos", "consignantes", "fornecedores", "newsletter", "meu-linktree", "lojas"] },
];`;

content = content.replace(/export const adminPlans: AdminPlan\[\] = \[[\s\S]*?\];/, plansReplacement);

fs.writeFileSync('src/data/admin.ts', content);
