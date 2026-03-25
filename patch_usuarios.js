import fs from 'fs';
const file = 'src/components/admin/AdminUsuariosContent.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import DataTable from "@/components/shared/DataTable";',
  'import DataTable from "@/components/shared/DataTable";\nimport PaginationControls from "@/components/shared/PaginationControls";\nimport { usePagination } from "@/hooks/use-pagination";\nimport { useEffect } from "react";'
);

content = content.replace(
  'const [roleFilter, setRoleFilter] = useState("Todos");',
  'const [roleFilter, setRoleFilter] = useState("Todos");\n  const [page, setPage] = useState(1);\n\n  useEffect(() => {\n    setPage(1);\n  }, [search, roleFilter]);'
);

content = content.replace(
  '    return matchSearch && matchRole;\n  });',
  '    return matchSearch && matchRole;\n  });\n\n  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, 10, page);'
);

content = content.replace(
  'data={filtered}',
  'data={paginatedItems}'
);

content = content.replace(
  '          renderRow={(user: AdminUser) => (\n            <>',
  '          renderRow={(user: AdminUser) => (\n            <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">'
);

content = content.replace(
  '              </td>\n            </>',
  '              </td>\n            </tr>'
);

content = content.replace(
  '        />\n      </motion.div>',
  '        />\n        <PaginationControls\n          currentPage={safePage}\n          totalPages={totalPages}\n          totalItems={totalItems}\n          itemsPerPage={10}\n          onPageChange={setPage}\n        />\n      </motion.div>'
);

fs.writeFileSync(file, content);
console.log("Patched AdminUsuariosContent.tsx");
