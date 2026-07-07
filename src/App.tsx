import { OSProvider, useOS } from "@/lib/os-context";
import Desktop from "@/components/os/Desktop";
import Taskbar from "@/components/os/Taskbar";
import LandingPage from "@/components/os/LandingPage";
import BootScreen from "@/components/os/BootScreen";

function DesktopOS() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-black">
      <Desktop />
      <Taskbar />
    </div>
  );
}

function AppShell() {
  const { mode } = useOS();

  return (
    <>
      {mode === "landing" && <LandingPage />}
      {mode === "booting" && <BootScreen />}
      {mode === "os" && <DesktopOS />}
    </>
  );
}

export default function App() {
  return (
    <OSProvider>
      <AppShell />
    </OSProvider>
  );
}
