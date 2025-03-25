import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#2C3E50]">M&A Платформа</h1>
        <div className="flex items-center">
          <span className="mr-4 text-sm">Петрушевская Людмила</span>
          <Button variant="default" size="sm" className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded">
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
}
