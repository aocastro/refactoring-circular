import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";

export interface FilterField {
  key: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterField[];
  actions?: ReactNode;
}

const FilterToolbar = ({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  actions,
}: FilterToolbarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const activeCount = filters.filter((f) => f.value !== "Todos").length;

  const clearAll = () => {
    filters.forEach((f) => f.onChange("Todos"));
    onSearchChange("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="flex gap-2">
          {filters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-border"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
              {activeCount > 0 && (
                <span className="ml-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </Button>
          )}
          {actions}
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Filtros Avançados</h4>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs text-accent hover:underline flex items-center gap-1">
                <X className="h-3 w-3" /> Limpar filtros
              </button>
            )}
          </div>
          <div className={`grid grid-cols-1 gap-3 ${filters.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {filters.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <Select value={f.value} onValueChange={f.onChange}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FilterToolbar;
