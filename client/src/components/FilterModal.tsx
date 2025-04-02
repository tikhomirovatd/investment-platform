import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: any;
  typeFilterOptions?: { value: string; label: string }[];
  typeFilterLabel?: string;
  statusFilterOptions?: { value: string; label: string }[];
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

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      ...initialFilters,
      search: "",
      [typeFieldName]: undefined,
      [statusFieldName]: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Фильтры</DialogTitle>
        </DialogHeader>
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

          {typeFilterOptions && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                {typeFilterLabel}
              </Label>
              <div className="col-span-3">
                <Select
                  defaultValue={filters[typeFieldName] || "ALL"}
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
                  defaultValue={filters[statusFieldName] || "ALL"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Выберите ${statusFilterLabel.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Все</SelectItem>
                    {statusFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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