# Plan to Implement Permissions Control

1. **Update `Funcionario` interface to include `permissoes`**
   - In `src/components/dashboard/FuncionariosContent.tsx`, I'll update the `Funcionario` interface to have a `permissoes: string[]` property.
   - Also, in the `form` state, add a `permissoes` property to handle checkboxes.
   - Modify the mock `initialData` to include some initial permissions for existing mock users, depending on their role.
   - Create an interface to let the store administrator select which permissions (from the available ones of the active plan) the employee will have. This implies checkboxes for each module in the "Novo/Editar Funcionário" dialog.

2. **Implement Permission Filtering in the Sidebar**
   - Create a central file `src/lib/permissions.ts` (I already drafted it) that figures out which menu items a given plan gives access to.
   - In `src/components/dashboard/DashboardSidebar.tsx`, we need to read the current user's role and permissions.
   - We check `localStorage.getItem("user")` (or wherever user info is stored) to see if they are an admin or a regular employee, and their `permissoes` array.
   - We check `localStorage.getItem("storeConfig")` to get `planName` and calculate the store's max permissions using `getPlanPermissions`.
   - Filter `menuItems` so it only displays the ones that the current user has access to AND that the plan allows.

3. **Update Login Flow for Employees**
   - We need to simulate the login of employees vs the admin.
   - The admin (`user.role === 'admin'`) can access all features given by the store's plan, plus the `funcionarios` page.
   - The employee (`user.role === 'lojista_funcionario'`) only accesses the modules given in their `permissoes` array.

4. **Update `FuncionariosContent.tsx` to handle adding/editing permissions**
   - In the "Novo Funcionário" dialog, fetch the store's max permissions.
   - Show checkboxes for these permissions so the store admin can select them.

5. **Pre Commit Steps**
   - Complete pre-commit steps.
