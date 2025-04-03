import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MainTabs } from "@/components/MainTabs";
import { FilterBar } from "@/components/FilterBar";
import { DataTable } from "@/components/DataTableSortable";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Project, ProjectFilter } from "@/lib/types";
import { useNotification } from "@/layouts/MainLayout";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { FilterModal } from "@/components/FilterModal";
import { Badge } from "@/components/ui/badge";
import { ru } from "date-fns/locale";

export default function Projects() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<ProjectFilter>({
    search: "",
    isCompleted: false,
    dealType: undefined,
    industry: undefined,
  });
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const { addNotification } = useNotification();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects', activeTab],
    select: (data: Project[]) => {
      let filteredData = data;
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredData = filteredData.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.industry.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.dealType) {
        filteredData = filteredData.filter(p => p.dealType === filter.dealType);
      }
      
      if (filter.industry) {
        filteredData = filteredData.filter(p => p.industry === filter.industry);
      }
      
      // Сортировка данных
      const sortedData = [...filteredData];
      
      if (sortOrder === "newest") {
        sortedData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortOrder === "oldest") {
        sortedData.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      
      return sortedData;
    }
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: (params: { id: number, isVisible: boolean }) => 
      apiRequest("PATCH", `/api/projects/${params.id}`, { isVisible: params.isVisible })
        .then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      addNotification({ 
        type: "success", 
        title: "Видимость проекта обновлена" 
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest("DELETE", `/api/projects/${id}`, undefined)
        .then(res => res),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      addNotification({ 
        type: "success", 
        title: "Проект удален" 
      });
    },
  });

  const handleSearch = (value: string) => {
    setFilter({
      ...filter,
      search: value,
    });
  };
  
  const handleDealTypeFilterChange = (value: string) => {
    setFilter({
      ...filter,
      dealType: value === 'ALL' ? undefined : value as 'SALE' | 'INVESTMENT',
    });
  };

  const toggleVisibility = (project: Project, isVisible: boolean) => {
    toggleVisibilityMutation.mutate({ id: project.id, isVisible });
  };

  const deleteProject = (project: Project) => {
    if (window.confirm(`Вы уверены, что хотите удалить проект "${project.name}"?`)) {
      deleteProjectMutation.mutate(project.id);
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd.MM.yyyy в HH:mm", { locale: ru });
  };

  const columns = [
    {
      key: "name",
      header: "Название проекта",
      cell: (row: Project) => (
        <span className="font-medium">{row.name}</span>
      ),
      sortable: true,
    },
    {
      key: "dealType",
      header: "Тип сделки",
      cell: (row: Project) => (
        <Badge className={row.dealType === 'SALE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
          {row.dealType === 'SALE' ? 'Продажа' : 'Инвестиции'}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "industry",
      header: "Отрасль",
      sortable: true,
    },
    {
      key: "createdAt",
      header: "Дата создания",
      cell: (row: Project) => formatDate(row.createdAt),
      sortable: true,
    },
    {
      key: "isVisible",
      header: "Видимость",
      cell: (row: Project) => (
        <Switch 
          checked={row.isVisible}
          onCheckedChange={(checked) => toggleVisibility(row, checked)}
        />
      ),
      sortable: false,
    },
  ];

  return (
    <div>
      <MainTabs onCreateClick={() => setIsCreateModalOpen(true)} />
      
      <div className="mt-4">
        {/* Subtabs for Projects */}
        <div className="flex mb-4 gap-2">
          <Badge 
            className={`px-4 py-2 rounded-full cursor-pointer ${
              activeTab === "active" 
                ? "bg-[#2B2D33] text-white" 
                : "bg-[#F6F6F6] text-[#2B2D33] border border-gray-200"
            }`}
            onClick={() => {
              setActiveTab("active");
              setFilter({...filter, isCompleted: false});
            }}
          >
            Активные
          </Badge>
          <Badge 
            className={`px-4 py-2 rounded-full cursor-pointer ${
              activeTab === "completed" 
                ? "bg-[#2B2D33] text-white" 
                : "bg-[#F6F6F6] text-[#2B2D33] border border-gray-200"
            }`}
            onClick={() => {
              setActiveTab("completed");
              setFilter({...filter, isCompleted: true});
            }}
          >
            Завершенные
          </Badge>
        </div>

        <FilterBar 
          onSearchChange={handleSearch}
          onSortChange={(value) => {
            setSortOrder(value);
            queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
          }}
          onFilterClick={() => setIsFilterModalOpen(true)}
          onTypeFilterChange={handleDealTypeFilterChange}
          typeFilterOptions={[
            { value: "SALE", label: "Продажа" },
            { value: "INVESTMENT", label: "Инвестиции" }
          ]}
          typeFilterLabel="Тип сделки"
          searchPlaceholder="Поиск по названию"
        />

        {isLoading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <>
            <DataTable 
              data={projects}
              columns={columns}
              keyField="id"
              onEdit={() => {}}
              onDelete={deleteProject}
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{projects.length}</span> of <span className="font-medium">{projects.length}</span> projects
              </div>
            </div>
          </>
        )}
      </div>

      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          addNotification({ 
            type: "success", 
            title: "Новая карточка проекта создана" 
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
          { value: "SALE", label: "Продажа" },
          { value: "INVESTMENT", label: "Инвестиции" }
        ]}
        typeFilterLabel="Тип сделки"
        typeFieldName="dealType"
        // Предполагаем, что у нас есть набор отраслей
        statusFilterOptions={[
          { value: "Энергетика", label: "Энергетика" },
          { value: "Финансы", label: "Финансы" },
          { value: "Технологии", label: "Технологии" },
          { value: "Производство", label: "Производство" },
          { value: "Розничная торговля", label: "Розничная торговля" }
        ]}
        statusFilterLabel="Отрасль"
        statusFieldName="industry"
      />
    </div>
  );
}
