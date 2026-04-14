const fs = require('fs');
let content = fs.readFileSync('src/lib/permissions.ts', 'utf8');

// We need to fetch the mock `adminPlans` to get real permissions configured by admin
// The mock api doesn't actually persist across reloads (in-memory mock array) but we'll fetch from `adminPlans` directly
// because `getPlanPermissions` is synchronous and can't do an API call.
// Alternatively we can read the adminPlans mock data list.
const newContent = `import { adminPlans } from "@/data/admin";

export const getPlanPermissions = (planName: string): string[] => {
  const planNameLower = (planName || "Growth").toLowerCase();

  // Try to find dynamically updated plan permissions first
  const dynamicPlan = adminPlans.find(p => p.name.toLowerCase() === planNameLower);
  if (dynamicPlan && dynamicPlan.permissions) {
    return dynamicPlan.permissions;
  }

  // Fallback map
  const base = [
    "dashboard",
    "minha-loja",
    "minha-conta",
    "configuracoes",
    "venda",
    "clientes",
    "suporte",
    "funcionarios",
  ];

  if (planNameLower === "starter") {
    return [...base];
  }

  if (planNameLower === "essential") {
    return [...base, "pdv", "relatorios", "cupons"];
  }

  if (planNameLower === "growth") {
    return [...base, "pdv", "relatorios", "cupons", "blog", "inventario", "financeiro", "servicos"];
  }

  // Scale, Executive and others get everything
  return [
    ...base,
    "pdv",
    "relatorios",
    "cupons",
    "blog",
    "inventario",
    "financeiro",
    "servicos",
    "consignantes",
    "fornecedores",
    "newsletter",
    "meu-linktree",
    "lojas",
  ];
};
`;

fs.writeFileSync('src/lib/permissions.ts', newContent);
