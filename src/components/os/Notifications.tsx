import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/os-context";
import { X } from "lucide-react";

export default function Notifications() {
  const { notifications, dismissNotification } = useOS();

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="pointer-events-auto bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl p-3 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90">{n.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{n.message}</p>
              </div>
              <button
                onClick={() => dismissNotification(n.id)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
