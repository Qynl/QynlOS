// App Registry System

export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'browser' | 'game' | 'development' | 'utility' | 'media';
  executable: string;
  installed: boolean;
  size: number; // in MB
  version: string;
  author: string;
  downloadUrl?: string;
  requirements?: {
    minRam?: number;
    minGpu?: string;
  };
}

export interface AppStore {
  installedApps: Map<string, App>;
  availableApps: App[];
}

export const AVAILABLE_APPS: App[] = [
  // Browsers
  {
    id: 'brave-browser',
    name: 'Brave Browser',
    description: 'Fast, private, and secure web browsing',
    icon: '🔥',
    category: 'browser',
    executable: 'brave',
    installed: true,
    size: 156,
    version: '1.72.104',
    author: 'Brave Software',
  },
  {
    id: 'chrome-browser',
    name: 'Chrome Browser',
    description: 'Fast web browser by Google',
    icon: '🌐',
    category: 'browser',
    executable: 'chrome',
    installed: false,
    size: 218,
    version: '126.0.0.0',
    author: 'Google',
  },
  // Games
  {
    id: 'minecraft',
    name: 'Minecraft',
    description: 'Build, explore, and survive in an infinite world',
    icon: '⛏️',
    category: 'game',
    executable: 'minecraft',
    installed: false,
    size: 2840,
    version: '1.21',
    author: 'Mojang Studios',
    requirements: {
      minRam: 4,
      minGpu: 'GTX 960',
    },
  },
  {
    id: 'valorant',
    name: 'Valorant',
    description: 'Tactical 5v5 first-person shooter',
    icon: '🎯',
    category: 'game',
    executable: 'valorant',
    installed: false,
    size: 78,
    version: '8.14',
    author: 'Riot Games',
    requirements: {
      minRam: 8,
      minGpu: 'RTX 2060',
    },
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    description: 'Battle royale shooter game',
    icon: '🎮',
    category: 'game',
    executable: 'fortnite',
    installed: false,
    size: 120,
    version: '28.40',
    author: 'Epic Games',
    requirements: {
      minRam: 8,
      minGpu: 'GTX 1080',
    },
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    description: 'Competitive first-person shooter',
    icon: '🔫',
    category: 'game',
    executable: 'cs2',
    installed: false,
    size: 95,
    version: '1.0.15',
    author: 'Valve',
    requirements: {
      minRam: 8,
      minGpu: 'GTX 1650',
    },
  },
  {
    id: 'elden-ring',
    name: 'Elden Ring',
    description: 'Action role-playing game',
    icon: '⚔️',
    category: 'game',
    executable: 'elden-ring',
    installed: false,
    size: 128,
    version: '1.14',
    author: 'FromSoftware',
    requirements: {
      minRam: 16,
      minGpu: 'RTX 2080',
    },
  },
  // Development Tools
  {
    id: 'unreal-engine',
    name: 'Unreal Engine 5',
    description: 'Professional 3D engine for games and apps',
    icon: '🎬',
    category: 'development',
    executable: 'ue5',
    installed: false,
    size: 145,
    version: '5.4.4',
    author: 'Epic Games',
    requirements: {
      minRam: 32,
      minGpu: 'RTX 3080',
    },
  },
  {
    id: 'unity',
    name: 'Unity',
    description: 'Professional game engine',
    icon: '🕹️',
    category: 'development',
    executable: 'unity',
    installed: false,
    size: 89,
    version: '2022.3.25',
    author: 'Unity Technologies',
    requirements: {
      minRam: 16,
      minGpu: 'RTX 2070',
    },
  },
  {
    id: 'vs-code',
    name: 'Visual Studio Code',
    description: 'Lightweight code editor',
    icon: '💻',
    category: 'development',
    executable: 'code',
    installed: false,
    size: 380,
    version: '1.92.2',
    author: 'Microsoft',
  },
  {
    id: 'blender',
    name: 'Blender',
    description: '3D modeling and animation software',
    icon: '🎨',
    category: 'development',
    executable: 'blender',
    installed: false,
    size: 267,
    version: '4.1.1',
    author: 'Blender Foundation',
    requirements: {
      minRam: 8,
      minGpu: 'RTX 2060',
    },
  },
  // Utilities
  {
    id: 'file-explorer',
    name: 'File Explorer',
    description: 'Browse and manage files',
    icon: '📁',
    category: 'utility',
    executable: 'fileexplorer',
    installed: true,
    size: 45,
    version: '1.0.0',
    author: 'QynlOS',
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configure system settings',
    icon: '⚙️',
    category: 'utility',
    executable: 'settings',
    installed: true,
    size: 32,
    version: '1.0.0',
    author: 'QynlOS',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Monitor processes and performance',
    icon: '📊',
    category: 'utility',
    executable: 'taskmgr',
    installed: true,
    size: 28,
    version: '1.0.0',
    author: 'QynlOS',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Command-line interface',
    icon: '⌨️',
    category: 'utility',
    executable: 'terminal',
    installed: true,
    size: 12,
    version: '1.0.0',
    author: 'QynlOS',
  },
  // Media
  {
    id: 'vlc-player',
    name: 'VLC Media Player',
    description: 'Play any video or audio file',
    icon: '🎵',
    category: 'media',
    executable: 'vlc',
    installed: false,
    size: 98,
    version: '3.0.20',
    author: 'VideoLAN',
  },
  {
    id: 'obs-studio',
    name: 'OBS Studio',
    description: 'Open broadcaster software for streaming',
    icon: '🎥',
    category: 'media',
    executable: 'obs',
    installed: false,
    size: 142,
    version: '30.2.2',
    author: 'OBS Project',
  },
];

