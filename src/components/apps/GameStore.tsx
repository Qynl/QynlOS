import { useState, useCallback, useEffect, useRef } from "react";
import {
  Search,
  Download,
  Play,
  Star,
  Gamepad2,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Trash2,
  Monitor,
} from "lucide-react";

interface Game {
  id: string;
  name: string;
  developer: string;
  genre: string;
  rating: number;
  price: string;
  size: string;
  cover: string;
  banner: string;
  description: string;
  tags: string[];
}

interface InstalledGame {
  id: string;
  name: string;
  cover: string;
  size: string;
  installedAt: number;
}

const allGames: Game[] = [
  {
    id: "minecraft",
    name: "Minecraft",
    developer: "Mojang Studios",
    genre: "Sandbox",
    rating: 4.8,
    price: "$29.99",
    size: "2.1 GB",
    cover: "🟫",
    banner: "from-green-800 via-emerald-700 to-lime-600",
    description: "Explore infinite worlds and build everything from the simplest of homes to the grandest of castles. Play in creative mode with unlimited resources or mine deep into the world in survival mode.",
    tags: ["Sandbox", "Survival", "Multiplayer", "Creative"],
  },
  {
    id: "valorant",
    name: "Valorant",
    developer: "Riot Games",
    genre: "FPS",
    rating: 4.5,
    price: "Free",
    size: "28.4 GB",
    cover: "🔫",
    banner: "from-red-900 via-rose-800 to-orange-700",
    description: "A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities. Outsmart, outaim, and outplay your opponents.",
    tags: ["FPS", "Tactical", "Competitive", "Multiplayer"],
  },
  {
    id: "roblox",
    name: "Roblox",
    developer: "Roblox Corporation",
    genre: "Platform",
    rating: 4.3,
    price: "Free",
    size: "1.8 GB",
    cover: "🧱",
    banner: "from-gray-700 via-red-600 to-gray-700",
    description: "The ultimate virtual universe that lets you create, share experiences with friends, and be anything you can imagine. Millions of worlds to explore.",
    tags: ["Platform", "Social", "Creative", "Multiplayer"],
  },
  {
    id: "fortnite",
    name: "Fortnite",
    developer: "Epic Games",
    genre: "Battle Royale",
    rating: 4.4,
    price: "Free",
    size: "62.3 GB",
    cover: "🚌",
    banner: "from-blue-800 via-purple-700 to-pink-600",
    description: "Drop into the ever-evolving Battle Royale. Build, battle, and be the last one standing. Includes Creative mode and thousands of player-made islands.",
    tags: ["Battle Royale", "Shooter", "Building", "Multiplayer"],
  },
  {
    id: "gtav",
    name: "GTA V",
    developer: "Rockstar Games",
    genre: "Action",
    rating: 4.7,
    price: "$39.99",
    size: "110 GB",
    cover: "💰",
    banner: "from-green-700 via-emerald-600 to-teal-500",
    description: "When a young street hustler, a retired bank robber and a terrifying psychopath land themselves in trouble, they must pull off a series of dangerous heists.",
    tags: ["Action", "Open World", "Heist", "Multiplayer"],
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    developer: "Valve",
    genre: "FPS",
    rating: 4.6,
    price: "Free",
    size: "33.7 GB",
    cover: "💣",
    banner: "from-amber-800 via-orange-700 to-yellow-600",
    description: "The next era of Counter-Strike. Powered by Source 2, featuring physically-based rendering, state-of-the-art networking, and upgraded Community Workshop tools.",
    tags: ["FPS", "Tactical", "Competitive", "Multiplayer"],
  },
  {
    id: "amongus",
    name: "Among Us",
    developer: "Innersloth",
    genre: "Social",
    rating: 4.2,
    price: "$4.99",
    size: "450 MB",
    cover: "🛸",
    banner: "from-red-800 via-rose-700 to-pink-600",
    description: "Play with 4-15 players online or via local WiFi as you attempt to prepare your spaceship for departure, but beware as one or more random players are Impostors.",
    tags: ["Social", "Party", "Mystery", "Multiplayer"],
  },
  {
    id: "eldenring",
    name: "Elden Ring",
    developer: "FromSoftware",
    genre: "RPG",
    rating: 4.9,
    price: "$59.99",
    size: "60 GB",
    cover: "💍",
    banner: "from-yellow-800 via-amber-700 to-orange-600",
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    tags: ["RPG", "Souls-like", "Open World", "Fantasy"],
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk 2077",
    developer: "CD Projekt Red",
    genre: "RPG",
    rating: 4.5,
    price: "$59.99",
    size: "70 GB",
    cover: "🤖",
    banner: "from-yellow-500 via-pink-600 to-purple-700",
    description: "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary.",
    tags: ["RPG", "Open World", "Sci-Fi", "Action"],
  },
  {
    id: "rocketleague",
    name: "Rocket League",
    developer: "Psyonix",
    genre: "Sports",
    rating: 4.4,
    price: "Free",
    size: "25.2 GB",
    cover: "🚗",
    banner: "from-blue-700 via-sky-600 to-cyan-500",
    description: "Hit the field by yourself or with friends in 1v1, 2v2, and 3v3 Online Modes, or enjoy Extra Modes like Rumble, Snow Day, or Hoops.",
    tags: ["Sports", "Racing", "Competitive", "Multiplayer"],
  },
];

