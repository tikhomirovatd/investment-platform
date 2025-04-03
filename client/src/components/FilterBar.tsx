import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
  onSearchChange: (value: string) => void;
  onSortChange?: (value: string) => void;
  onFilterClick?: () => void;
  onTypeFilterChange?: (type: string) => void;
  typeFilterOptions?: { value: string; label: string }[];
  typeFilterLabel?: string;
  onStatusFilterChange?: (status: string) => void;
  statusFilterOptions?: { value: string; label: string }[];
  statusFilterLabel?: string;
  searchPlaceholder?: string;
}

export function FilterBar({ 
  onSearchChange, 
  onSortChange, 
  onFilterClick,
  onTypeFilterChange,
  typeFilterOptions,
  typeFilterLabel = "Тип",
  onStatusFilterChange,
  statusFilterOptions,
  statusFilterLabel = "Статус",
  searchPlaceholder = "Search"
}: FilterBarProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        {onFilterClick && (
          <Button 
            variant="outline" 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center bg-white mr-2"
            onClick={onFilterClick}
          >
            <Filter className="h-4 w-4 mr-1" />
            Фильтры
          </Button>
        )}
        
        {onTypeFilterChange && typeFilterOptions && (
          <div className="relative mr-2">
            <Select onValueChange={onTypeFilterChange} defaultValue="ALL">
              <SelectTrigger className="w-[180px] h-10 text-sm border border-gray-300">
                <SelectValue placeholder={typeFilterLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все типы</SelectItem>
                {typeFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {onStatusFilterChange && statusFilterOptions && (
          <div className="relative mr-2">
            <Select onValueChange={onStatusFilterChange} defaultValue="ALL">
              <SelectTrigger className="w-[150px] h-10 text-sm border border-gray-300">
                <SelectValue placeholder={statusFilterLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все статусы</SelectItem>
                {statusFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <div className="relative mr-2 w-64">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#3498DB] focus:border-[#3498DB]"
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {onSortChange && (
          <div className="relative">
            <Select onValueChange={onSortChange}>
              <SelectTrigger className="w-[130px] h-10 text-sm">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
