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
      <div className="pb-4 border-b border-gray-200">
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
        <nav className="flex border-b border-gray-200">
          <Link href="/">
            <a className={`px-4 py-2 text-sm font-medium ${
              location === "/requests" || location === "/"
                ? "text-[#3498DB] border-b-2 border-[#3498DB]"
                : "text-gray-500 hover:text-[#2C3E50] hover:border-[#2C3E50]"
            }`}>
              Запросы
            </a>
          </Link>
          <Link href="/users">
            <a className={`px-4 py-2 text-sm font-medium ${
              location === "/users"
                ? "text-[#3498DB] border-b-2 border-[#3498DB]"
                : "text-gray-500 hover:text-[#2C3E50] hover:border-[#2C3E50]"
            }`}>
              Пользователи
            </a>
          </Link>
          <Link href="/projects">
            <a className={`px-4 py-2 text-sm font-medium ${
              location === "/projects"
                ? "text-[#3498DB] border-b-2 border-[#3498DB]"
                : "text-gray-500 hover:text-[#2C3E50] hover:border-[#2C3E50]"
            }`}>
              Проекты
            </a>
          </Link>
        </nav>
      </div>
    </div>
  );
}
