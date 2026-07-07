// Windows-like Desktop Environment

import React from 'react';
import { useOS } from '@/lib/os-context-windows';
import Draggable from 'react-draggable';
import { BraveBrowser } from './BraveBrowser';
import { Terminal } from './Terminal';
import { FileExplorer } from './FileExplorer';
import { Settings } from './Settings';
import { AppStore } from './AppStore';
import { TaskManager } from './SystemMonitor';

const APP_COMPONENTS: Record<string, React.ComponentType<{ windowId: string }>> = {
  'brave-browser': BraveBrowser,
  'terminal': Terminal,
  'file-explorer': FileExplorer,
  'settings': Settings,
  'app-store': AppStore as any,
  'task-manager': TaskManager as any,
};

export function WindowsDesktop() {
  const { windows, activeWindowId, focusWindow, closeWindow, minimizeWindow, maximizeWindow, moveWindow } = useOS();

  const renderWindowContent = (appId: string, windowId: string) => {
    const Component = APP_COMPONENTS[appId];
    if (Component) {
      return <Component windowId={windowId} />;
    }
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>{appId} is not yet implemented</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Desktop Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30" />

      {/* Windows */}
      <div className="relative w-full h-full">
        {windows
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((window) => {
            if (window.isMinimized) return null;

            return (
              <Draggable
                key={window.id}
                defaultPosition={{ x: window.x, y: window.y }}
                onStop={(e, d) => moveWindow(window.id, d.x, d.y)}
              >
                <div
                  className="absolute bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden"
                  style={{
                    width: `${window.width}px`,
                    height: `${window.height}px`,
                    zIndex: window.zIndex,
                    cursor: activeWindowId === window.id ? 'default' : 'pointer',
                  }}
                  onClick={() => focusWindow(window.id)}
                >
                  {/* Title Bar */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between cursor-move select-none">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{window.icon}</span>
                      <span className="font-semibold">{window.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          minimizeWindow(window.id);
                        }}
                        className="hover:bg-blue-500 px-3 py-1 rounded transition"
                      >
                        −
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          maximizeWindow(window.id);
                        }}
                        className="hover:bg-blue-500 px-3 py-1 rounded transition"
                      >
                        ☐
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeWindow(window.id);
                        }}
                        className="hover:bg-red-500 px-3 py-1 rounded transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-auto">
                    {renderWindowContent(window.appId, window.id)}
                  </div>
                </div>
              </Draggable>
            );
          })}
      </div>
    </div>
  );
}
