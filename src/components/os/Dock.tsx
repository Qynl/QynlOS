import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useOS } from "@/lib/os-context";
import type { AppId } from "@/lib/os-types";

interface DockItemDef {
  id: AppId;
  name: string;
  icon: string;
}

const dockApps: DockItemDef[] = [
  { id: "browser", name: "Brave", icon: "🦁" },
  { id: "terminal", name: "Terminal", icon: ">" },
  { id: "explorer", name: "Files", icon: "📁" },
  { id: "editor", name: "Editor", icon: "✏️" },
  { id: "aichat", name: "AI Chat", icon: "🤖" },
  { id: "gamestore", name: "Store", icon: "🎮" },
  { id: "calculator", name: "Calculator", icon: "🧮" },
  { id: "systemmonitor", name: "System", icon: "📊" },
  { id: "settings", name: "Settings", icon: "⚙️" },
];

export default function Dock() {
  const { openApp, windows, focusedWindowId, addNotification } = useOS();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (app: DockItemDef) => {
      const existing = windows.find((w) => w.appId === app.id && !w.minimized);
      if (existing) {
        // Already open and focused - minimize
        if (focusedWindowId === existing.id) {
          // minimize
        }
      } else if (windows.find((w) => w.appId === app.id && w.minimized)) {
        // Restore
      }
      openApp(app.id, app.name);
      addNotification({
        title: app.name,
        message: `Opening ${app.name}...`,
        icon: app.icon,
      });
    },
    [openApp, windows, focusedWindowId, addNotification]
  );

  const isAppOpen = (appId: AppId) =>
    windows.some((w) => w.appId === appId && !w.minimized);

  return (
    <div className="flex justify-center">
      <motion.div
        ref={dockRef}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", damping: 20 }}
        className="flex items-end gap-0.5 px-3 py-1.5 rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl"
      >
        {dockApps.map((app) => {
          const open = isAppOpen(app.id);
          const isHovered = hoveredId === app.id;
          return (
            <motion.button
              key={app.id}
              onClick={() => handleClick(app)}
              onMouseEnter={() => setHoveredId(app.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative flex flex-col items-center justify-end group"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              style={{
                transformOrigin: "bottom center",
                scale: isHovered ? 1.15 : 1,
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                {/* Running indicator */}
                {open && (
                  <motion.div
                    layoutId="dockDot"
                    className="w-1 h-1 rounded-full bg-white/40"
                  />
                )}
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-colors ${
                    isHovered
                      ? "bg-white/15"
                      : open
                      ? "bg-white/10"
                      : "bg-white/[0.04] hover:bg-white/10"
                  }`}
                >
                  {app.icon}
                </div>
              </div>
              {/* Tooltip */}
              <AnimatedTooltip visible={isHovered} text={app.name} />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

function AnimatedTooltip({
  visible,
  text,
}: {
  visible: boolean;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.8 }}
      animate={
        visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 5, scale: 0.8 }
      }
      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 backdrop-blur rounded text-[10px] text-white/80 whitespace-nowrap border border-white/10"
    >
      {text}
    </motion.div>
  );
}
