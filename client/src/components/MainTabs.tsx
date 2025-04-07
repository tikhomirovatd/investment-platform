import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MainTabsProps {
  onCreateClick: () => void;
}

export function MainTabs({ onCreateClick }: MainTabsProps) {
  const [location] = useLocation();

  return (
    <div>
      <div className="pb-4">
        <Button 
          onClick={onCreateClick}
          variant="accent"
          className="flex items-center text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Создать
        </Button>
      </div>

      <div className="mt-4">
        <nav className="flex">
          <Link href="/requests" className={`px-4 py-2 text-sm font-medium ${
            location === "/requests" || location === "/"
              ? "text-[rgb(43,45,51)] border-b-2 border-[rgb(43,45,51)]"
              : "text-gray-500 hover:text-[rgb(43,45,51)] hover:border-[rgb(43,45,51)]"
          }`}>
            Запросы
          </Link>
          <Link href="/users" className={`px-4 py-2 text-sm font-medium ${
            location === "/users"
              ? "text-[rgb(43,45,51)] border-b-2 border-[rgb(43,45,51)]"
              : "text-gray-500 hover:text-[rgb(43,45,51)] hover:border-[rgb(43,45,51)]"
          }`}>
            Пользователи
          </Link>
          <Link href="/projects" className={`px-4 py-2 text-sm font-medium ${
            location === "/projects"
              ? "text-[rgb(43,45,51)] border-b-2 border-[rgb(43,45,51)]"
              : "text-gray-500 hover:text-[rgb(43,45,51)] hover:border-[rgb(43,45,51)]"
          }`}>
            Проекты
          </Link>
        </nav>
      </div>
    </div>
  );
}
