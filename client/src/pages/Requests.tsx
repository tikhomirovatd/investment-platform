import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainTabs } from "@/components/MainTabs";
import { FilterBar } from "@/components/FilterBar";
import { DataTable } from "@/components/DataTableSortable";
import { Request, RequestFilter } from "@/lib/types";
import { useNotification } from "@/layouts/MainLayout";
import { CreateRequestModal } from "@/components/CreateRequestModal";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function Requests() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<RequestFilter>({
    search: "",
  });

  const { addNotification } = useNotification();

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
      
      return filteredData;
    }
  });

  const handleSearch = (value: string) => {
    setFilter({
      ...filter,
      search: value,
    });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd.MM.yyyy в HH:mm", { locale: ru });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'NEW':
        return <Badge className="bg-blue-100 text-blue-800">Новый</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-yellow-100 text-yellow-800">В процессе</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Завершен</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Отклонен</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
          onFilterClick={() => console.log("Filter button clicked")}
          searchPlaceholder="Поиск по теме или имени"
        />

        {isLoading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <>
            <DataTable 
              data={requests}
              columns={columns}
              keyField="id"
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{requests.length}</span> of <span className="font-medium">{requests.length}</span> requests
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
    </div>
  );
}
