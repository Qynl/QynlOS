// Windows-like OS Context with Desktop, Taskbar, and App Management

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Kernel } from './kernel/kernel';
import { AppRegistry, App } from './app-registry';

export interface DesktopWindow {
  id: string;
  appId: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface OSContextType {
  mode: 'landing' | 'booting' | 'os';
  setMode: (mode: 'landing' | 'booting' | 'os') => void;
  kernel: Kernel | null;
  appRegistry: AppRegistry | null;
  windows: DesktopWindow[];
  activeWindowId: string | null;
  initializeOS: () => Promise<void>;
  launchApp: (appId: string) => string; // returns window ID
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  moveWindow: (windowId: string, x: number, y: number) => void;
  resizeWindow: (windowId: string, width: number, height: number) => void;
  installApp: (appId: string) => boolean;
  uninstallApp: (appId: string) => boolean;
  getInstalledApps: () => App[];
  getAvailableApps: () => App[];
}

const OSContext = createContext<OSContextType | undefined>(undefined);

let windowIdCounter = 0;
let zIndexCounter = 100;

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'landing' | 'booting' | 'os'>('landing');
  const [kernel, setKernel] = useState<Kernel | null>(null);
  const [appRegistry, setAppRegistry] = useState<AppRegistry | null>(null);
  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const initializeOS = useCallback(async () => {
    setMode('booting');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newKernel = new Kernel();
    newKernel.boot();
    setKernel(newKernel);

    const newRegistry = new AppRegistry();
    setAppRegistry(newRegistry);

    setMode('os');
  }, []);

  const launchApp = useCallback(
    (appId: string): string => {
      const app = appRegistry?.getApp(appId);
      if (!app || !app.installed) {
        console.error(`App ${appId} not installed`);
        return '';
      }

      const windowId = `window-${++windowIdCounter}`;
      const newWindow: DesktopWindow = {
        id: windowId,
        appId,
        title: app.name,
        icon: app.icon,
        isMinimized: false,
        isMaximized: false,
        x: Math.random() * 100 + 100,
        y: Math.random() * 100 + 100,
        width: 1024,
        height: 720,
        zIndex: ++zIndexCounter,
      };

      setWindows((prev) => [...prev, newWindow]);
      setActiveWindowId(windowId);
      return windowId;
    },
    [appRegistry]
  );

  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      )
    );
  }, []);

  const maximizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              x: w.isMaximized ? 100 : 0,
              y: w.isMaximized ? 100 : 0,
              width: w.isMaximized ? 1024 : window.innerWidth,
              height: w.isMaximized ? 720 : window.innerHeight - 60,
            }
          : w
      )
    );
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, zIndex: ++zIndexCounter } : w
      )
    );
    setActiveWindowId(windowId);
  }, []);

  const moveWindow = useCallback((windowId: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, x, y } : w))
    );
  }, []);

  const resizeWindow = useCallback(
    (windowId: string, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, width, height } : w))
      );
    },
    []
  );

  const installApp = useCallback(
    (appId: string) => {
      return appRegistry?.installApp(appId) || false;
    },
    [appRegistry]
  );

  const uninstallApp = useCallback(
    (appId: string) => {
      return appRegistry?.uninstallApp(appId) || false;
    },
    [appRegistry]
  );

  const getInstalledApps = useCallback(() => {
    return appRegistry?.getInstalledApps() || [];
  }, [appRegistry]);

  const getAvailableApps = useCallback(() => {
    return appRegistry?.getAvailableApps() || [];
  }, [appRegistry]);

  return (
    <OSContext.Provider
      value={{
        mode,
        setMode,
        kernel,
        appRegistry,
        windows,
        activeWindowId,
        initializeOS,
        launchApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        moveWindow,
        resizeWindow,
        installApp,
        uninstallApp,
        getInstalledApps,
        getAvailableApps,
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOS must be used within OSProvider');
  }
  return context;
}
