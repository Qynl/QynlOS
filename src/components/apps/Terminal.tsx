import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Line {
  text: string;
  type: "input" | "output" | "error" | "system";
}

const filesystem: Record<string, { type: "file" | "dir"; content?: string }> =
  {
    "/": { type: "dir" },
    "/home": { type: "dir" },
    "/home/qynl": { type: "dir" },
    "/home/qynl/Documents": { type: "dir" },
    "/home/qynl/Downloads": { type: "dir" },
    "/home/qynl/Projects": { type: "dir" },
    "/home/qynl/Pictures": { type: "dir" },
    "/home/qynl/hello.txt": {
      type: "file",
      content: "Welcome to QynlOS!\nYour free, open-source operating system.",
    },
    "/home/qynl/Documents/readme.md": {
      type: "file",
      content: "# QynlOS\n\nThe OS of the future. Built for everyone.",
    },
    "/home/qynl/Documents/notes.txt": {
      type: "file",
      content: "TODO:\n- Build the OS\n- Add local AI\n- Change the world",
    },
  };

function getDirContents(currentPath: string): string[] {
  const prefix = currentPath === "/" ? "" : currentPath;
  const entries = new Set<string>();
  for (const key of Object.keys(filesystem)) {
    if (key === currentPath) continue;
    if (key.startsWith(prefix + "/")) {
      const rest = key.slice(prefix.length + 1);
      const name = rest.split("/")[0];
      if (name) entries.add(name);
    }
  }
  return Array.from(entries).sort();
}

function resolvePath(current: string, target: string): string {
  if (target.startsWith("/")) return target;
  const parts = [...current.split("/").filter(Boolean), ...target.split("/")];
  const resolved: string[] = [];
  for (const p of parts) {
    if (p === "." || p === "") continue;
    if (p === "..") {
      resolved.pop();
    } else {
      resolved.push(p);
    }
  }
  return "/" + resolved.join("/");
}

export default function Terminal({ windowId: _windowId }: { windowId: string }) {
  const [lines, setLines] = useState<Line[]>([
    { text: "QynlOS Terminal v0.1", type: "system" },
    { text: "Type 'help' for available commands.", type: "system" },
    { text: "", type: "output" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [cwd, setCwd] = useState("/home/qynl");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      const newLines: Line[] = [
        ...lines,
        { text: `qynl@QynlOS:${cwd}$ ${trimmed}`, type: "input" },
      ];

      if (!trimmed) {
        setLines(newLines);
        return;
      }

      const parts = trimmed.split(/\s+/);
      const command = parts[0];
      const args = parts.slice(1);

      switch (command) {
        case "help":
          newLines.push({
            text: `Available commands:
  help      - Show this help message
  ls        - List directory contents
  cd <dir>  - Change directory
  pwd       - Print working directory
  echo <t>  - Print text
  cat <f>   - Show file contents
  mkdir <d> - Create directory
  whoami    - Show current user
  neofetch  - Show system info
  clear     - Clear the terminal
  date      - Show current date/time
  uname     - Print system information`,
            type: "output",
          });
          break;

        case "ls": {
          const target = args[0] || cwd;
          const path = resolvePath(cwd, target);
          const contents = getDirContents(path);
          const items = contents.map((name) => {
            const fullPath = path === "/" ? `/${name}` : `${path}/${name}`;
            return filesystem[fullPath]?.type === "dir" ? `${name}/` : name;
          });
          newLines.push({
            text: items.join("  ") || "(empty)",
            type: "output",
          });
          break;
        }

        case "cd": {
          const target = args[0] || "/home/qynl";
          const newPath = resolvePath(cwd, target);
          if (filesystem[newPath]?.type === "dir" || newPath === "/") {
            setCwd(newPath);
          } else {
            newLines.push({
              text: `cd: ${target}: No such directory`,
              type: "error",
            });
          }
          break;
        }

        case "pwd":
          newLines.push({ text: cwd, type: "output" });
          break;

        case "echo":
          newLines.push({ text: args.join(" ") || "", type: "output" });
          break;

        case "cat": {
          if (!args[0]) {
            newLines.push({ text: "cat: missing operand", type: "error" });
            break;
          }
          const filePath = resolvePath(cwd, args[0]);
          const file = filesystem[filePath];
          if (file?.type === "file") {
            newLines.push({ text: file.content || "", type: "output" });
          } else {
            newLines.push({
              text: `cat: ${args[0]}: No such file`,
              type: "error",
            });
          }
          break;
        }

        case "mkdir":
          newLines.push({
            text: `mkdir: created directory '${args[0]}'`,
            type: "output",
          });
          break;

        case "whoami":
          newLines.push({ text: "qynl", type: "output" });
          break;

        case "date":
          newLines.push({ text: new Date().toString(), type: "output" });
          break;

        case "uname":
          newLines.push({ text: "QynlOS 0.1 x86_64", type: "output" });
          break;

        case "neofetch":
          newLines.push({
            text: `       .---.        qynl@QynlOS
      /     \\       --------
     |  O O  |      OS: QynlOS v0.1
      \\  v  /       Host: Quantum Core
       '---'        Kernel: Qynl 6.8.0
      /     \\       Uptime: forever
     /       \\      Shell: QynlSH 1.0
    /  O   O  \\     AI: Ollama Ready
   /___________\\    Memory: 1337/8192 MB`,
            type: "output",
          });
          break;

        case "clear":
          setLines([
            { text: "QynlOS Terminal v0.1", type: "system" },
            { text: "Type 'help' for available commands.", type: "system" },
            { text: "", type: "output" },
          ]);
          return;

        default:
          newLines.push({
            text: `bash: ${command}: command not found`,
            type: "error",
          });
      }

      setLines(newLines);
    },
    [lines, cwd]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        executeCommand(currentInput);
        setCurrentInput("");
      }
    },
    [currentInput, executeCommand]
  );

  return (
    <div
      className="h-full bg-black/70 text-sm font-mono flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap",
              line.type === "input" && "text-green-400/90",
              line.type === "output" && "text-white/80",
              line.type === "error" && "text-red-400",
              line.type === "system" && "text-blue-400/60 text-xs"
            )}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center mt-1">
          <span className="text-green-400/90">qynl@QynlOS:{cwd}$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none ml-2 text-white/90 caret-white/70"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
