import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainTabs } from "@/components/MainTabs";
import { FilterBar } from "@/components/FilterBar";
import { DataTable } from "@/components/DataTable";
import { User, UserFilter } from "@/lib/types";
import { useNotification } from "@/layouts/MainLayout";
import { CreateUserModal } from "@/components/CreateUserModal";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function Users() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<UserFilter>({
    search: "",
  });

  const { addNotification } = useNotification();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/users'],
    select: (data: User[]) => {
      let filteredData = data;
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredData = filteredData.filter(u => 
          u.username.toLowerCase().includes(searchLower) ||
          u.organizationName.toLowerCase().includes(searchLower) ||
          u.fullName.toLowerCase().includes(searchLower)
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

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Никогда";
    return format(new Date(date), "dd.MM.yyyy в HH:mm", { locale: ru });
  };

  const columns = [
    {
      key: "userType",
      header: "Тип",
      cell: (row: User) => (
        <span>{row.userType === 'SELLER' ? 'Продавец' : 'Покупатель'}</span>
      ),
    },
    {
      key: "username",
      header: "Логин",
      cell: (row: User) => (
        <span className="font-medium">{row.username}</span>
      ),
    },
    {
      key: "organizationName",
      header: "Организация",
    },
    {
      key: "lastAccess",
      header: "Последний доступ",
      cell: (row: User) => formatDate(row.lastAccess),
    },
    {
      key: "comments",
      header: "Комментарии",
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
          searchPlaceholder="Поиск по логину или организации"
        />

        {isLoading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <>
            <DataTable 
              data={users}
              columns={columns}
              keyField="id"
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of <span className="font-medium">{users.length}</span> users
              </div>
            </div>
          </>
        )}
      </div>

      <CreateUserModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          addNotification({ 
            type: "success", 
            title: "Новый пользователь создан" 
          });
        }}
      />
    </div>
  );
}
