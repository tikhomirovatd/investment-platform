import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainTabs } from "@/components/MainTabs";
import { FilterBar } from "@/components/FilterBar";
import { DataTable } from "@/components/DataTableSortable";
import { Request, RequestFilter } from "@/lib/types";
import { useNotification } from "@/layouts/MainLayout";
import { CreateRequestModal } from "@/components/CreateRequestModal";
import { FilterModal } from "@/components/FilterModal";
import { ActiveFilters } from "@/components/ActiveFilters";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export default function Requests() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<RequestFilter & {
    phone?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }>({
    search: "",
    userType: undefined,
    status: undefined,
    phone: "",
    dateFrom: undefined,
    dateTo: undefined,
  });
  
  const [activeFilters, setActiveFilters] = useState<Array<{ key: string; value: string; label: string }>>([]);

  const { addNotification } = useNotification();
  
  // Обновляем активные фильтры при изменении фильтров
  useEffect(() => {
    const newActiveFilters: { key: string; value: string; label: string }[] = [];
    
    // Добавляем фильтр типа если он активен
    if (filter.userType) {
      const typeLabel = filter.userType === 'SELLER' ? 'Продавец' : 'Покупатель';
      newActiveFilters.push({ 
        key: 'userType', 
        value: filter.userType, 
        label: `Тип: ${typeLabel}` 
      });
    }
    
    // Добавляем фильтр статуса если он активен
    if (filter.status) {
      let statusLabel;
      switch(filter.status) {
        case 'NEW': statusLabel = 'Новый'; break;
        case 'IN_PROGRESS': statusLabel = 'В процессе'; break;
        case 'COMPLETED': statusLabel = 'Завершен'; break;
        case 'REJECTED': statusLabel = 'Отклонен'; break;
        default: statusLabel = filter.status;
      }
      newActiveFilters.push({ 
        key: 'status', 
        value: filter.status, 
        label: `Статус: ${statusLabel}` 
      });
    }
    
    // Добавляем фильтр поиска если он активен
    if (filter.search && filter.search.trim() !== '') {
      newActiveFilters.push({ 
        key: 'search', 
        value: filter.search, 
        label: `Поиск: ${filter.search}` 
      });
    }
    
    // Добавляем фильтр телефона если он активен
    if (filter.phone && filter.phone.trim() !== '') {
      newActiveFilters.push({ 
        key: 'phone', 
        value: filter.phone, 
        label: `Телефон: ${filter.phone}` 
      });
    }
    
    // Добавляем фильтр даты начала если он активен
    if (filter.dateFrom) {
      newActiveFilters.push({ 
        key: 'dateFrom', 
        value: filter.dateFrom.toString(), 
        label: `С: ${format(new Date(filter.dateFrom), 'dd.MM.yyyy', { locale: ru })}` 
      });
    }
    
    // Добавляем фильтр даты окончания если он активен
    if (filter.dateTo) {
      newActiveFilters.push({ 
        key: 'dateTo', 
        value: filter.dateTo.toString(), 
        label: `По: ${format(new Date(filter.dateTo), 'dd.MM.yyyy', { locale: ru })}` 
      });
    }
    
    setActiveFilters(newActiveFilters);
  }, [filter]);
  
  // Функция удаления фильтра при клике на крестик
  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filter };
    
    if (key === 'search') updatedFilters.search = '';
    else if (key === 'phone') updatedFilters.phone = '';
    else if (key === 'dateFrom') updatedFilters.dateFrom = undefined;
    else if (key === 'dateTo') updatedFilters.dateTo = undefined;
    else if (key === 'userType') updatedFilters.userType = undefined;
    else if (key === 'status') updatedFilters.status = undefined;
    
    setFilter(updatedFilters);
  };

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['/api/requests'],
    select: (data: Request[]) => {
      let filteredData = data;
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredData = filteredData.filter(r => 
          r.topic.toLowerCase().includes(searchLower) ||
          r.fullName.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.userType) {
        filteredData = filteredData.filter(r => r.userType === filter.userType);
      }
      
      if (filter.status) {
        filteredData = filteredData.filter(r => r.status === filter.status);
      }
      
      if (filter.phone) {
        filteredData = filteredData.filter(r => 
          r.phone && r.phone.includes(filter.phone!)
        );
      }
      
      if (filter.dateFrom) {
        const dateFrom = filter.dateFrom;
        filteredData = filteredData.filter(r => {
          const createdAt = new Date(r.createdAt);
          return isAfter(createdAt, dateFrom) || createdAt.getTime() === dateFrom.getTime();
        });
      }
      
      if (filter.dateTo) {
        const dateTo = filter.dateTo;
        // Устанавливаем время конца дня для датыTo
        const dateToEnd = new Date(dateTo);
        dateToEnd.setHours(23, 59, 59, 999);
        
        filteredData = filteredData.filter(r => {
          const createdAt = new Date(r.createdAt);
          return isBefore(createdAt, dateToEnd) || createdAt.getTime() === dateToEnd.getTime();
        });
      }
      
      return filteredData;
    }
  });

  const handleSearch = (value: string) => {
    setFilter({
      ...filter,
      search: value,
    });
  };
  
  const handleTypeFilterChange = (value: string) => {
    setFilter({
      ...filter,
      userType: value === 'ALL' ? undefined : value as 'SELLER' | 'BUYER',
    });
  };
  
  const handleStatusFilterChange = (value: string) => {
    setFilter({
      ...filter,
      status: value === 'ALL' ? undefined : value as 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED',
    });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd.MM.yyyy в HH:mm", { locale: ru });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'NEW':
        return <Badge className="bg-[rgb(235,230,250)] text-purple-800">Новый</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-[rgb(254,233,209)] text-orange-800">В процессе</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Завершен</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Отклонен</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const statusColors = {
    'NEW': 'bg-[rgb(235,230,250)] text-purple-800',
    'IN_PROGRESS': 'bg-[rgb(254,233,209)] text-orange-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800'
  };

  const columns = [
    {
      key: "userType",
      header: "Тип",
      cell: (row: Request) => (
        <span>{row.userType === 'SELLER' ? 'Продавец' : 'Покупатель'}</span>
      ),
      sortable: true,
    },
    {
      key: "topic",
      header: "Тема",
      cell: (row: Request) => (
        <span className="font-medium">{row.topic}</span>
      ),
      sortable: true,
    },
    {
      key: "createdAt",
      header: "Дата создания",
      cell: (row: Request) => formatDate(row.createdAt),
      sortable: true,
    },
    {
      key: "status",
      header: "Статус",
      cell: (row: Request) => getStatusBadge(row.status),
      sortable: true,
    },
    {
      key: "fullName",
      header: "Полное имя",
      sortable: true,
    },
    {
      key: "phone",
      header: "Телефон",
      sortable: true,
    },
    {
      key: "comments",
      header: "Комментарии",
      sortable: false,
    },
  ];

  return (
    <div>
      <MainTabs onCreateClick={() => setIsCreateModalOpen(true)} />
      
      <div className="mt-4">
        <FilterBar 
          onSearchChange={handleSearch}
          onSortChange={(value) => console.log("Sort by:", value)}
          onFilterClick={() => setIsFilterModalOpen(true)}
          onTypeFilterChange={handleTypeFilterChange}
          typeFilterOptions={[
            { value: "SELLER", label: "Продавец" },
            { value: "BUYER", label: "Покупатель" }
          ]}
          typeFilterLabel="Тип пользователя"
          onStatusFilterChange={handleStatusFilterChange}
          statusFilterOptions={[
            { value: "NEW", label: "Новый" },
            { value: "IN_PROGRESS", label: "В процессе" },
            { value: "COMPLETED", label: "Завершен" },
            { value: "REJECTED", label: "Отклонен" }
          ]}
          statusFilterLabel="Статус"
          searchPlaceholder="Поиск по теме или имени"
        />

        <ActiveFilters
          filters={activeFilters}
          onRemove={handleRemoveFilter}
        />

        {isLoading ? (
          <div className="flex justify-center py-8">Загрузка...</div>
        ) : (
          <>
            <DataTable 
              data={requests}
              columns={columns}
              keyField="id"
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Показано <span className="font-medium">1</span> - <span className="font-medium">{requests.length}</span> из <span className="font-medium">{requests.length}</span> запросов
              </div>
            </div>
          </>
        )}
      </div>

      <CreateRequestModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          addNotification({ 
            type: "success", 
            title: "Новый запрос создан" 
          });
        }}
      />

      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => {
          setFilter(newFilters);
          addNotification({
            type: "success",
            title: "Фильтры применены"
          });
        }}
        initialFilters={filter}
        typeFilterOptions={[
          { value: "SELLER", label: "Продавец" },
          { value: "BUYER", label: "Покупатель" }
        ]}
        typeFilterLabel="Тип пользователя"
        typeFieldName="userType"
        statusFilterOptions={[
          { value: "NEW", label: "Новый", color: "bg-[rgb(235,230,250)]" },
          { value: "IN_PROGRESS", label: "В процессе", color: "bg-[rgb(254,233,209)]" },
          { value: "COMPLETED", label: "Завершен", color: "bg-green-100" },
          { value: "REJECTED", label: "Отклонен", color: "bg-red-100" }
        ]}
        statusFilterLabel="Статус"
        statusFieldName="status"
      />
    </div>
  );
}
