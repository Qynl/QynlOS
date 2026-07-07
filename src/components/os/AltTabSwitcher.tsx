import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/os-context";

const appIcons: Record<string, string> = {
  terminal: ">",
  explorer: "📁",
  editor: "✏️",
  aichat: "🤖",
  settings: "⚙️",
  calculator: "🧮",
  systemmonitor: "📊",
};

export default function AltTabSwitcher() {
  const { windows, focusWindow } = useOS();
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const visibleWindows = windows.filter((w) => !w.minimized);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Tab" && (e.altKey || e.metaKey)) {
        e.preventDefault();
        if (!visible) {
          setVisible(true);
          setSelectedIndex(0);
        } else {
          setSelectedIndex(
            (prev) => (prev + 1) % Math.max(visibleWindows.length, 1)
          );
        }
      }
      if (e.key === "Escape" && visible) {
        setVisible(false);
        if (visibleWindows[selectedIndex]) {
          focusWindow(visibleWindows[selectedIndex].id);
        }
      }
    },
    [visible, selectedIndex, visibleWindows, focusWindow]
  );

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.key === "Alt" || e.key === "Meta") && visible) {
        setVisible(false);
        if (visibleWindows[selectedIndex]) {
          focusWindow(visibleWindows[selectedIndex].id);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, visible, selectedIndex, visibleWindows, focusWindow]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="flex gap-3 p-4 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl">
            {visibleWindows.map((w, i) => (
              <button
                key={w.id}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  i === selectedIndex
                    ? "bg-white/15 ring-1 ring-white/30 scale-110"
                    : "bg-white/[0.04] opacity-50"
                }`}
                onClick={() => {
                  setVisible(false);
                  focusWindow(w.id);
                }}
              >
                <span className="text-2xl">
                  {appIcons[w.appId] || "⬜"}
                </span>
                <span className="text-[10px] text-white/70 font-medium">
                  {w.title}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
