import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOS } from "@/lib/os-context";

const bootMessages = [
  "Initializing kernel...",
  "Loading system modules...",
  "Starting AI engine...",
  "Mounting filesystem...",
  "Preparing desktop...",
  "QynlOS ready!",
];

export default function BootScreen() {
  const { setMode } = useOS();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(bootMessages[0]);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const pct = Math.min((step / bootMessages.length) * 100, 100);
      setProgress(pct);
      setMessage(bootMessages[Math.min(step, bootMessages.length - 1)]);
      if (step >= bootMessages.length) {
        clearInterval(interval);
        setTimeout(() => setMode("os"), 400);
      }
    }, 350);
    return () => clearInterval(interval);
  }, [setMode]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-black to-purple-950/30" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
          <motion.span
            className="text-4xl font-bold text-white"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Q
          </motion.span>
        </div>
      </motion.div>

      {/* Loading bar */}
      <div className="w-64 relative">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Message */}
      <motion.p
        key={message}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-sm text-white/40 font-mono"
      >
        {message}
      </motion.p>
    </div>
  );
}
