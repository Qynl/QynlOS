import { OSProvider, useOS } from "@/lib/os-context";
import Desktop from "@/components/os/Desktop";
import Taskbar from "@/components/os/Taskbar";
import LandingPage from "@/components/os/LandingPage";
import BootScreen from "@/components/os/BootScreen";
import { AnimatePresence, motion } from "framer-motion";

function DesktopOS() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-screen overflow-hidden flex flex-col bg-black"
    >
      <Desktop />
      <Taskbar />
    </motion.div>
  );
}

function AppShell() {
  const { mode } = useOS();

  return (
    <AnimatePresence mode="wait">
      {mode === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <LandingPage />
        </motion.div>
      )}
      {mode === "booting" && (
        <motion.div
          key="booting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BootScreen />
        </motion.div>
      )}
      {mode === "os" && (
        <motion.div
          key="os"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DesktopOS />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <OSProvider>
      <AppShell />
    </OSProvider>
  );
}
