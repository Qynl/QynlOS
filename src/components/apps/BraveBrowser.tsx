import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Star,
  Globe,
  Shield,
} from "lucide-react";

const bookmarks = [
  { name: "Google", url: "https://www.google.com/webhp?igu=1", icon: "🔍" },
  { name: "YouTube", url: "https://www.youtube.com/embed", icon: "▶️" },
  { name: "GitHub", url: "https://github.com", icon: "🐙" },
  { name: "Wikipedia", url: "https://en.wikipedia.org", icon: "📚" },
  { name: "Reddit", url: "https://www.reddit.com", icon: "🤖" },
  { name: "Twitch", url: "https://www.twitch.tv", icon: "🎮" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "🛠️" },
  { name: "MDN", url: "https://developer.mozilla.org", icon: "📖" },
];

const defaultHome = "https://www.google.com/webhp?igu=1";

export default function BraveBrowser({ windowId: _windowId }: { windowId: string }) {
  const [url, setUrl] = useState(defaultHome);
  const [inputUrl, setInputUrl] = useState(defaultHome);
  const [iframeUrl, setIframeUrl] = useState(defaultHome);
  const [history, setHistory] = useState<string[]>([defaultHome]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useCallback(
    (target: string) => {
      let finalUrl = target;
      if (!/^https?:\/\//i.test(finalUrl)) {
        if (finalUrl.includes(".") && !finalUrl.includes(" ")) {
          finalUrl = "https://" + finalUrl;
        } else {
          finalUrl =
            "https://www.google.com/search?igu=1&q=" +
            encodeURIComponent(finalUrl);
        }
      }
      setUrl(finalUrl);
      setInputUrl(finalUrl);
      setIframeUrl(finalUrl);
      setIsLoading(true);
      const newHistory = history.slice(0, historyIdx + 1);
      newHistory.push(finalUrl);
      setHistory(newHistory);
      setHistoryIdx(newHistory.length - 1);
    },
    [history, historyIdx]
  );

  const goBack = useCallback(() => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      setUrl(history[newIdx]);
      setInputUrl(history[newIdx]);
      setIframeUrl(history[newIdx]);
      setIsLoading(true);
    }
  }, [history, historyIdx]);

  const goForward = useCallback(() => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      setUrl(history[newIdx]);
      setInputUrl(history[newIdx]);
      setIframeUrl(history[newIdx]);
      setIsLoading(true);
    }
  }, [history, historyIdx]);

  const goHome = useCallback(() => {
    navigate(defaultHome);
  }, [navigate]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setIframeUrl((u) => u + "");
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        navigate(inputUrl);
        inputRef.current?.blur();
      }
    },
    [inputUrl, navigate]
  );

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#1a1b2e]">
      {/* Brave header bar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-white/10 bg-[#1e1f35]">
        {/* Navigation buttons */}
        <button
          onClick={goBack}
          disabled={historyIdx <= 0}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIdx >= history.length - 1}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Forward"
        >
          <ArrowRight className="w-4 h-4 text-white/70" />
        </button>
        <button
          onClick={refresh}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Refresh"
        >
          <RotateCw
            className={`w-4 h-4 text-white/70 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
        <button
          onClick={goHome}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Home"
        >
          <Home className="w-4 h-4 text-white/70" />
        </button>

        {/* Address bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-indigo-400/50 focus-within:bg-white/8 transition-all">
          {isLoading ? (
            <Shield className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          ) : (
            <Globe className="w-3.5 h-3.5 text-white/40" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputRef.current?.select()}
            className="flex-1 bg-transparent text-xs text-white/80 outline-none placeholder:text-white/30 font-mono"
            placeholder="Search or enter URL..."
          />
          {url.startsWith("https://") && (
            <Shield className="w-3 h-3 text-green-400" />
          )}
        </div>

        {/* Bookmarks button */}
        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className={`p-1.5 rounded-lg transition-colors ${
            showBookmarks ? "bg-indigo-500/30 text-indigo-300" : "hover:bg-white/10 text-white/70"
          }`}
          title="Bookmarks"
        >
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Bookmarks bar */}
      {showBookmarks && (
        <div className="flex items-center gap-0.5 px-3 py-1.5 bg-[#1a1b2e] border-b border-white/5 overflow-x-auto scrollbar-none">
          {bookmarks.map((bm) => (
            <button
              key={bm.name}
              onClick={() => {
                navigate(bm.url);
                setShowBookmarks(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-white/60 hover:bg-white/10 hover:text-white/90 transition-all whitespace-nowrap shrink-0"
            >
              <span className="text-sm">{bm.icon}</span>
              {bm.name}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 relative bg-white">
        {iframeUrl && (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={handleIframeLoad}
            title="Brave Browser"
          />
        )}
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a1b2e]/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-orange-400 animate-pulse" />
              <span className="text-sm text-white/60">Loading with Brave Shields...</span>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#1e1f35] border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] text-orange-400/80 font-medium">
              Shields UP
            </span>
          </div>
          <span className="text-[10px] text-white/20">·</span>
          <span className="text-[10px] text-white/30">
            {bookmarks.length} trackers blocked
          </span>
        </div>
        <span className="text-[10px] text-white/20 font-mono truncate max-w-[40%]">
          {url}
        </span>
      </div>
    </div>
  );
}
