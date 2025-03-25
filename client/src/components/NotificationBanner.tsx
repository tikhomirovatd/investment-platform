import { XCircle, CheckCircle, AlertCircle, Info } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationBannerProps {
  type: NotificationType;
  title: string;
  message?: string;
  onClose: () => void;
}

export function NotificationBanner({ type, title, message, onClose }: NotificationBannerProps) {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-[#27AE60]";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-[#E67E22]";
      case "info":
        return "bg-[#3498DB]";
      default:
        return "bg-[#3498DB]";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 mr-2" />;
      case "error":
        return <XCircle className="h-5 w-5 mr-2" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 mr-2" />;
      case "info":
        return <Info className="h-5 w-5 mr-2" />;
      default:
        return <Info className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <div className={`${getBackgroundColor()} text-white px-6 py-3 flex items-center justify-between`}>
      <div className="flex items-center">
        {getIcon()}
        <span>
          {title}
          {message && <span className="ml-1 opacity-90 text-sm">{message}</span>}
        </span>
      </div>
      <button className="text-white" onClick={onClose}>
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}
