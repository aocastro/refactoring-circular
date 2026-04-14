export const getPlanPermissions = (planName: string): string[] => {
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

  const plan = (planName || "Growth").toLowerCase();

  if (plan === "starter") {
    return [...base];
  }

  if (plan === "essential") {
    return [...base, "pdv", "relatorios", "cupons"];
  }

  if (plan === "growth") {
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