const genres = ["All", "Action", "FPS", "RPG", "Sandbox", "Battle Royale", "Social", "Sports", "Platform"];

export default function GameStore({ windowId: _windowId }: { windowId: string }) {
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [installed, setInstalled] = useState<InstalledGame[]>([]);
  const [downloading, setDownloading] = useState<Record<string, number>>({});
  const [tab, setTab] = useState<"store" | "library">("store");
  const downloadIntervals = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    return () => {
      Object.values(downloadIntervals.current).forEach(clearInterval);
    };
  }, []);

  const startDownload = useCallback((game: Game) => {
    if (downloading[game.id] !== undefined) return;
    setDownloading((prev) => ({ ...prev, [game.id]: 0 }));

    const interval = setInterval(() => {
      setDownloading((prev) => {
        const current = prev[game.id] ?? 0;
        const next = current + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          delete downloadIntervals.current[game.id];
          setInstalled((inst) => [
            ...inst,
            {
              id: game.id,
              name: game.name,
              cover: game.cover,
              size: game.size,
              installedAt: Date.now(),
            },
          ]);
          const rest = { ...prev };
          delete rest[game.id];
          return rest;
        }
        return { ...prev, [game.id]: next };
      });
    }, 300);
    downloadIntervals.current[game.id] = interval;
  }, [downloading]);

  const uninstall = useCallback((gameId: string) => {
    setInstalled((prev) => prev.filter((g) => g.id !== gameId));
  }, []);

  const isInstalled = useCallback(
    (gameId: string) => installed.some((g) => g.id === gameId),
    [installed]
  );

  const filtered = allGames.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.developer.toLowerCase().includes(search.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesGenre = activeGenre === "All" || g.genre === activeGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="flex flex-col h-full bg-[#0d0f1a]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#11141f]">
        <Gamepad2 className="w-5 h-5 text-indigo-400" />
        <h1 className="text-sm font-bold text-white/90 tracking-wide">Qynl Store</h1>
        <div className="flex-1" />
        {/* Tabs */}
        <div className="flex bg-white/5 rounded-lg p-0.5">
          <button
            onClick={() => setTab("store")}
            className={`px-3 py-1 text-[11px] rounded-md transition-all font-medium ${
              tab === "store"
                ? "bg-indigo-500/40 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            Store
          </button>
          <button
            onClick={() => setTab("library")}
            className={`px-3 py-1 text-[11px] rounded-md transition-all font-medium ${
              tab === "library"
                ? "bg-indigo-500/40 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <Monitor className="w-3 h-3 inline mr-1" />
            Library
            {installed.length > 0 && (
              <span className="ml-1 px-1 py-0.5 rounded bg-indigo-500/30 text-[9px]">
                {installed.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Store View */}
      {tab === "store" && (
        <>
          {/* Search & Filters */}
          <div className="px-4 py-2.5 flex items-center gap-2 border-b border-white/5 bg-[#0d0f1a]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex-1 max-w-xs focus-within:border-indigo-400/40 transition-colors">
              <Search className="w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games..."
                className="flex-1 bg-transparent text-xs text-white/70 outline-none placeholder:text-white/25"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition-all font-medium ${
                    activeGenre === g
                      ? "bg-indigo-500/30 text-indigo-300 border border-indigo-400/20"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {g === "All" && <TrendingUp className="w-3 h-3 inline mr-1" />}
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Game Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/20">
                <Gamepad2 className="w-12 h-12 mb-3" />
                <p className="text-sm">No games found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((game) => {
                  const installed = isInstalled(game.id);
                  const dl = downloading[game.id];
                  const isDownloading = dl !== undefined;

                  return (
                    <div
                      key={game.id}
                      className="group relative rounded-xl overflow-hidden border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
                    >
                      {/* Cover art */}
                      <div
                        className={`h-28 bg-gradient-to-br ${game.banner} flex items-center justify-center relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <span className="text-4xl relative z-10 drop-shadow-lg">
                          {game.cover}
                        </span>
                        {/* Rating badge */}
                        <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur text-[10px] text-yellow-400">
                          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                          {game.rating}
                        </div>
                        {/* Price badge */}
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur text-[10px] font-bold text-white/90">
                          {game.price}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-2.5">
                        <h3 className="text-xs font-semibold text-white/90 truncate">
                          {game.name}
                        </h3>
                        <p className="text-[10px] text-white/40 mt-0.5">
                          {game.developer} · {game.size}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {game.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-white/40"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Action button */}
                        <div className="mt-2">
                          {installed ? (
                            <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30 transition-all text-[11px] font-medium">
                              <Play className="w-3 h-3" />
                              Play
                            </button>
                          ) : isDownloading ? (
                            <div className="w-full">
                              <div className="flex items-center justify-between text-[10px] mb-1">
                                <span className="text-white/60">
                                  <Download className="w-3 h-3 inline mr-1" />
                                  Downloading
                                </span>
                                <span className="text-indigo-400 font-mono">
                                  {Math.round(dl)}%
                                </span>
                              </div>
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200"
                                  style={{ width: `${dl}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startDownload(game)}
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-400/40 transition-all text-[11px] font-medium"
                            >
                              <Download className="w-3 h-3" />
                              Install
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Library View */}
      {tab === "library" && (
        <div className="flex-1 overflow-y-auto p-4">
          {installed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/20">
              <Gamepad2 className="w-12 h-12 mb-3" />
              <p className="text-sm mb-2">Your library is empty</p>
              <button
                onClick={() => setTab("store")}
                className="px-4 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 text-xs hover:bg-indigo-500/30 transition-all"
              >
                Browse Games
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-white/80">
                  Installed Games ({installed.length})
                </h2>
              </div>
              {installed.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-2xl border border-white/5">
                    {game.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-white/80">
                      {game.name}
                    </h3>
                    <p className="text-[10px] text-white/30 flex items-center gap-2">
                      <span>{game.size}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                        Installed
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(game.installedAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30 transition-all text-[11px] font-medium flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Play
                    </button>
                    <button
                      onClick={() => uninstall(game.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                      title="Uninstall"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#11141f] border-t border-white/5">
        <span className="text-[10px] text-white/25">
          {installed.length} games installed · {allGames.length} available
        </span>
        <span className="text-[10px] text-white/20 font-mono">
          Qynl Store v1.0
        </span>
      </div>
    </div>
  );
}
