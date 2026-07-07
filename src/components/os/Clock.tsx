import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="text-xs font-medium text-white/80">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
      <span className="text-[10px] text-white/40">
        {time.toLocaleDateString([], { month: "short", day: "numeric" })}
      </span>
    </div>
  );
}
