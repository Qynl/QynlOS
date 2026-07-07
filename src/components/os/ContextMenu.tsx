import { useEffect, useRef } from "react";
import { useOS } from "@/lib/os-context";
import {
  Terminal,
  Folder,
  FileText,
  Bot,
  Calculator,
  Activity,
  Settings,
  RefreshCw,
} from "lucide-react";
import type { AppId } from "@/lib/os-types";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

const menuItems: {
  label: string;
  icon: React.ReactNode;
  action: string;
  appId?: AppId;
}[] = [
  { label: "Terminal", icon: <Terminal className="w-4 h-4" />, action: "open", appId: "terminal" },
  { label: "Files", icon: <Folder className="w-4 h-4" />, action: "open", appId: "explorer" },
  { label: "Editor", icon: <FileText className="w-4 h-4" />, action: "open", appId: "editor" },
  { label: "AI Chat", icon: <Bot className="w-4 h-4" />, action: "open", appId: "aichat" },
  { label: "Calculator", icon: <Calculator className="w-4 h-4" />, action: "open", appId: "calculator" },
  { label: "System Monitor", icon: <Activity className="w-4 h-4" />, action: "open", appId: "systemmonitor" },
  { label: "Settings", icon: <Settings className="w-4 h-4" />, action: "open", appId: "settings" },
  { label: "Refresh Desktop", icon: <RefreshCw className="w-4 h-4" />, action: "refresh" },
];

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { openApp } = useOS();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 340);

  const handleAction = (action: string, appId?: AppId) => {
    onClose();
    if (action === "open" && appId) {
      openApp(appId, menuItems.find((m) => m.appId === appId)?.label || appId);
    }
  };

  return (
    <div
      ref={menuRef}
      style={{ left: adjustedX, top: adjustedY }}
      className="fixed z-[100] w-48 rounded-xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-2xl overflow-hidden"
    >
      <div className="py-1">
        {menuItems.slice(0, 7).map((item) => (
          <button
            key={item.label}
            onClick={() => handleAction(item.action, item.appId)}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
          >
            <span className="text-white/40">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="h-px bg-white/5 my-1" />
        {menuItems.slice(7).map((item) => (
          <button
            key={item.label}
            onClick={() => handleAction(item.action, item.appId)}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
          >
            <span className="text-white/40">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
