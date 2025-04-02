import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: any;
  typeFilterOptions?: { value: string; label: string }[];
  typeFilterLabel?: string;
  statusFilterOptions?: { value: string; label: string; color?: string }[];
  statusFilterLabel?: string;
  typeFieldName?: string;
  statusFieldName?: string;
}

export function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  typeFilterOptions,
  typeFilterLabel = "Тип",
  statusFilterOptions,
  statusFilterLabel = "Статус",
  typeFieldName = "type",
  statusFieldName = "status"
}: FilterModalProps) {
  const [filters, setFilters] = useState({ ...initialFilters });
  const [activeFilters, setActiveFilters] = useState<{ key: string; value: string; label: string }[]>([]);

  useEffect(() => {
    // Обновляем активные фильтры при изменении фильтров
    const newActiveFilters: { key: string; value: string; label: string }[] = [];
    
    // Добавляем фильтр типа если он активен
    if (filters[typeFieldName] && filters[typeFieldName] !== 'ALL') {
      const typeOption = typeFilterOptions?.find(o => o.value === filters[typeFieldName]);
      if (typeOption) {
        newActiveFilters.push({ 
          key: typeFieldName, 
          value: filters[typeFieldName], 
          label: `${typeFilterLabel}: ${typeOption.label}` 
        });
      }
    }
    
    // Добавляем фильтр статуса если он активен
    if (filters[statusFieldName] && filters[statusFieldName] !== 'ALL') {
      const statusOption = statusFilterOptions?.find(o => o.value === filters[statusFieldName]);
      if (statusOption) {
        newActiveFilters.push({ 
          key: statusFieldName, 
          value: filters[statusFieldName], 
          label: `${statusFilterLabel}: ${statusOption.label}` 
        });
      }
    }
    
    // Добавляем фильтр поиска если он активен
    if (filters.search && filters.search.trim() !== '') {
      newActiveFilters.push({ 
        key: 'search', 
        value: filters.search, 
        label: `Поиск: ${filters.search}` 
      });
    }
    
    // Добавляем фильтр телефона если он активен
    if (filters.phone && filters.phone.trim() !== '') {
      newActiveFilters.push({ 
        key: 'phone', 
        value: filters.phone, 
        label: `Телефон: ${filters.phone}` 
      });
    }
    
    // Добавляем фильтр даты начала если он активен
    if (filters.dateFrom) {
      newActiveFilters.push({ 
        key: 'dateFrom', 
        value: filters.dateFrom.toString(), 
        label: `С: ${format(new Date(filters.dateFrom), 'dd.MM.yyyy')}` 
      });
    }
    
    // Добавляем фильтр даты окончания если он активен
    if (filters.dateTo) {
      newActiveFilters.push({ 
        key: 'dateTo', 
        value: filters.dateTo.toString(), 
        label: `По: ${format(new Date(filters.dateTo), 'dd.MM.yyyy')}` 
      });
    }
    
    setActiveFilters(newActiveFilters);
  }, [filters, statusFieldName, statusFilterLabel, statusFilterOptions, typeFieldName, typeFilterLabel, typeFilterOptions]);

  const handleTypeChange = (value: string) => {
    setFilters({
      ...filters,
      [typeFieldName]: value === 'ALL' ? undefined : value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      [statusFieldName]: value === 'ALL' ? undefined : value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      phone: e.target.value,
    });
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setFilters({
      ...filters,
      dateFrom: date,
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setFilters({
      ...filters,
      dateTo: date,
    });
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters };
    
    if (key === 'search') updatedFilters.search = '';
    else if (key === 'phone') updatedFilters.phone = '';
    else if (key === 'dateFrom') updatedFilters.dateFrom = undefined;
    else if (key === 'dateTo') updatedFilters.dateTo = undefined;
    else if (key === typeFieldName) updatedFilters[typeFieldName] = undefined;
    else if (key === statusFieldName) updatedFilters[statusFieldName] = undefined;
    
    setFilters(updatedFilters);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      ...initialFilters,
      search: "",
      phone: "",
      dateFrom: undefined,
      dateTo: undefined,
      [typeFieldName]: undefined,
      [statusFieldName]: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Фильтры</DialogTitle>
        </DialogHeader>
        
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 my-2">
            {activeFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="flex items-center gap-1 py-1 px-2"
              >
                {filter.label}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleRemoveFilter(filter.key)}
                />
              </Badge>
            ))}
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search" className="text-right">
              Поиск
            </Label>
            <Input
              id="search"
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Телефон
            </Label>
            <Input
              id="phone"
              value={filters.phone || ""}
              onChange={handlePhoneChange}
              className="col-span-3"
              placeholder="Введите номер телефона"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Дата с
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "PPP", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={handleDateFromChange}
                    initialFocus
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Дата по
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    {filters.dateTo ? (
                      format(filters.dateTo, "PPP", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={handleDateToChange}
                    initialFocus
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {typeFilterOptions && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                {typeFilterLabel}
              </Label>
              <div className="col-span-3">
                <Select
                  value={filters[typeFieldName] || "ALL"}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Выберите ${typeFilterLabel.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Все</SelectItem>
                    {typeFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {statusFilterOptions && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {statusFilterLabel}
              </Label>
              <div className="col-span-3">
                <Select
                  value={filters[statusFieldName] || "ALL"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Выберите ${statusFilterLabel.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Все</SelectItem>
                    {statusFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.color ? (
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "inline-block w-2 h-2 rounded-full", 
                              option.color
                            )}></span>
                            {option.label}
                          </div>
                        ) : (
                          option.label
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Сбросить
          </Button>
          <Button onClick={handleApply}>Применить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}