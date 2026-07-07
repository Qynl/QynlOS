import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type {
  AppId,
  WindowState,
  WallpaperConfig,
  Notification,
} from "./os-types";

interface OSContextType {
  windows: WindowState[];
  focusedWindowId: string | null;
  openApp: (appId: AppId, title: string) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  snapWindow: (id: string, direction: "left" | "right" | "full") => void;
  toggleAppLauncher: () => void;
  isAppLauncherOpen: boolean;
  closeAppLauncher: () => void;
  wallpaper: WallpaperConfig;
  setWallpaper: (w: WallpaperConfig) => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  nextZIndex: () => number;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "timestamp">) => void;
  dismissNotification: (id: string) => void;
  mode: "landing" | "booting" | "os";
  setMode: (m: "landing" | "booting" | "os") => void;
}

const OSContext = createContext<OSContextType | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperConfig>({
    type: "gradient",
    value: "from-indigo-950 via-purple-900 to-slate-900",
    label: "Deep Space",
  });
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mode, setMode] = useState<"landing" | "booting" | "os">("landing");
  const zRef = useRef(10);

  const nextZIndex = useCallback(() => {
    zRef.current += 1;
    return zRef.current;
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "timestamp">) => {
      const id = `notif-${Date.now()}`;
      setNotifications((prev) => [
        ...prev,
        { ...n, id, timestamp: Date.now() },
      ]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((x) => x.id !== id));
      }, 5000);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const openApp = useCallback((appId: AppId, title: string) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId && !w.minimized);
      if (existing) {
        setFocusedWindowId(existing.id);
        return prev.map((w) =>
          w.id === existing.id ? { ...w, zIndex: nextZIndex() } : w
        );
      }

      const z = nextZIndex();
      const id = `${appId}-${Date.now()}`;
      const count = prev.length;
      const sizes: Partial<Record<AppId, { w: number; h: number }>> = {
        aichat: { w: 500, h: 600 },
        calculator: { w: 320, h: 480 },
        systemmonitor: { w: 500, h: 400 },
        settings: { w: 680, h: 520 },
      };
      const size = sizes[appId] || { w: 780, h: 520 };
      const newWindow: WindowState = {
        id,
        appId,
        title,
        x: 80 + (count * 30) % 200,
        y: 60 + (count * 20) % 150,
        width: size.w,
        height: size.h,
        minimized: false,
        maximized: false,
        zIndex: z,
      };
      setFocusedWindowId(id);
      return [...prev, newWindow];
    });
    return `${appId}-${Date.now()}`;
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setFocusedWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setFocusedWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex() } : w))
    );
  }, [nextZIndex]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
    setFocusedWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            x: w.prevState?.x ?? w.x,
            y: w.prevState?.y ?? w.y,
            width: w.prevState?.width ?? w.width,
            height: w.prevState?.height ?? w.height,
            prevState: undefined,
          };
        }
        return {
          ...w,
          maximized: true,
          prevState: { x: w.x, y: w.y, width: w.width, height: w.height },
        };
      })
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          minimized: false,
          maximized: false,
          x: w.prevState?.x ?? w.x,
          y: w.prevState?.y ?? w.y,
          width: w.prevState?.width ?? w.width,
          height: w.prevState?.height ?? w.height,
          prevState: undefined,
        };
      })
    );
    setFocusedWindowId(id);
  }, []);

  const updateWindowPosition = useCallback(
    (id: string, x: number, y: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, x, y } : w))
      );
    },
    []
  );

  const updateWindowSize = useCallback(
    (id: string, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, width, height } : w))
      );
    },
    []
  );

  const snapWindow = useCallback(
    (id: string, direction: "left" | "right" | "full") => {
      const taskbarH = 56;
      if (direction === "left") {
        updateWindowPosition(id, 0, 0);
        updateWindowSize(id, window.innerWidth / 2, window.innerHeight - taskbarH);
      } else if (direction === "right") {
        updateWindowPosition(id, window.innerWidth / 2, 0);
        updateWindowSize(id, window.innerWidth / 2, window.innerHeight - taskbarH);
      } else {
        updateWindowPosition(id, 0, 0);
        updateWindowSize(id, window.innerWidth, window.innerHeight - taskbarH);
      }
    },
    [updateWindowPosition, updateWindowSize]
  );

  const toggleAppLauncher = useCallback(() => {
    setIsAppLauncherOpen((prev) => !prev);
  }, []);

  const closeAppLauncher = useCallback(() => {
    setIsAppLauncherOpen(false);
  }, []);

  return (
    <OSContext.Provider
      value={{
        windows,
        focusedWindowId,
        openApp,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        updateWindowPosition,
        updateWindowSize,
        snapWindow,
        toggleAppLauncher,
        isAppLauncherOpen,
        closeAppLauncher,
        wallpaper,
        setWallpaper,
        theme,
        setTheme,
        nextZIndex,
        notifications,
        addNotification,
        dismissNotification,
        mode,
        setMode,
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within OSProvider");
  return ctx;
}
