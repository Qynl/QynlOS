import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { AppId, WindowState, WallpaperConfig } from "./os-types";

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
  toggleAppLauncher: () => void;
  isAppLauncherOpen: boolean;
  closeAppLauncher: () => void;
  wallpaper: WallpaperConfig;
  setWallpaper: (w: WallpaperConfig) => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  nextZIndex: () => number;
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
  const zRef = useRef(10);

  const nextZIndex = useCallback(() => {
    zRef.current += 1;
    return zRef.current;
  }, []);

  const openApp = useCallback((appId: AppId, title: string) => {
    const existing = windows.find(
      (w) => w.appId === appId && !w.minimized
    );
    if (existing) {
      setFocusedWindowId(existing.id);
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id ? { ...w, zIndex: nextZIndex() } : w
        )
      );
      return existing.id;
    }

    const z = nextZIndex();
    const id = `${appId}-${Date.now()}`;
    const newWindow: WindowState = {
      id,
      appId,
      title,
      x: 80 + (windows.length * 30) % 200,
      y: 60 + (windows.length * 20) % 150,
      width: appId === "aichat" ? 500 : 780,
      height: appId === "aichat" ? 600 : 520,
      minimized: false,
      maximized: false,
      zIndex: z,
    };
    setWindows((prev) => [...prev, newWindow]);
    setFocusedWindowId(id);
    return id;
  }, [windows, nextZIndex]);

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
      prev.map((w) => (w.id === id ? { ...w, maximized: true } : w))
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: false, maximized: false } : w))
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
        toggleAppLauncher,
        isAppLauncherOpen,
        closeAppLauncher,
        wallpaper,
        setWallpaper,
        theme,
        setTheme,
        nextZIndex,
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
