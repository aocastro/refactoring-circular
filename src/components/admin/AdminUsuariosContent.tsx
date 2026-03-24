import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Store, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterToolbar from "@/components/shared/FilterToolbar";
import DataTable from "@/components/shared/DataTable";
import { adminUsers, type AdminUser } from "@/data/admin";
import type { TableColumn } from "@/types";
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

const columns: TableColumn<AdminUser>[] = [
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail", hideOn: "sm" },
  { key: "role", label: "Tipo", render: (r) => <span className="flex items-center gap-1.5 capitalize">{roleIcon[r.role]}{r.role}</span> },
  { key: "stores", label: "Lojas", align: "right", hideOn: "md" },
  { key: "lastLogin", label: "Último acesso", hideOn: "md" },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
  { key: "actions", label: "", render: (r) => (
    <div className="flex gap-1">
      {r.status === "bloqueado" ? (
        <Button size="sm" variant="outline" onClick={() => toast.success(`${r.name} desbloqueado`)}>Desbloquear</Button>
      ) : r.role !== "admin" ? (
        <Button size="sm" variant="destructive" onClick={() => toast.success(`${r.name} bloqueado`)}>Bloquear</Button>
      ) : null}
    </div>
  )},
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
        <DataTable columns={columns} data={filtered} emptyMessage="Nenhum usuário encontrado." />
      </motion.div>
    </div>
  );
};

export default AdminUsuariosContent;
