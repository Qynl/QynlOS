import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

function Gauge({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    pct > 80 ? "text-red-400" : pct > 50 ? "text-yellow-400" : "text-green-400";
  return (
    <div className="bg-white/[0.03] rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/50">{label}</span>
        <span className={`text-sm font-mono font-medium ${color}`}>
          {value.toFixed(1)}
          {label.includes("GB") ? " GB" : " MHz"}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            pct > 80
              ? "bg-red-500"
              : pct > 50
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function CircleGauge({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const color =
    pct > 80 ? "#f87171" : pct > 50 ? "#facc15" : "#4ade80";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="70" height="70" className="-rotate-90">
        <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        <motion.circle
          cx="35"
          cy="35"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="text-xs text-white/50">{label}</span>
    </div>
  );
}

export default function SystemMonitor({ windowId: _windowId }: { windowId: string }) {
  const [cpu, setCpu] = useState(45);
  const [memory, setMemory] = useState(3.2);
  const [totalMem] = useState(8);
  const [upTime, setUpTime] = useState(0);
  const [processes] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.random() * 40 + 20);
      setMemory(Math.random() * 2 + 2.5);
      setUpTime((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(upTime / 3600);
  const minutes = Math.floor((upTime % 3600) / 60);

  return (
    <div className="h-full bg-black/30 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-indigo-400" />
        <span className="text-sm text-white/80 font-medium">System Monitor</span>
      </div>

      {/* Gauges row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <CircleGauge value={cpu} label="CPU" />
        <CircleGauge value={(memory / totalMem) * 100} label="Memory" max={100} />
        <div className="flex flex-col items-center justify-center">
          <Timer className="w-5 h-5 text-white/40 mb-1" />
          <span className="text-lg font-mono text-white/70 font-medium">
            {hours}:{String(minutes).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-white/40">Uptime</span>
        </div>
      </div>

      {/* Detail bars */}
      <div className="space-y-2">
        <Gauge value={cpu} label="CPU Usage (%)" />
        <Gauge value={memory} label="Memory (GB / 8 GB)" max={totalMem} />
        <Gauge value={Math.random() * 300 + 800} label="Clock Speed (MHz)" max={2400} />
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-white/[0.03] rounded-xl p-2.5">
          <span className="text-[10px] text-white/40">Processes</span>
          <p className="text-sm text-white/70 font-mono">{processes}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-2.5">
          <span className="text-[10px] text-white/40">Architecture</span>
          <p className="text-sm text-white/70 font-mono">x86_64</p>
        </div>
      </div>
    </div>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
