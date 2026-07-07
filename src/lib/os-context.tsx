import React, { createContext, useContext, useState, useCallback } from 'react';
import { Kernel } from './kernel/kernel';

interface OSContextType {
  mode: 'landing' | 'booting' | 'os';
  setMode: (mode: 'landing' | 'booting' | 'os') => void;
  kernel: Kernel | null;
  initializeOS: () => Promise<void>;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'landing' | 'booting' | 'os'>('landing');
  const [kernel, setKernel] = useState<Kernel | null>(null);

  const initializeOS = useCallback(async () => {
    setMode('booting');

    // Simulate boot sequence
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create and boot kernel
    const newKernel = new Kernel();
    newKernel.boot();
    setKernel(newKernel);

    setMode('os');
  }, []);

  return (
    <OSContext.Provider value={{ mode, setMode, kernel, initializeOS }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOS must be used within OSProvider');
  }
  return context;
}
