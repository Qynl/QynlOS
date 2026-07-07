import React, { useCallback, lazy, Suspense, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/os-context";
import Window from "./Window";
import type { AppId } from "@/lib/os-types";

const TerminalApp = lazy(() => import("@/components/apps/Terminal"));
const FileExplorerApp = lazy(() => import("@/components/apps/FileExplorer"));
const TextEditorApp = lazy(() => import("@/components/apps/TextEditor"));
const AIChatApp = lazy(() => import("@/components/apps/AIChat"));
const SettingsApp = lazy(() => import("@/components/apps/Settings"));

const appMap: Record<AppId, React.ComponentType<{ windowId: string }>> = {
  terminal: TerminalApp,
  explorer: FileExplorerApp,
  editor: TextEditorApp,
  aichat: AIChatApp,
  settings: SettingsApp,
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

function DesktopIcon({
  label,
  icon,
  appId,
}: {
  label: string;
  icon: string;
  appId: AppId;
}) {
  const { openApp, closeAppLauncher } = useOS();

  const handleDoubleClick = useCallback(() => {
    closeAppLauncher();
    openApp(appId, label);
  }, [appId, label, openApp, closeAppLauncher]);

  return (
    <button
      onDoubleClick={handleDoubleClick}
      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 hover:backdrop-blur-xl transition-all w-20 group cursor-default"
    >
      <span className="text-2xl drop-shadow-lg">{icon}</span>
      <span className="text-[11px] text-white/90 text-center font-medium drop-shadow-md">
        {label}
      </span>
    </button>
  );
}

export default function Desktop() {
  const { windows, focusedWindowId, closeAppLauncher, wallpaper } = useOS();
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.target === desktopRef.current ||
        (e.target as HTMLElement).closest("[data-desktop-area]")
      ) {
        closeAppLauncher();
      }
    },
    [closeAppLauncher]
  );

  return (
    <div
      ref={desktopRef}
      data-desktop-area
      className="relative flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 48px)" }}
      onClick={handleClick}
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
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />
      </div>

      {/* Desktop icons */}
      <div className="absolute left-3 top-3 flex flex-col gap-0.5">
        <DesktopIcon label="Terminal" icon=">" appId="terminal" />
        <DesktopIcon label="Files" icon="📁" appId="explorer" />
        <DesktopIcon label="Editor" icon="✏️" appId="editor" />
        <DesktopIcon label="AI Chat" icon="🤖" appId="aichat" />
        <DesktopIcon label="Settings" icon="⚙️" appId="settings" />
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
    </div>
  );
}
