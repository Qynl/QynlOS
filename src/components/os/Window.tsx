import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";

interface WindowProps {
  id: string;
  title: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  focused: boolean;
  maximized: boolean;
  children: ReactNode;
}

export default function Window({
  id,
  title,
  x,
  y: _y,
  width,
  height,
  zIndex,
  focused,
  maximized,
  children,
}: WindowProps) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize,
    snapWindow,
  } = useOS();

  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, px: 0, py: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (_e: React.MouseEvent) => {
      focusWindow(id);
    },
    [id, focusWindow]
  );

  const handleTitleMouseDown = useCallback(
    (ev: React.MouseEvent) => {
      focusWindow(id);
      if (maximized) return;
      setIsDragging(true);
      const rect = dragRef.current?.parentElement?.getBoundingClientRect();
      dragStartPos.current = { x: ev.clientX, y: ev.clientY };
      if (rect) {
        resizeStart.current = {
          x: ev.clientX - rect.left,
          y: ev.clientY - rect.top,
          w: rect.width,
          h: rect.height,
          px: rect.left,
          py: rect.top,
        };
      }
    },
    [id, focusWindow, maximized]
  );

  const handleResizeStart = useCallback(
    (direction: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setIsResizing(direction);
      const rect = dragRef.current?.parentElement?.getBoundingClientRect();
      if (rect) {
        resizeStart.current = {
          x: e.clientX,
          y: e.clientY,
          w: rect.width,
          h: rect.height,
          px: rect.left,
          py: rect.top,
        };
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && !maximized) {
        const nx = e.clientX - resizeStart.current.x;
        const ny = e.clientY - resizeStart.current.y;
        updateWindowPosition(id, nx, ny);
      }
      if (isResizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        let nw = resizeStart.current.w;
        let nh = resizeStart.current.h;
        let nx = resizeStart.current.px;
        let ny = resizeStart.current.py;

        if (isResizing.includes("e")) nw = Math.max(300, resizeStart.current.w + dx);
        if (isResizing.includes("s")) nh = Math.max(200, resizeStart.current.h + dy);
        if (isResizing.includes("w")) {
          nw = Math.max(300, resizeStart.current.w - dx);
          nx = resizeStart.current.px + dx;
        }
        if (isResizing.includes("n")) {
          nh = Math.max(200, resizeStart.current.h - dy);
          ny = resizeStart.current.py + dy;
        }

        updateWindowSize(id, nw, nh);
        updateWindowPosition(id, nx, ny);
      }
    },
    [isDragging, isResizing, maximized, id, updateWindowPosition, updateWindowSize]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && !maximized) {
        // Snap detection
        const threshold = 60;
        const mouseEndX = e.clientX;
        const mouseEndY = e.clientY;

        // Check for snap
        if (mouseEndX - resizeStart.current.x <= threshold && mouseEndY <= 40) {
          snapWindow(id, "left");
        } else if (window.innerWidth - mouseEndX <= threshold && mouseEndY <= 40) {
          snapWindow(id, "right");
        }
      }
      setIsDragging(false);
      setIsResizing(null);
    },
    [isDragging, maximized, id, snapWindow]
  );

  const displayWidth = maximized ? "100vw" : width;
  const displayHeight = maximized ? "calc(100vh - 56px)" : height;
  const displayX = maximized ? 0 : x;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: displayX,
        width: displayWidth,
        height: displayHeight,
      }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
      style={{ zIndex }}
      className={cn(
        "absolute rounded-lg overflow-hidden shadow-2xl border",
        focused
          ? "border-white/20 shadow-black/40"
          : "border-white/5 shadow-black/20",
        maximized ? "rounded-none !top-0 !left-0" : "",
        isDragging && "shadow-2xl shadow-indigo-500/10 scale-[1.02] transition-shadow"
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Title bar */}
      <div
        ref={dragRef}
        onMouseDown={handleTitleMouseDown}
        className={cn(
          "flex items-center h-10 px-3 select-none cursor-default",
          "bg-white/[0.06] backdrop-blur-xl border-b border-white/10",
          focused ? "bg-white/[0.08]" : ""
        )}
        onDoubleClick={() =>
          maximized ? restoreWindow(id) : maximizeWindow(id)
        }
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 mr-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 hover:scale-110 transition-all"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 hover:scale-110 transition-all"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximized ? restoreWindow(id) : maximizeWindow(id);
            }}
            className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 hover:scale-110 transition-all"
          />
        </div>
        {/* Title */}
        <span className="text-xs text-white/60 font-medium truncate flex-1 text-center mr-16">
          {title}
        </span>
      </div>

      {/* Content */}
      <div
        className="bg-black/50 backdrop-blur-2xl overflow-auto"
        style={{
          height: maximized ? "calc(100vh - 56px - 40px)" : `calc(${height}px - 40px)`,
        }}
      >
        {children}
      </div>

      {/* Resize handles */}
      {!maximized && (
        <>
          <div
            className="absolute top-0 left-0 w-2 h-full cursor-col-resize hover:bg-white/10 transition-colors"
            style={{ left: 0, top: 0 }}
            onMouseDown={(e) => handleResizeStart("w", e)}
          />
          <div
            className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-white/10 transition-colors"
            onMouseDown={(e) => handleResizeStart("e", e)}
          />
          <div
            className="absolute bottom-0 left-0 h-2 w-full cursor-row-resize hover:bg-white/10 transition-colors"
            onMouseDown={(e) => handleResizeStart("s", e)}
          />
          <div
            className="absolute top-0 left-0 h-2 w-full cursor-row-resize hover:bg-white/10 transition-colors"
            onMouseDown={(e) => handleResizeStart("n", e)}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart("se", e)}
          />
        </>
      )}
    </motion.div>
  );
}
