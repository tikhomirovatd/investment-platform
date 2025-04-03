import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFilter {
  key: string;
  value: string;
  label: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
}

export function ActiveFilters({ filters, onRemove }: ActiveFiltersProps) {
  if (filters.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 my-3">
      {filters.map((filter, index) => (
        <Badge 
          key={index} 
          variant="outline" 
          className="flex items-center gap-1 py-1.5 px-3 bg-[rgb(240,236,236)]"
        >
          {filter.label}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => onRemove(filter.key)}
          />
        </Badge>
      ))}
    </div>
  );
}