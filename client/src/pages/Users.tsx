import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainTabs } from "@/components/MainTabs";
import { FilterBar } from "@/components/FilterBar";
import { DataTable } from "@/components/DataTableSortable";
import { User, UserFilter } from "@/lib/types";
import { useNotification } from "@/layouts/MainLayout";
import { CreateUserModal } from "@/components/CreateUserModal";
import { FilterModal } from "@/components/FilterModal";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function Users() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<UserFilter>({
    search: "",
    userType: undefined,
    organization: undefined,
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
      
      if (filter.userType) {
        filteredData = filteredData.filter(u => u.userType === filter.userType);
      }
      
      if (filter.organization) {
        filteredData = filteredData.filter(u => u.organizationName === filter.organization);
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
  
  const handleUserTypeFilterChange = (value: string) => {
    setFilter({
      ...filter,
      userType: value === 'ALL' ? undefined : value as 'SELLER' | 'BUYER',
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
      sortable: true,
    },
    {
      key: "username",
      header: "Логин",
      cell: (row: User) => (
        <span className="font-medium">{row.username}</span>
      ),
      sortable: true,
    },
    {
      key: "organizationName",
      header: "Организация",
      sortable: true,
    },
    {
      key: "lastAccess",
      header: "Последний доступ",
      cell: (row: User) => formatDate(row.lastAccess),
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
          onTypeFilterChange={handleUserTypeFilterChange}
          typeFilterOptions={[
            { value: "SELLER", label: "Продавец" },
            { value: "BUYER", label: "Покупатель" }
          ]}
          typeFilterLabel="Тип пользователя"
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

      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => {
          setFilter({...filter, ...newFilters});
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
        // Создаем набор уникальных организаций для фильтра
        statusFilterOptions={users
          .filter((user, index, self) => 
            self.findIndex(u => u.organizationName === user.organizationName) === index
          )
          .map(user => ({ 
            value: user.organizationName, 
            label: user.organizationName 
          }))}
        statusFilterLabel="Организация"
        statusFieldName="organization"
      />
    </div>
  );
}
