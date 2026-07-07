import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";
import { Check, Monitor, Palette, Image } from "lucide-react";
import type { WallpaperConfig } from "@/lib/os-types";

const wallpapers: WallpaperConfig[] = [
  { type: "gradient", value: "from-indigo-950 via-purple-900 to-slate-900", label: "Deep Space" },
  { type: "gradient", value: "from-emerald-950 via-teal-900 to-cyan-900", label: "Emerald" },
  { type: "gradient", value: "from-orange-950 via-rose-900 to-pink-900", label: "Sunset" },
  { type: "gradient", value: "from-blue-950 via-indigo-900 to-violet-900", label: "Midnight" },
  { type: "gradient", value: "from-stone-950 via-neutral-900 to-zinc-900", label: "Charcoal" },
  { type: "gradient", value: "from-cyan-950 via-sky-900 to-blue-900", label: "Ocean" },
  { type: "gradient", value: "from-fuchsia-950 via-pink-900 to-rose-900", label: "Neon" },
  { type: "gradient", value: "from-lime-950 via-green-900 to-emerald-900", label: "Forest" },
];

export default function Settings({ windowId: _windowId }: { windowId: string }) {
  const { wallpaper, setWallpaper, theme, setTheme } = useOS();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <h2 className="text-sm font-medium text-white/90">System Settings</h2>
        <p className="text-xs text-white/40 mt-0.5">
          Personalize your QynlOS experience
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {/* Theme */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-white/50" />
            <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Theme
            </h3>
          </div>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm",
                  theme === t
                    ? "bg-white/15 border-white/20 text-white"
                    : "bg-white/[0.04] border-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {theme === t && <Check className="w-3 h-3" />}
                {t === "dark" ? "🌙 Dark" : "☀️ Light"}
              </button>
            ))}
          </div>
        </section>

        {/* Wallpaper */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-4 h-4 text-white/50" />
            <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Wallpaper
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {wallpapers.map((w) => (
              <button
                key={w.label}
                onClick={() => setWallpaper(w)}
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                  wallpaper.label === w.label
                    ? "border-white/40"
                    : "border-transparent hover:border-white/20"
                )}
              >
                <div className={`w-full h-full bg-gradient-to-br ${w.value}`} />
                {wallpaper.label === w.label && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-2">
            Current: {wallpaper.label}
          </p>
        </section>

        {/* System Info */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-4 h-4 text-white/50" />
            <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">
              About
            </h3>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3 space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-white/40">OS</span><span className="text-white/70">QynlOS v0.1</span></div>
            <div className="flex justify-between"><span className="text-white/40">Kernel</span><span className="text-white/70">Qynl 6.8.0</span></div>
            <div className="flex justify-between"><span className="text-white/40">Architecture</span><span className="text-white/70">x86_64</span></div>
            <div className="flex justify-between"><span className="text-white/40">AI Engine</span><span className="text-white/70">Ollama</span></div>
            <div className="flex justify-between"><span className="text-white/40">License</span><span className="text-white/70">MIT / Open Source</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
