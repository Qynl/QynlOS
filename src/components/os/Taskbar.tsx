import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";
import Clock from "./Clock";
import AppLauncher from "./AppLauncher";
import { motion } from "framer-motion";
import { useCallback } from "react";

const appIcons: Record<string, string> = {
  terminal: ">",
  explorer: "📁",
  editor: "✏️",
  aichat: "🤖",
  settings: "⚙️",
};

export default function Taskbar() {
  const {
    windows,
    focusedWindowId,
    toggleAppLauncher,
    isAppLauncherOpen,
    restoreWindow,
    minimizeWindow,
  } = useOS();

  const handleAppClick = useCallback(
    (windowId: string) => {
      const win = windows.find((w) => w.id === windowId);
      if (!win) return;

      if (win.minimized) {
        restoreWindow(windowId);
      } else if (focusedWindowId === windowId) {
        minimizeWindow(windowId);
      } else {
        restoreWindow(windowId);
      }
    },
    [windows, focusedWindowId, restoreWindow, minimizeWindow]
  );

  return (
    <>
      <AppLauncher />
      <div className="h-12 bg-black/60 backdrop-blur-2xl border-t border-white/10 flex items-center px-2 gap-1 relative z-30">
        {/* Start button */}
        <button
          onClick={toggleAppLauncher}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
            isAppLauncherOpen
              ? "bg-white/15"
              : "hover:bg-white/10 active:bg-white/15"
          )}
        >
          <span className="text-lg font-bold text-white/80">Q</span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Running app buttons */}
        <div className="flex-1 flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {windows.map((win) => (
            <motion.button
              key={win.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => handleAppClick(win.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-xs whitespace-nowrap",
                focusedWindowId === win.id && !win.minimized
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white/80"
              )}
            >
              <span className="text-sm">
                {appIcons[win.appId] || "⬜"}
              </span>
              <span className="font-medium">{win.title}</span>
            </motion.button>
          ))}
        </div>

        {/* System tray */}
        <div className="flex items-center gap-2 ml-2">
          <div className="flex items-center gap-1.5 px-2">
            <div className="w-2 h-2 rounded-full bg-green-400/80" />
            <span className="text-[10px] text-white/40">AI Ready</span>
          </div>
          <Clock />
        </div>
      </div>
    </>
  );
}
