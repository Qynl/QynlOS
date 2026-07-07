import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/os-context";
import type { AppId } from "@/lib/os-types";
import { Search } from "lucide-react";

const apps: { id: AppId; name: string; icon: string; description: string }[] =
  [
    { id: "browser", name: "Brave Browser", icon: "🦁", description: "Browse the web privately" },
    { id: "gamestore", name: "Qynl Store", icon: "🎮", description: "Download & play games" },
    { id: "terminal", name: "Terminal", icon: ">", description: "Command-line interface" },
    { id: "explorer", name: "Files", icon: "📁", description: "File manager" },
    { id: "editor", name: "Editor", icon: "✏️", description: "Text editor" },
    { id: "aichat", name: "AI Chat", icon: "🤖", description: "Ollama AI assistant" },
    { id: "calculator", name: "Calculator", icon: "🧮", description: "Math calculations" },
    { id: "systemmonitor", name: "System Monitor", icon: "📊", description: "CPU, memory, stats" },
    { id: "settings", name: "Settings", icon: "⚙️", description: "System settings" },
  ];

export default function AppLauncher() {
  const { isAppLauncherOpen, closeAppLauncher, openApp } = useOS();
  const [search, setSearch] = useState("");

  const filtered = search
    ? apps.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.description.toLowerCase().includes(search.toLowerCase())
      )
    : apps;

  const handleOpen = useCallback(
    (app: (typeof apps)[0]) => {
      openApp(app.id, app.name);
      closeAppLauncher();
      setSearch("");
    },
    [openApp, closeAppLauncher]
  );

  return (
    <AnimatePresence>
      {isAppLauncherOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => {
              closeAppLauncher();
              setSearch("");
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-16 left-4 z-50 w-80 rounded-xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 pb-1">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-white/10 rounded-lg border border-white/5">
                <Search className="w-3.5 h-3.5 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search apps..."
                  className="flex-1 bg-transparent text-sm text-white/80 outline-none placeholder:text-white/30"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-3 pt-2">
              <div className="text-[10px] text-white/40 font-medium mb-1.5 px-1 uppercase tracking-wider">
                {search ? "Results" : "Applications"}
              </div>
              <div className="space-y-0.5">
                {filtered.length === 0 && (
                  <p className="text-xs text-white/30 text-center py-4">
                    No apps found
                  </p>
                )}
                {filtered.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleOpen(app)}
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <span className="text-xl w-8 text-center">{app.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-sm text-white/90 font-medium">
                        {app.name}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {app.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-white/5 p-2.5 bg-white/[0.02]">
              <div className="text-[10px] text-white/20 text-center">
                QynlOS v2.0 · Press Esc to close
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
