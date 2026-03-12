import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface DataTableColumn {
  key: string;
  label: string;
  hideOn?: "sm" | "md" | "lg";
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: DataTableColumn[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  header?: ReactNode;
  animated?: boolean;
}

function DataTable<T>({ columns, data, renderRow, emptyMessage = "Nenhum item encontrado.", header, animated = false }: DataTableProps<T>) {
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
                  } ${hideClass(col)}`}
                >
                  {col.label}
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
