import { Link, useLocation } from "wouter";

export function Sidebar() {
  const [location] = useLocation();

  const menuItems = [
    { path: "/rbp", label: "RBP" },
    { path: "/news", label: "Новости" },
    { path: "/nps", label: "NPS" },
    { path: "/reports", label: "Отчеты" },
    { path: "/compliance", label: "Compliance" },
    { path: "/factoring", label: "Факторинг" },
    { path: "/trade-finance", label: "Торговое финансирование" },
    { path: "/requests", label: "M&A Платформа" },
  ];

  // Определяем, является ли пункт меню активным
  const isItemActive = (path: string) => {
    if (path === "/requests") {
      return ["/", "/requests", "/users", "/projects"].some(p => location.startsWith(p));
    }
    return location === path;
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 h-screen fixed">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-yellow-400 flex items-center justify-center rounded mr-2">
            <span className="text-black font-bold text-xl">X</span>
          </div>
          <div>
            <div className="font-semibold text-sm">Райффайзен</div>
            <div className="text-xs">Бизнес Онлайн</div>
          </div>
        </div>
      </div>
      
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className={`flex items-center px-4 py-3 text-sm hover:bg-gray-100 ${
                isItemActive(item.path) ? "bg-gray-100 font-medium" : ""
              }`}>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
