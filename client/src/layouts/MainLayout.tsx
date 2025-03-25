import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { NotificationBanner } from "@/components/NotificationBanner";
import { ToastMessage } from "@/lib/types";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [notifications, setNotifications] = useState<ToastMessage[]>([]);

  const addNotification = (notification: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications([...notifications, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Notification area */}
        <div>
          {notifications.map((notification) => (
            <NotificationBanner
              key={notification.id}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Context for notifications
export const useNotification = () => {
  // This is a mock implementation - in a real app, this would be a React context
  return {
    addNotification: (notification: Omit<ToastMessage, "id">) => {
      const event = new CustomEvent("notification", { 
        detail: notification 
      });
      window.dispatchEvent(event);
    }
  };
};
