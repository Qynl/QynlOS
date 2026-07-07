export type AppId =
  | "terminal"
  | "explorer"
  | "editor"
  | "aichat"
  | "settings"
  | "calculator"
  | "systemmonitor"
  | "browser"
  | "gamestore";

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: string;
  component: React.ComponentType<{ windowId: string }>;
  defaultWidth: number;
  defaultHeight: number;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  prevState?: { x: number; y: number; width: number; height: number };
}

export interface WallpaperConfig {
  type: "gradient" | "solid" | "image";
  value: string;
  label: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  timestamp: number;
}
