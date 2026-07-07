import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Folder, File, Home, ArrowLeft } from "lucide-react";

interface FSNode {
  name: string;
  type: "file" | "dir";
  content?: string;
  children?: FSNode[];
}

const fileTree: FSNode[] = [
  {
    name: "home",
    type: "dir",
    children: [
      {
        name: "qynl",
        type: "dir",
        children: [
          {
            name: "Documents",
            type: "dir",
            children: [
              {
                name: "readme.md",
                type: "file",
                content: "# QynlOS\n\nThe OS of the future. Built for everyone.",
              },
              {
                name: "notes.txt",
                type: "file",
                content: "TODO:\n- Build the OS\n- Add local AI\n- Change the world",
              },
            ],
          },
          { name: "Downloads", type: "dir", children: [] },
          {
            name: "Projects",
            type: "dir",
            children: [
              {
                name: "qynlos",
                type: "dir",
                children: [
                  {
                    name: "README.md",
                    type: "file",
                    content: "# QynlOS\nFree and open-source OS",
                  },
                ],
              },
            ],
          },
          { name: "Pictures", type: "dir", children: [] },
          {
            name: "hello.txt",
            type: "file",
            content: "Welcome to QynlOS!\nYour free, open-source operating system.",
          },
        ],
      },
    ],
  },
];

function findNode(
  nodes: FSNode[],
  path: string[]
): FSNode | null {
  if (path.length === 0) return null;
  const name = path[0];
  const node = nodes.find((n) => n.name === name);
  if (!node) return null;
  if (path.length === 1) return node;
  if (node.children) return findNode(node.children, path.slice(1));
  return null;
}

export default function FileExplorer({ windowId: _windowId }: { windowId: string }) {
  const [currentPath, setCurrentPath] = useState<string[]>(["home", "qynl"]);
  const [selectedFile, setSelectedFile] = useState<FSNode | null>(null);

  const currentDir = findNode(fileTree, currentPath);
  const children = currentDir?.children || [];

  const navigateTo = useCallback(
    (child: FSNode) => {
      if (child.type === "dir") {
        setCurrentPath((prev) => [...prev, child.name]);
        setSelectedFile(null);
      } else {
        setSelectedFile(child);
      }
    },
    []
  );

  const navigateUp = useCallback(() => {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
      setSelectedFile(null);
    }
  }, [currentPath]);

  const navigateHome = useCallback(() => {
    setCurrentPath(["home", "qynl"]);
    setSelectedFile(null);
  }, []);

  return (
    <div className="h-full flex flex-col text-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-white/[0.03] border-b border-white/5">
        <button
          onClick={navigateUp}
          disabled={currentPath.length <= 1}
          className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 text-white/60" />
        </button>
        <button onClick={navigateHome} className="p-1 rounded hover:bg-white/10">
          <Home className="w-4 h-4 text-white/60" />
        </button>
        <div className="flex items-center gap-1 ml-2 text-xs text-white/50">
          {currentPath.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              <span className="text-white/70">{part}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File list */}
        <div className="flex-1 overflow-y-auto p-2">
          {children.length === 0 && (
            <div className="text-white/30 text-xs text-center mt-8">
              This folder is empty
            </div>
          )}
          {children.map((child) => (
            <button
              key={child.name}
              onClick={() => navigateTo(child)}
              className={cn(
                "flex items-center gap-2 w-full px-2 py-1.5 rounded-lg transition-colors text-left",
                selectedFile?.name === child.name && selectedFile?.type === child.type
                  ? "bg-white/15"
                  : "hover:bg-white/10"
              )}
            >
              {child.type === "dir" ? (
                <Folder className="w-4 h-4 text-blue-400" />
              ) : (
                <File className="w-4 h-4 text-white/40" />
              )}
              <span className="text-white/80 text-sm">{child.name}</span>
            </button>
          ))}
        </div>

        {/* Preview panel */}
        {selectedFile && (
          <div className="w-64 border-l border-white/5 bg-white/[0.02] p-3 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <File className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/80 font-medium">
                {selectedFile.name}
              </span>
            </div>
            <pre className="text-xs text-white/60 whitespace-pre-wrap">
              {selectedFile.content || "(binary file)"}
            </pre>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-1 bg-white/[0.02] border-t border-white/5 text-[10px] text-white/30">
        {children.length} items
      </div>
    </div>
  );
}
