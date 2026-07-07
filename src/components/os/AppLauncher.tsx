import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/os-context";
import type { AppId } from "@/lib/os-types";

const apps: { id: AppId; name: string; icon: string; description: string }[] =
  [
    {
      id: "terminal",
      name: "Terminal",
      icon: ">",
      description: "Command-line interface",
    },
    { id: "explorer", name: "Files", icon: "📁", description: "File manager" },
    { id: "editor", name: "Editor", icon: "✏️", description: "Text editor" },
    {
      id: "aichat",
      name: "AI Chat",
      icon: "🤖",
      description: "Ollama AI assistant",
    },
    {
      id: "settings",
      name: "Settings",
      icon: "⚙️",
      description: "System settings",
    },
  ];

export default function AppLauncher() {
  const { isAppLauncherOpen, closeAppLauncher, openApp } = useOS();

  return (
    <AnimatePresence>
      {isAppLauncherOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={closeAppLauncher}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-14 left-4 z-50 w-80 rounded-xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-3">
              <div className="text-xs text-white/40 font-medium mb-2 px-1">
                Applications
              </div>
              <div className="grid grid-cols-2 gap-1">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      openApp(app.id, app.name);
                      closeAppLauncher();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <span className="text-xl">{app.icon}</span>
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
            <div className="border-t border-white/5 p-3 bg-white/[0.02]">
              <div className="text-xs text-white/30 text-center">QynlOS v0.1</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