export class AppRegistry {
  private installedApps: Map<string, App> = new Map();
  private availableApps: App[] = [...AVAILABLE_APPS];

  constructor() {
    // Initialize with pre-installed apps
    for (const app of this.availableApps) {
      if (app.installed) {
        this.installedApps.set(app.id, { ...app });
      }
    }
  }

  /**
   * Get all installed applications
   */
  getInstalledApps(): App[] {
    return Array.from(this.installedApps.values());
  }

  /**
   * Get all available apps (including installed)
   */
  getAvailableApps(): App[] {
    return this.availableApps.map((app) => ({
      ...app,
      installed: this.installedApps.has(app.id),
    }));
  }

  /**
   * Get app by ID
   */
  getApp(appId: string): App | null {
    if (this.installedApps.has(appId)) {
      return this.installedApps.get(appId) || null;
    }
    return this.availableApps.find((a) => a.id === appId) || null;
  }

  /**
   * Install an application
   */
  installApp(appId: string): boolean {
    if (this.installedApps.has(appId)) {
      return false; // Already installed
    }

    const app = this.availableApps.find((a) => a.id === appId);
    if (!app) {
      return false;
    }

    const installedApp: App = { ...app, installed: true };
    this.installedApps.set(appId, installedApp);
    return true;
  }

  /**
   * Uninstall an application
   */
  uninstallApp(appId: string): boolean {
    if (!this.installedApps.has(appId)) {
      return false;
    }

    const app = this.installedApps.get(appId);
    if (app && ['terminal', 'file-explorer', 'settings', 'task-manager'].includes(appId)) {
      return false; // Can't uninstall system apps
    }

    this.installedApps.delete(appId);
    return true;
  }

  /**
   * Get apps by category
   */
  getAppsByCategory(category: App['category']): App[] {
    return this.getInstalledApps().filter((app) => app.category === category);
  }

  /**
   * Search apps
   */
  searchApps(query: string): App[] {
    const q = query.toLowerCase();
    return this.availableApps
      .map((app) => ({
        ...app,
        installed: this.installedApps.has(app.id),
      }))
      .filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q)
      );
  }

  /**
   * Get total installed app size
   */
  getTotalInstalledSize(): number {
    return Array.from(this.installedApps.values()).reduce(
      (sum, app) => sum + app.size,
      0
    );
  }
}
