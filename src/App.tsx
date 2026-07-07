import { OSProvider, useOS } from "@/lib/os-context";
import Desktop from "@/components/os/Desktop";
import Taskbar from "@/components/os/Taskbar";
import { useEffect } from "react";

function BootScreen() {
  const { openApp } = useOS();

  useEffect(() => {
    // Auto-open AI Chat on first load with a delay for dramatic effect
    const timer = setTimeout(() => {
      openApp("aichat", "AI Chat");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

function QynlOS() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-black">
      <Desktop />
      <Taskbar />
      <BootScreen />
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <QynlOS />
    </OSProvider>
  );
}
