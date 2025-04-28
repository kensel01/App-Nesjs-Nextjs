import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // No renderizar paginación si solo hay una página
  if (totalPages <= 1) return null;

  // Generar los números de página a mostrar
  const generatePagination = () => {
    // Siempre mostrar la primera y última página
    // Para páginas intermedias, mostrar la actual y una o dos páginas antes/después
    const pages = [];
    
    // Primera página
    pages.push(1);
    
    // Páginas intermedias
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Ajustar si estamos en el extremo
    if (currentPage <= 2) {
      endPage = Math.min(totalPages - 1, 3);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 2);
    }
    
    // Añadir ellipsis antes de páginas intermedias si es necesario
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    // Añadir páginas intermedias
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Añadir ellipsis después de páginas intermedias si es necesario
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    // Última página (si hay más de una)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = generatePagination();

  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pages.map((page, i) => {
        // Renderizar ellipsis
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <Button
              key={`ellipsis-${i}`}
              variant="ghost"
              size="icon"
              disabled
              className="cursor-default"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }
        
        // Renderizar botón de página
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            className={cn(
              "h-8 w-8",
              currentPage === page && "pointer-events-none"
            )}
            onClick={() => onPageChange(Number(page))}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
} 