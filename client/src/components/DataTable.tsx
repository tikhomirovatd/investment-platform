import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Edit, Trash, X } from "lucide-react";

interface Column<T> {
  key: string | keyof T;
  header: string;
  width?: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onToggleVisibility?: (item: T, visibility: boolean) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  onEdit,
  onDelete,
  onToggleVisibility
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<Set<T[keyof T]>>(new Set());

  const toggleItemSelection = (id: T[keyof T]) => {
    const newSelection = new Set(selectedItems);
    if (selectedItems.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleAllSelection = () => {
    if (selectedItems.size === data.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = data.map((item) => item[keyField]);
      setSelectedItems(new Set(allIds));
    }
  };

  return (
    <div className="mt-4 bg-white rounded-md shadow overflow-hidden relative">
      {selectedItems.size > 0 && (
        <div 
          className="fixed bottom-8 z-50 mx-auto left-0 right-0"
          style={{
            padding: "8px 32px",
            background: "rgb(43, 45, 51)",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            borderRadius: "8px",
            height: "52px",
            justifyContent: "space-between",
            maxWidth: "100%",
            width: "100%"
          }}
        >
          <div className="flex items-center">
            <span className="text-white mr-4">Выбрано: {selectedItems.size}</span>
            
            {onEdit && selectedItems.size === 1 && (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-[#3d4048] mr-2 flex items-center gap-1"
                onClick={() => {
                  // Находим выбранный элемент и редактируем его
                  const selectedId = Array.from(selectedItems)[0];
                  const selectedItem = data.find(item => item[keyField] === selectedId);
                  if (selectedItem) onEdit(selectedItem);
                }}
              >
                <Edit size={16} />
                <span>Редактировать</span>
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-[#3d4048] flex items-center gap-1"
                onClick={() => {
                  // Если выбрана только одна строка
                  if (selectedItems.size === 1) {
                    const selectedId = Array.from(selectedItems)[0];
                    const selectedItem = data.find(item => item[keyField] === selectedId);
                    if (selectedItem) onDelete(selectedItem);
                  } 
                  // Для множественного выбора пока запускаем то же действие для первого элемента
                  // В будущем можно расширить функциональность для множественного удаления
                  else if (selectedItems.size > 1) {
                    const selectedId = Array.from(selectedItems)[0];
                    const selectedItem = data.find(item => item[keyField] === selectedId);
                    if (selectedItem) onDelete(selectedItem);
                  }
                }}
              >
                <Trash size={16} />
                <span>Удалить</span>
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            className="text-white hover:bg-[#3d4048] p-1 rounded-full h-8 w-8"
            onClick={() => setSelectedItems(new Set())}
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-8 px-3 py-3">
                <Checkbox 
                  checked={data.length > 0 && selectedItems.size === data.length}
                  onCheckedChange={toggleAllSelection}
                  className="h-4 w-4 rounded border-gray-300 text-[#3498DB] focus:ring-[#3498DB]"
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead 
                  key={column.key.toString()} 
                  className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width ? column.width : ''}`}
                >
                  {column.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && (
                <TableHead className="relative px-3 py-3">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <TableRow key={String(row[keyField])}>
                <TableCell className="px-3 py-3 whitespace-nowrap">
                  <Checkbox 
                    checked={selectedItems.has(row[keyField])}
                    onCheckedChange={() => toggleItemSelection(row[keyField])}
                    className="h-4 w-4 rounded border-gray-300 text-[#3498DB] focus:ring-[#3498DB]"
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.key.toString()} className="px-3 py-3 whitespace-nowrap text-sm">
                    {column.cell ? column.cell(row) : String(row[column.key as keyof T] || '')}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      {onEdit && (
                        <Button 
                          variant="ghost" 
                          onClick={() => onEdit(row)}
                          className="text-[#3498DB] hover:text-[#2980b9] text-xs font-medium mr-2"
                        >
                          Редактировать
                        </Button>
                      )}
                      {onDelete && (
                        <Button 
                          variant="ghost" 
                          onClick={() => onDelete(row)}
                          className="text-gray-600 hover:text-gray-800 text-xs font-medium"
                        >
                          Удалить
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
