// OS Type Definitions

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  content?: string;
  children?: Map<string, FileNode>;
  created: number;
  modified: number;
  permissions: number; // Unix-style: rwxrwxrwx
  owner: string;
}

export interface Process {
  id: string;
  name: string;
  pid: number;
  ppid: number | null; // parent process ID
  state: 'running' | 'suspended' | 'stopped' | 'zombie';
  memory: number;
  cpu: number;
  created: number;
  cwd: string; // current working directory
  env: Record<string, string>;
  exitCode?: number;
}

export interface SystemCall {
  name: string;
  args: unknown[];
  timestamp: number;
}

export interface FileDescriptor {
  fd: number;
  path: string;
  mode: 'r' | 'w' | 'rw';
  position: number;
  process: Process;
}

export interface MemoryPage {
  address: number;
  size: number;
  data: Uint8Array;
  flags: 'read' | 'write' | 'execute';
}

export interface Signal {
  signum: number;
  name: string;
  handler?: (process: Process) => void;
}

export enum SignalType {
  SIGHUP = 1,
  SIGINT = 2,
  SIGQUIT = 3,
  SIGKILL = 9,
  SIGSEGV = 11,
  SIGTERM = 15,
}
