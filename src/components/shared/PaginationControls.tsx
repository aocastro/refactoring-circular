import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between pt-2" aria-label="Navegação de páginas">
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {start}–{end} de {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8 border-border" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} aria-label="Página anterior">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="icon"
            className={`h-8 w-8 ${p !== currentPage ? "border-border" : ""}`}
            onClick={() => onPageChange(p)}
            aria-label={`Ir para a página ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Button>
        ))}
        <Button variant="outline" size="icon" className="h-8 w-8 border-border" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} aria-label="Próxima página">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;

