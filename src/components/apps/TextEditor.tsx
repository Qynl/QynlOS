import { useState, useCallback } from "react";

export default function TextEditor({ windowId: _windowId }: { windowId: string }) {
  const [content, setContent] = useState(`// Welcome to QynlOS Editor
// Start typing your code below

function greet(name: string) {
  return \`Hello, \${name}! Welcome to QynlOS.\`;
}

console.log(greet("User"));

// QynlOS - The OS of the future
// Free, open-source, AI-powered
`);
  const [filename, setFilename] = useState("hello.ts");
  const [saved, setSaved] = useState(true);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      setSaved(false);
    },
    []
  );

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-white/50">File:</span>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-white/10 px-2 py-0.5 rounded text-xs text-white/80 outline-none border border-white/5 focus:border-white/20 w-32"
          />
        </div>
        <div className="flex-1" />
        <span className="text-[10px] text-white/30">
          {saved ? "Saved" : "Unsaved"}
        </span>
        <button
          onClick={handleSave}
          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-xs text-white/70 transition-colors"
        >
          Save
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-black/30 text-sm text-white/80 font-mono p-4 outline-none resize-none border-none"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
          lineHeight: "1.6",
          tabSize: 2,
        }}
        spellCheck={false}
        autoFocus
      />

      {/* Status bar */}
      <div className="px-3 py-1 bg-white/[0.02] border-t border-white/5 text-[10px] text-white/30 flex items-center gap-4">
        <span>UTF-8</span>
        <span>TypeScript</span>
        <span>Ln {content.split("\n").length}, Col {content.split("\n").pop()?.length || 0}</span>
      </div>
    </div>
  );
}
