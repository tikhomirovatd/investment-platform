import { Link, useLocation } from "wouter";

export function Sidebar() {
  const [location] = useLocation();

  const menuItems = [
    { path: "/rbp", label: "RBP", active: false },
    { path: "/news", label: "Новости", active: false },
    { path: "/nps", label: "NPS", active: false },
    { path: "/reports", label: "Отчеты", active: false },
    { path: "/compliance", label: "Compliance", active: false },
    { path: "/factoring", label: "Факторинг", active: false },
    { path: "/trade-finance", label: "Торговое финансирование", active: false },
    { path: "/", label: "M&A Платформа", active: true },
  ];

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
              <Link href={item.path}>
                <a className={`flex items-center px-4 py-3 text-sm hover:bg-gray-100 ${
                  (location === item.path) || item.active ? "bg-gray-100 font-medium" : ""
                }`}>
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
