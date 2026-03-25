import fs from 'fs';
const file = 'src/components/admin/AdminNPSContent.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import DataTable from "@/components/shared/DataTable";',
  'import DataTable from "@/components/shared/DataTable";\nimport PaginationControls from "@/components/shared/PaginationControls";\nimport { usePagination } from "@/hooks/use-pagination";\nimport { useEffect } from "react";'
);

content = content.replace(
  'const [responses, setResponses] = useState<NPSResponse[]>(adminNpsResponses);',
  'const [responses, setResponses] = useState<NPSResponse[]>(adminNpsResponses);\n  const [page, setPage] = useState(1);\n\n  useEffect(() => {\n    setPage(1);\n  }, [search, statusFilter]);'
);

content = content.replace(
  '    return matchSearch && matchStatus;\n  });',
  '    return matchSearch && matchStatus;\n  });\n\n  const { paginatedItems, totalPages, safePage, totalItems } = usePagination(filtered, 10, page);'
);

content = content.replace(
  'data={filtered}',
  'data={paginatedItems}'
);

content = content.replace(
  '          renderRow={(r: NPSResponse) => (\n              <>',
  '          renderRow={(r: NPSResponse) => (\n              <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">'
);

content = content.replace(
  '                </td>\n              </>',
  '                </td>\n              </tr>'
);

content = content.replace(
  '          />\n        </motion.div>',
  '          />\n          <PaginationControls\n            currentPage={safePage}\n            totalPages={totalPages}\n            totalItems={totalItems}\n            itemsPerPage={10}\n            onPageChange={setPage}\n          />\n        </motion.div>'
);

fs.writeFileSync(file, content);
console.log("Patched AdminNPSContent.tsx");
