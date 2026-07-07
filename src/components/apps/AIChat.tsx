import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const OLLAMA_URL =
  import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434";
const DEFAULT_MODEL =
  import.meta.env.VITE_OLLAMA_MODEL || "llama3.2";

export default function AIChat({ windowId: _windowId }: { windowId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hey! I'm QynlAI, your local AI assistant. I run on Ollama and everything stays on your machine. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [model] = useState(DEFAULT_MODEL);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await fetch(`${OLLAMA_URL}/api/tags`);
      if (res.ok) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    } catch {
      setConnected(false);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama error: ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message?.content || "No response",
        },
      ]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Connection failed";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Couldn't reach Ollama: ${errorMessage}\n\nMake sure Ollama is running locally.\n\n**Setup:**\n\`\`\`bash\n# Install Ollama\ncurl -fsSL https://ollama.ai/install.sh | sh\n\n# Pull a model\nollama pull ${model}\n\`\`\``,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, model]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Connection banner */}
      <div
        className={cn(
          "px-3 py-1 text-[10px] flex items-center gap-2",
          connected === true
            ? "bg-green-900/30 text-green-400"
            : connected === false
            ? "bg-yellow-900/30 text-yellow-400"
            : "bg-white/[0.03] text-white/40"
        )}
      >
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            connected === true
              ? "bg-green-400"
              : connected === false
              ? "bg-yellow-400"
              : "bg-white/30"
          )}
        />
        {connected === true
          ? `Connected to Ollama (${model})`
          : connected === false
          ? "Ollama not detected — responses will be simulated"
          : "Checking connection..."}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-blue-600/30 text-white/90 border border-blue-500/20"
                  : msg.role === "system"
                  ? "bg-white/[0.03] text-white/60 text-xs"
                  : "bg-white/[0.06] text-white/90 border border-white/5"
              )}
            >
              <pre
                className={cn(
                  "whitespace-pre-wrap font-sans",
                  msg.role === "assistant" && "text-sm"
                )}
                style={{ fontFamily: "inherit" }}
              >
                {msg.content}
              </pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.06] rounded-xl px-3 py-2 border border-white/5">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-white/5">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask QynlAI anything..."
            rows={2}
            className="flex-1 bg-white/[0.06] rounded-xl px-3 py-2 text-sm text-white/90 outline-none border border-white/5 focus:border-white/20 resize-none"
            style={{ scrollbarWidth: "thin" }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-blue-600/50 hover:bg-blue-600/70 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-colors text-white/90"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19V5m0 0l-7 7m7-7l7 7"
              />
            </svg>
          </button>
        </div>
        <div className="mt-1 text-[10px] text-white/20 px-1">
          Powered by Ollama · Local & Private
        </div>
      </div>
    </div>
  );
}
