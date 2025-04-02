import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Если страниц меньше 2, не показываем пагинацию
  if (totalPages <= 1) return null;
  
  // Массив страниц для отображения в пагинации
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    
    // Показываем до 5 номеров страниц
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Корректируем, если не хватает страниц справа
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Кнопка "..." если есть страницы перед текущими */}
      {pageNumbers[0] > 1 && (
        <Button variant="outline" size="icon" disabled>
          ...
        </Button>
      )}
      
      {/* Отображаем номера страниц */}
      {pageNumbers.map(number => (
        <Button
          key={number}
          variant={currentPage === number ? "default" : "outline"}
          onClick={() => onPageChange(number)}
          className={currentPage === number ? "bg-[#3498DB] hover:bg-[#2980b9]" : ""}
        >
          {number}
        </Button>
      ))}
      
      {/* Кнопка "..." если есть страницы после текущих */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <Button variant="outline" size="icon" disabled>
          ...
        </Button>
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}