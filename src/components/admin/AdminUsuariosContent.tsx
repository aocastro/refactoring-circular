import api from "@/api/axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Store, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterToolbar from "@/components/shared/FilterToolbar";
import DataTable from "@/components/shared/DataTable";
import PaginationControls from "@/components/shared/PaginationControls";
import { usePagination } from "@/hooks/use-pagination";
import { useEffect } from "react";
import { type AdminUser } from "@/data/admin";
import { toast } from "sonner";

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin": return <Shield className="h-3.5 w-3.5 text-primary" />;
    case "lojista": return <Store className="h-3.5 w-3.5 text-blue-500" />;
    case "consignante": return <Handshake className="h-3.5 w-3.5 text-green-600" />;
    default: return null;
  }
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
  const [loadingData, setLoadingData] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminUsers, setAdminUsers] = useState<any>([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setAdminUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_adminUsers = await api.get('/api/admin/users');
        setAdminUsers(res_adminUsers.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const changeUserStatus = async (id: number, status: string, message: string) => {
    try {
      await api.put(`/api/admin/users/${id}/status`, { status });
      toast.success(message);
      fetchUsers();
    } catch (err) {
      console.error("Error changing user status:", err);
      toast.error("Erro ao alterar status do usuário");
    }
  };



  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const filtered = adminUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Todos" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, 10, page);



  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

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
          data={paginatedItems}
          emptyMessage="Nenhum usuário encontrado."
          renderRow={(user: AdminUser) => (
            <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-foreground">{user.name}</td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{user.email}</td>
              <td className="px-4 py-3 text-sm">
                <span className="flex items-center gap-1.5 capitalize">{getRoleIcon(user.role)}{user.role}</span>
              </td>
              <td className="hidden px-4 py-3 text-right text-sm text-muted-foreground md:table-cell">{user.stores}</td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{user.lastLogin}</td>
              <td className="px-4 py-3"><Badge variant={statusVariant[user.status]}>{user.status}</Badge></td>
              <td className="px-4 py-3">
                {user.status === "bloqueado" ? (
                  <Button size="sm" variant="outline" onClick={() => changeUserStatus(user.id, "ativo", `${user.name} desbloqueado`)}>Desbloquear</Button>
                ) : user.role !== "admin" ? (
                  <Button size="sm" variant="destructive" onClick={() => changeUserStatus(user.id, "bloqueado", `${user.name} bloqueado`)}>Bloquear</Button>
                ) : null}
              </td>
            </tr>
          )}
        />
        <PaginationControls
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </motion.div>
    </div>
  );
};

export default AdminUsuariosContent;
