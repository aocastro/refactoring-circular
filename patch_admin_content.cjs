const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminPlanosContent.tsx', 'utf8');

// 1. Imports
content = content.replace(
  'import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";',
  `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";`
);

// 2. Add ALL_PERMISSIONS constant outside component
const ALL_PERMISSIONS = `
const ALL_PERMISSIONS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "minha-loja", label: "Minha Loja" },
  { id: "minha-conta", label: "Minha Conta" },
  { id: "configuracoes", label: "Configurações" },
  { id: "venda", label: "Venda" },
  { id: "clientes", label: "Clientes" },
  { id: "suporte", label: "Suporte" },
  { id: "funcionarios", label: "Funcionários" },
  { id: "pdv", label: "PDV" },
  { id: "relatorios", label: "Relatórios" },
  { id: "cupons", label: "Cupons" },
  { id: "blog", label: "Blog" },
  { id: "inventario", label: "Inventário" },
  { id: "financeiro", label: "Financeiro" },
  { id: "servicos", label: "Serviços" },
  { id: "consignantes", label: "Consignantes" },
  { id: "fornecedores", label: "Fornecedores" },
  { id: "newsletter", label: "Newsletter" },
  { id: "meu-linktree", label: "Meu Linktree" },
  { id: "lojas", label: "Múltiplas Lojas" },
];
`;
content = content.replace('const AdminPlanosContent = () => {', ALL_PERMISSIONS + '\nconst AdminPlanosContent = () => {');

// 3. Update formData state
content = content.replace(
  'features: [""]',
  'features: [""],\n    permissions: [] as string[]'
);

// 4. Update handleOpenDialog branches
content = content.replace(
  'features: [...plan.features]',
  'features: [...plan.features],\n        permissions: plan.permissions ? [...plan.permissions] : []'
);
content = content.replace(
  /features: \[""\](\s+?)\}\);/g,
  'features: [""],\n        permissions: []\n      });'
);

// 5. Add handlePermissionToggle
const toggleFn = `
  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => {
      const current = prev.permissions;
      if (current.includes(permissionId)) {
        return { ...prev, permissions: current.filter(p => p !== permissionId) };
      } else {
        return { ...prev, permissions: [...current, permissionId] };
      }
    });
  };
`;
content = content.replace('const fetchPlans = async () => {', toggleFn + '\n  const fetchPlans = async () => {');

// 6. Fix classes for UI alignment
content = content.replace('<Card className={plan.status === "inativo" ? "opacity-60" : ""}>', '<Card className={\`h-full flex flex-col \${plan.status === "inativo" ? "opacity-60" : ""}\`}>');
content = content.replace('<CardContent className="space-y-4">', '<CardContent className="flex-1 flex flex-col space-y-4">');
content = content.replace('<div className="flex gap-2 pt-2">', '<div className="flex gap-2 pt-2 mt-auto">');

// 7. Add Checkboxes to form
const checkboxesHtml = `
            <div className="space-y-2">
              <Label>Permissões de Acesso</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded-md p-3 max-h-[200px] overflow-y-auto bg-muted/20">
                {ALL_PERMISSIONS.map((perm) => (
                  <div key={perm.id} className="flex flex-row items-start space-x-2">
                    <Checkbox
                      id={\`perm-\${perm.id}\`}
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => handlePermissionToggle(perm.id)}
                    />
                    <label
                      htmlFor={\`perm-\${perm.id}\`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                      {perm.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
`;
content = content.replace('          <DialogFooter>', checkboxesHtml + '\n          <DialogFooter>');

// Make dialog larger for permissions
content = content.replace('<DialogContent className="sm:max-w-[500px]">', '<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">');


fs.writeFileSync('src/components/admin/AdminPlanosContent.tsx', content);
