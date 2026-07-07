// Windows-like Taskbar

import React from 'react';
import { useOS } from '@/lib/os-context-windows';

export function WindowsTaskbar() {
  const { windows, launchApp, minimizeWindow, activeWindowId, focusWindow, getInstalledApps } = useOS();
  const installedApps = getInstalledApps();

  const quickLaunchApps = [
    'brave-browser',
    'file-explorer',
    'app-store',
    'terminal',
    'settings',
  ].filter((id) => installedApps.some((app) => app.id === id));

  const openApps = Array.from(new Set(windows.map((w) => w.appId)));

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900 bg-opacity-95 backdrop-blur border-t border-gray-700 flex items-center px-4 gap-2 shadow-2xl z-50">
      {/* Start Menu */}
      <button
        onClick={() => launchApp('app-store')}
        className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-xl transition transform hover:scale-110"
        title="Start Menu"
      >
        🪟
      </button>

      <div className="w-0.5 h-8 bg-gray-700" />

      {/* Quick Launch Apps */}
      {quickLaunchApps.map((appId) => {
        const app = installedApps.find((a) => a.id === appId);
        if (!app) return null;

        const isOpen = openApps.includes(appId);
        const windowId = windows.find((w) => w.appId === appId)?.id;
        const isActive = windowId === activeWindowId;

        return (
          <button
            key={appId}
            onClick={() => {
              if (windowId) {
                if (activeWindowId === windowId) {
                  minimizeWindow(windowId);
                } else {
                  focusWindow(windowId);
                }
              } else {
                launchApp(appId);
              }
            }}
            className={`flex items-center justify-center w-14 h-14 rounded-lg transition transform hover:scale-110 ${
              isActive
                ? 'bg-blue-600 shadow-lg'
                : isOpen
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            title={app.name}
          >
            <span className="text-2xl">{app.icon}</span>
          </button>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* System Tray */}
      <div className="flex items-center gap-2">
        <div className="text-gray-400 text-sm font-semibold">
          {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className="w-0.5 h-8 bg-gray-700" />
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-white transition">🔊</button>
          <button className="text-gray-400 hover:text-white transition">🔋</button>
          <button className="text-gray-400 hover:text-white transition">🌐</button>
        </div>
      </div>
    </div>
  );
}
