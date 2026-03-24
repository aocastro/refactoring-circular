import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Store, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterToolbar from "@/components/shared/FilterToolbar";
import DataTable from "@/components/shared/DataTable";
import { adminUsers, type AdminUser } from "@/data/admin";
import { toast } from "sonner";

const roleIcon: Record<string, React.ReactNode> = {
  admin: <Shield className="h-3.5 w-3.5 text-primary" />,
  lojista: <Store className="h-3.5 w-3.5 text-blue-500" />,
  consignante: <Handshake className="h-3.5 w-3.5 text-green-600" />,
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  ativo: "default",
  inativo: "secondary",
  bloqueado: "destructive",
};

const columns = [
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail", hideOn: "sm" as const },
  { key: "role", label: "Tipo" },
  { key: "stores", label: "Lojas", align: "right" as const, hideOn: "md" as const },
  { key: "lastLogin", label: "Último acesso", hideOn: "md" as const },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const AdminUsuariosContent = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");

  const filtered = adminUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Todos" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Usuários</h2>
          <p className="text-sm text-muted-foreground">Gerencie todos os usuários da plataforma</p>
        </div>
        <Badge variant="outline"><Users className="mr-1 h-4 w-4" />{adminUsers.length} usuários</Badge>
      </header>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nome ou e-mail..."
        filters={[{ key: "role", label: "Tipo", options: ["Todos", "admin", "lojista", "consignante"], value: roleFilter, onChange: setRoleFilter }]}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Nenhum usuário encontrado."
          renderRow={(user: AdminUser) => (
            <>
              <td className="px-4 py-3 text-sm font-medium text-foreground">{user.name}</td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{user.email}</td>
              <td className="px-4 py-3 text-sm">
                <span className="flex items-center gap-1.5 capitalize">{roleIcon[user.role]}{user.role}</span>
              </td>
              <td className="hidden px-4 py-3 text-right text-sm text-muted-foreground md:table-cell">{user.stores}</td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{user.lastLogin}</td>
              <td className="px-4 py-3"><Badge variant={statusVariant[user.status]}>{user.status}</Badge></td>
              <td className="px-4 py-3">
                {user.status === "bloqueado" ? (
                  <Button size="sm" variant="outline" onClick={() => toast.success(`${user.name} desbloqueado`)}>Desbloquear</Button>
                ) : user.role !== "admin" ? (
                  <Button size="sm" variant="destructive" onClick={() => toast.success(`${user.name} bloqueado`)}>Bloquear</Button>
                ) : null}
              </td>
            </>
          )}
        />
      </motion.div>
    </div>
  );
};

export default AdminUsuariosContent;
