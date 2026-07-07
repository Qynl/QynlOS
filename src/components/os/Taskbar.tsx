import { useState, useCallback, useRef, useEffect } from "react";
import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";
import Clock from "./Clock";
import AppLauncher from "./AppLauncher";
import { motion, AnimatePresence } from "framer-motion";

const appIcons: Record<string, string> = {
  terminal: ">",
  explorer: "📁",
  editor: "✏️",
  aichat: "🤖",
  settings: "⚙️",
  calculator: "🧮",
  systemmonitor: "📊",
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

  const [showTray, setShowTray] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setShowTray(false);
      }
    };
    if (showTray) window.addEventListener("mousedown", handle);
    return () => window.removeEventListener("mousedown", handle);
  }, [showTray]);

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
      <div className="h-14 bg-black/60 backdrop-blur-2xl border-t border-white/10 flex items-center px-3 gap-1 relative z-30">
        {/* Start button */}
        <button
          onClick={toggleAppLauncher}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-all",
            isAppLauncherOpen
              ? "bg-white/15"
              : "hover:bg-white/10 active:bg-white/15"
          )}
        >
          <span className="text-xl font-bold text-white/80">Q</span>
        </button>

        <div className="w-px h-7 bg-white/10 mx-2" />

        {/* Running apps */}
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
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs whitespace-nowrap",
                focusedWindowId === win.id && !win.minimized
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white/80",
                win.minimized && "opacity-50"
              )}
            >
              <span className="text-sm">{appIcons[win.appId] || "⬜"}</span>
              <span className="font-medium">{win.title}</span>
            </motion.button>
          ))}
        </div>

        {/* System tray */}
        <div className="flex items-center gap-2 ml-2 relative" ref={trayRef}>
          <button
            onClick={() => setShowTray(!showTray)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-green-400/80 animate-pulse" />
            <span className="text-[10px] text-white/40">AI</span>
          </button>

          <AnimatePresence>
            {showTray && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-2 w-56 rounded-xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">WiFi</span>
                    <span className="text-white/80">QynlNet 5G</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Volume</span>
                    <span className="text-white/80">85%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Bluetooth</span>
                    <span className="text-green-400">Connected</span>
                  </div>
                  <div className="h-px bg-white/5 my-1" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">AI Engine</span>
                    <span className="text-green-400/80">Ready</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Model</span>
                    <span className="text-white/60">Llama 3.2</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Clock />
        </div>
      </div>
    </>
  );
}
