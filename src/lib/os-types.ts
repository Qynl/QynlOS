export type AppId = "terminal" | "explorer" | "editor" | "aichat" | "settings";

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
}

export interface WallpaperConfig {
  type: "gradient" | "solid" | "image";
  value: string;
  label: string;
}
