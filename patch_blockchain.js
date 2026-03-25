import fs from 'fs';
const file = 'src/components/admin/AdminBlockchainContent.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import DataTable from "@/components/shared/DataTable";',
  'import DataTable from "@/components/shared/DataTable";\nimport PaginationControls from "@/components/shared/PaginationControls";\nimport { usePagination } from "@/hooks/use-pagination";\nimport { useState } from "react";'
);

content = content.replace(
  'const AdminBlockchainContent = () => (',
  'const AdminBlockchainContent = () => {\n  const [page, setPage] = useState(1);\n  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(blockchainTransactions, 10, page);\n\n  return ('
);

content = content.replace(
  'data={blockchainTransactions}',
  'data={paginatedItems}'
);

content = content.replace(
  '          const cfg = statusConfig[tx.status];\n          return (\n            <>',
  '          const cfg = statusConfig[tx.status];\n          return (\n            <tr key={tx.hash} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">'
);

content = content.replace(
  '              </td>\n            </>',
  '              </td>\n            </tr>'
);

content = content.replace(
  '      />\n    </motion.div>\n  </div>\n);',
  '      />\n      <PaginationControls\n        currentPage={safePage}\n        totalPages={totalPages}\n        totalItems={totalItems}\n        itemsPerPage={10}\n        onPageChange={setPage}\n      />\n    </motion.div>\n  </div>\n);\n}'
);

fs.writeFileSync(file, content);
console.log("Patched AdminBlockchainContent.tsx");
