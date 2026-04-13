import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface DataTableColumn {
  key: string;
  label: string;
  hideOn?: "sm" | "md" | "lg";
  align?: "left" | "right" | "center";
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  header?: ReactNode;
  animated?: boolean;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc" | null;
}

function DataTable<T>({ columns, data, renderRow, emptyMessage = "Nenhum item encontrado.", header, animated = false, onSort, sortKey, sortDirection }: DataTableProps<T>) {
  const hideClass = (col: DataTableColumn) => {
    if (!col.hideOn) return "";
    return col.hideOn === "sm" ? "hidden sm:table-cell" : col.hideOn === "md" ? "hidden md:table-cell" : "hidden lg:table-cell";
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {header && <div className="p-4 border-b border-border">{header}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3 px-4 text-muted-foreground font-medium ${
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                  } ${hideClass(col)} ${col.sortable ? "cursor-pointer select-none hover:bg-secondary/50" : ""}`}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"}`}>
                    {col.label}
                    {col.sortable && (
                      <span className="inline-flex">
                        {sortKey === col.key ? (
                          sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, i) => renderRow(item, i))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
export type { DataTableColumn };
