import React, { useCallback, lazy, Suspense, useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/os-context";
import Window from "./Window";
import Dock from "./Dock";
import ContextMenu from "./ContextMenu";
import Notifications from "./Notifications";
import AltTabSwitcher from "./AltTabSwitcher";
import type { AppId } from "@/lib/os-types";

const TerminalApp = lazy(() => import("@/components/apps/Terminal"));
const FileExplorerApp = lazy(() => import("@/components/apps/FileExplorer"));
const TextEditorApp = lazy(() => import("@/components/apps/TextEditor"));
const AIChatApp = lazy(() => import("@/components/apps/AIChat"));
const SettingsApp = lazy(() => import("@/components/apps/Settings"));
const CalculatorApp = lazy(() => import("@/components/apps/Calculator"));
const SystemMonitorApp = lazy(() => import("@/components/apps/SystemMonitor"));

const appMap: Record<AppId, React.ComponentType<{ windowId: string }>> = {
  terminal: TerminalApp,
  explorer: FileExplorerApp,
  editor: TextEditorApp,
  aichat: AIChatApp,
  settings: SettingsApp,
  calculator: CalculatorApp,
  systemmonitor: SystemMonitorApp,
};

function AppRenderer({ appId, windowId }: { appId: AppId; windowId: string }) {
  const Component = appMap[appId];
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full text-white/40 text-sm">
          Loading...
        </div>
      }
    >
      <Component windowId={windowId} />
    </Suspense>
  );
}

export default function Desktop() {
  const {
    windows,
    focusedWindowId,
    closeAppLauncher,
    wallpaper,
  } = useOS();
  const desktopRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContextMenu(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.target === desktopRef.current ||
        (e.target as HTMLElement).closest("[data-desktop-area]")
      ) {
        closeAppLauncher();
        setContextMenu(null);
      }
    },
    [closeAppLauncher]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      ref={desktopRef}
      data-desktop-area
      className="relative flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Wallpaper */}
      <div className="absolute inset-0 -z-10">
        {wallpaper.type === "gradient" && (
          <div
            className={`w-full h-full bg-gradient-to-br ${wallpaper.value} transition-all duration-1000`}
          />
        )}
        {wallpaper.type === "solid" && (
          <div
            className="w-full h-full transition-colors duration-1000"
            style={{ backgroundColor: wallpaper.value }}
          />
        )}
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows
          .filter((w) => !w.minimized)
          .map((w) => (
            <Window
              key={w.id}
              id={w.id}
              title={w.title}
              appId={w.appId}
              x={w.x}
              y={w.y}
              width={w.width}
              height={w.height}
              zIndex={w.zIndex}
              focused={focusedWindowId === w.id}
              maximized={w.maximized}
            >
              <AppRenderer appId={w.appId as AppId} windowId={w.id} />
            </Window>
          ))}
      </AnimatePresence>

      {/* Dock */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3">
        <Dock />
      </div>

      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* Notifications */}
      <Notifications />

      {/* Alt+Tab Switcher */}
      <AltTabSwitcher />
    </div>
  );
}
