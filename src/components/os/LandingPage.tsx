import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/os-context";
import {
  Terminal,
  FolderCode,
  Bot,
  Sparkles,
  Shield,
  Cpu,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Local AI",
    desc: "Powered by Ollama. Private, fast, and runs entirely on your machine.",
  },
  {
    icon: Sparkles,
    title: "Beautiful Design",
    desc: "Glassmorphism, smooth animations, and a pixel-perfect interface.",
  },
  {
    icon: Terminal,
    title: "Dev-First",
    desc: "Built-in terminal, editor, and dev tools. Made for creators.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Zero telemetry. Your data never leaves your computer.",
  },
  {
    icon: Cpu,
    title: "Lightning Fast",
    desc: "Optimized performance. No bloat, no junk, just speed.",
  },
  {
    icon: FolderCode,
    title: "Open Source",
    desc: "100% free and open source. MIT licensed. Community driven.",
  },
];

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  speed: Math.random() * 0.5 + 0.1,
  opacity: Math.random() * 0.5 + 0.1,
  delay: Math.random() * 5,
}));

export default function LandingPage() {
  const { setMode } = useOS();
  const [isLaunching, setIsLaunching] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "The OS of the future. Built for everyone.";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      containerRef.current.style.setProperty("--mouse-x", String(x));
      containerRef.current.style.setProperty("--mouse-y", String(y));
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const handleLaunch = useCallback(() => {
    setIsLaunching(true);
    setTimeout(() => setMode("booting"), 1200);
  }, [setMode]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden"
      style={
        {
          backgroundColor: "#000",
          "--mouse-x": "0",
          "--mouse-y": "0",
        } as React.CSSProperties
      }
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-purple-900/20 to-slate-950" />
      <div
        className="absolute inset-0 opacity-30 transition-transform duration-500"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
          transform:
            "translate(calc(var(--mouse-x) * -20px), calc(var(--mouse-y) * -20px))",
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.speed * 5,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: 40 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring", damping: 20 }}
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <span className="text-5xl font-bold text-white">Q</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight"
        >
          QynlOS
        </motion.h1>

        {/* Typing effect subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="h-8 mb-10"
        >
          <span className="text-lg md:text-xl text-white/60 font-mono">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </motion.div>

        {/* Launch button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleLaunch}
          disabled={isLaunching}
          className="group relative px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium text-lg transition-all overflow-hidden hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:shadow-indigo-500/10"
        >
          <AnimatePresence mode="wait">
            {isLaunching ? (
              <motion.div
                key="launching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Booting QynlOS...
              </motion.div>
            ) : (
              <motion.div
                key="launch"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                Launch QynlOS
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Feature showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-0 right-0 px-6"
        >
          <div className="max-w-4xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-3">
            {features.slice(0, 6).map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.08 }}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all cursor-default"
              >
                <feature.icon className="w-5 h-5 text-indigo-400/80 group-hover:text-indigo-300 transition-colors" />
                <span className="text-[10px] text-white/50 text-center leading-tight">
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Version */}
      <div className="absolute bottom-4 right-6 text-[11px] text-white/20 font-mono">
        v2.0
      </div>
    </div>
  );
}
